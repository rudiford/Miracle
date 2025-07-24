import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import MemoryStore from "memorystore";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const sessionStore = MemoryStore(session);
  return session({
    secret: process.env.SESSION_SECRET!,
    store: new sessionStore({
      checkPeriod: sessionTtl,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
      sameSite: 'lax',
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  // Check if user already exists to preserve custom profile data
  const existingUser = await storage.getUser(claims["sub"]);
  
  const userData = {
    id: claims["sub"],
    email: claims["email"],
    profileImageUrl: claims["profile_image_url"],
    // Only update name fields if user doesn't exist yet (preserve custom names)
    firstName: existingUser?.firstName || claims["first_name"],
    lastName: existingUser?.lastName || claims["last_name"],
  };
  
  await storage.upsertUser(userData);
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  // Get domains and add localhost for development  
  const domains = process.env.REPLIT_DOMAINS!.split(",");
  domains.push("localhost:5000"); // Add localhost for development
  
  for (const domain of domains) {
    const trimmedDomain = domain.trim();
    console.log(`Setting up auth strategy for domain: ${trimmedDomain}`);
    const isLocalhost = trimmedDomain.includes('localhost');
    const protocol = isLocalhost ? 'http' : 'https';
    
    const strategy = new Strategy(
      {
        name: `replitauth:${trimmedDomain.replace(':5000', '')}`, // Use clean domain name for strategy
        config,
        scope: "openid email profile offline_access",
        callbackURL: `${protocol}://${trimmedDomain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    const hostname = req.hostname;
    const host = req.headers.host || hostname;
    console.log(`Login attempt for hostname: ${hostname}, host: ${host}`);
    
    // Use the actual hostname for strategy lookup (without port for localhost)
    const strategyDomain = hostname === 'localhost' ? 'localhost' : hostname;
    const strategyName = `replitauth:${strategyDomain}`;
    
    console.log(`Looking for strategy: ${strategyName}`);
    
    try {
      passport.authenticate(strategyName, {
        prompt: "login consent",
        scope: ["openid", "email", "profile", "offline_access"],
      })(req, res, next);
    } catch (error) {
      console.error(`Login error for ${hostname}:`, error);
      res.status(500).json({ message: "Authentication error" });
    }
  });

  app.get("/api/callback", (req, res, next) => {
    const hostname = req.hostname;
    const strategyDomain = hostname === 'localhost' ? 'localhost' : hostname;
    const strategyName = `replitauth:${strategyDomain}`;
    
    console.log(`Callback for hostname: ${hostname}, using strategy: ${strategyName}`);
    passport.authenticate(strategyName, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
