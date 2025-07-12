import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertUserSchema, insertPostSchema, insertConnectionSchema, insertMessageSchema, insertCommentSchema, insertReportSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Server-side mobile detection middleware - redirect mobile users to mobile version
  app.use((req, res, next) => {
    const userAgent = req.headers['user-agent'] || '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    // Only redirect GET requests to root path for mobile browsers
    if (req.method === 'GET' && req.path === '/' && isMobile) {
      console.log('Mobile browser detected, serving simple mobile version:', userAgent.substring(0, 50));
      return res.sendFile(path.join(process.cwd(), "client/public/mobile-simple.html"));
    }
    
    next();
  });

  // Auth middleware
  await setupAuth(app);

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));
  
  // Serve mobile files with highest priority
  app.use('/mobile', express.static('.'));

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log("Fetching user for ID:", userId);
      const user = await storage.getUser(userId);
      console.log("Found user:", user);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Account deletion endpoint (GDPR compliance)
  app.delete('/api/users/delete-account', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { reason, feedback } = req.body;

      // Log deletion request for compliance
      console.log(`Account deletion requested by user ${userId}`, {
        reason,
        feedback,
        timestamp: new Date().toISOString()
      });

      // Delete all user data
      const deleted = await storage.deleteUserCompletely(userId);
      
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }

      // Destroy the session
      req.logout(() => {
        req.session.destroy(() => {
          res.json({ 
            message: "Account and all associated data have been permanently deleted",
            deletedAt: new Date().toISOString()
          });
        });
      });
    } catch (error) {
      console.error("Error deleting user account:", error);
      res.status(500).json({ message: "Failed to delete account" });
    }
  });

  // User profile routes
  app.put('/api/users/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log("Profile update request:", { userId, body: req.body });
      
      const validatedData = insertUserSchema.parse(req.body);
      console.log("Validated data:", validatedData);
      
      const updatedUser = await storage.updateUserProfile(userId, validatedData);
      console.log("Updated user:", updatedUser);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.post('/api/users/profile-picture', isAuthenticated, upload.single('profilePicture'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user.claims.sub;
      const filename = `${userId}-${Date.now()}${path.extname(req.file.originalname)}`;
      const newPath = path.join('uploads', filename);
      
      fs.renameSync(req.file.path, newPath);
      
      const profileImageUrl = `/uploads/${filename}`;
      const updatedUser = await storage.updateUserProfile(userId, { profileImageUrl });
      
      res.json({ profileImageUrl });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res.status(500).json({ message: "Failed to upload profile picture" });
    }
  });

  // Admin routes
  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.delete('/api/admin/users/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const targetUserId = req.params.id;
      const deleted = await storage.deleteUser(targetUserId);
      
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const users = await storage.getAllUsers();
      const posts = await storage.getAllPosts();
      const reports = await storage.getAllReports();
      const pendingReports = reports.filter(r => r.status === 'pending');
      
      res.json({
        totalUsers: users.length,
        totalPosts: posts.length,
        reportedContent: pendingReports.length,
        activeMiracles: posts.length,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  // Post routes
  app.get('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const posts = await storage.getAllPosts(userId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post('/api/posts', isAuthenticated, upload.single('image'), async (req: any, res) => {
    try {
      console.log("POST /api/posts - Request body:", req.body);
      console.log("POST /api/posts - Request file:", req.file);
      
      const userId = req.user.claims.sub;
      console.log("POST /api/posts - User ID:", userId);
      
      let imageUrl = null;
      
      if (req.file) {
        const filename = `post-${userId}-${Date.now()}${path.extname(req.file.originalname)}`;
        const newPath = path.join('uploads', filename);
        fs.renameSync(req.file.path, newPath);
        imageUrl = `/uploads/${filename}`;
        console.log("POST /api/posts - Image saved as:", imageUrl);
      }
      
      const postData = {
        ...req.body,
        imageUrl,
      };
      
      console.log("POST /api/posts - Post data before validation:", postData);
      
      const validatedData = insertPostSchema.parse(postData);
      console.log("POST /api/posts - Validated data:", validatedData);
      
      const post = await storage.createPost(userId, validatedData);
      console.log("POST /api/posts - Created post:", post);
      
      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      console.error("Error stack:", (error as Error).stack);
      res.status(500).json({ message: "Failed to create post", error: (error as Error).message });
    }
  });

  app.patch('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      
      // Get the post to check ownership
      const posts = await storage.getAllPosts();
      const post = posts.find(p => p.id === postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Only post owner can edit
      if (post.user.id !== userId) {
        return res.status(403).json({ message: "You can only edit your own posts" });
      }
      
      const validatedData = insertPostSchema.partial().parse(req.body);
      const updatedPost = await storage.updatePost(postId, validatedData);
      
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  app.delete('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const postId = parseInt(req.params.id);
      
      // Only admin can delete any post
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const deleted = await storage.deletePost(postId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Prayer routes
  app.post('/api/posts/:id/prayer', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      
      const hasPrayed = await storage.hasUserPrayed(userId, postId);
      if (hasPrayed) {
        await storage.removePrayer(userId, postId);
        res.json({ action: 'removed' });
      } else {
        await storage.addPrayer(userId, postId);
        res.json({ action: 'added' });
      }
    } catch (error) {
      console.error("Error toggling prayer:", error);
      res.status(500).json({ message: "Failed to toggle prayer" });
    }
  });

  // Love routes
  app.post('/api/posts/:id/love', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      
      const hasLoved = await storage.hasUserLoved(userId, postId);
      if (hasLoved) {
        await storage.removeLove(userId, postId);
        res.json({ action: 'removed' });
      } else {
        await storage.addLove(userId, postId);
        res.json({ action: 'added' });
      }
    } catch (error) {
      console.error("Error toggling love:", error);
      res.status(500).json({ message: "Failed to toggle love" });
    }
  });

  // Comment routes
  app.get('/api/posts/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const postId = parseInt(req.params.id);
      const comments = await storage.getCommentsByPost(postId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/posts/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      
      const commentData = {
        postId,
        content: req.body.content,
      };
      
      const validatedData = insertCommentSchema.parse(commentData);
      const comment = await storage.createComment(userId, validatedData);
      
      res.json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Connection routes
  app.get('/api/connections', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const connections = await storage.getConnectionsByUser(userId);
      res.json(connections);
    } catch (error) {
      console.error("Error fetching connections:", error);
      res.status(500).json({ message: "Failed to fetch connections" });
    }
  });

  app.post('/api/connections', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertConnectionSchema.parse(req.body);
      const connection = await storage.createConnection(userId, validatedData);
      res.json(connection);
    } catch (error) {
      console.error("Error creating connection:", error);
      res.status(500).json({ message: "Failed to create connection" });
    }
  });

  app.put('/api/connections/:id', isAuthenticated, async (req: any, res) => {
    try {
      const connectionId = parseInt(req.params.id);
      const { status } = req.body;
      
      const connection = await storage.updateConnectionStatus(connectionId, status);
      
      if (!connection) {
        return res.status(404).json({ message: "Connection not found" });
      }
      
      res.json(connection);
    } catch (error) {
      console.error("Error updating connection:", error);
      res.status(500).json({ message: "Failed to update connection" });
    }
  });

  app.get('/api/connections/accepted', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const connections = await storage.getAcceptedConnections(userId);
      res.json(connections);
    } catch (error) {
      console.error("Error fetching accepted connections:", error);
      res.status(500).json({ message: "Failed to fetch accepted connections" });
    }
  });

  // Message routes
  app.get('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.get('/api/conversations/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const currentUserId = req.user.claims.sub;
      const otherUserId = req.params.userId;
      
      const messages = await storage.getMessagesBetweenUsers(currentUserId, otherUserId);
      await storage.markMessagesAsRead(otherUserId, currentUserId);
      
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(userId, validatedData);
      res.json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // User search route
  app.get('/api/users/search', isAuthenticated, async (req: any, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.length < 2) {
        return res.json([]);
      }
      
      const users = await storage.getAllUsers();
      const filteredUsers = users.filter(user => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
        return fullName.includes(query.toLowerCase()) || 
               (user.email && user.email.toLowerCase().includes(query.toLowerCase()));
      });
      
      res.json(filteredUsers);
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ message: "Failed to search users" });
    }
  });

  // Comment routes
  app.get('/api/posts/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const postId = parseInt(req.params.id);
      const comments = await storage.getCommentsByPost(postId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/posts/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      
      const commentData = {
        ...req.body,
        postId,
      };
      
      const validatedData = insertCommentSchema.parse(commentData);
      const comment = await storage.createComment(userId, validatedData);
      
      res.json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment", error: (error as Error).message });
    }
  });

  // Block user routes
  app.post('/api/users/:id/block', isAuthenticated, async (req: any, res) => {
    try {
      const blockedId = req.params.id;
      const blockerId = req.user.claims.sub;
      
      if (blockerId === blockedId) {
        return res.status(400).json({ message: "Cannot block yourself" });
      }

      await storage.blockUser(blockerId, blockedId);
      res.json({ message: "User blocked successfully" });
    } catch (error) {
      console.error("Error blocking user:", error);
      res.status(500).json({ message: "Failed to block user" });
    }
  });

  app.delete('/api/users/:id/block', isAuthenticated, async (req: any, res) => {
    try {
      const blockedId = req.params.id;
      const blockerId = req.user.claims.sub;
      
      const success = await storage.unblockUser(blockerId, blockedId);
      if (success) {
        res.json({ message: "User unblocked successfully" });
      } else {
        res.status(404).json({ message: "Block not found" });
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      res.status(500).json({ message: "Failed to unblock user" });
    }
  });

  app.get('/api/users/:id/blocked', isAuthenticated, async (req: any, res) => {
    try {
      const blockedId = req.params.id;
      const blockerId = req.user.claims.sub;
      
      const isBlocked = await storage.isUserBlocked(blockerId, blockedId);
      res.json({ isBlocked });
    } catch (error) {
      console.error("Error checking block status:", error);
      res.status(500).json({ message: "Failed to check block status" });
    }
  });

  app.get('/api/blocked-users', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const blockedUsers = await storage.getBlockedUsers(userId);
      res.json(blockedUsers);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
      res.status(500).json({ message: "Failed to fetch blocked users" });
    }
  });

  // Report routes
  app.post('/api/reports', isAuthenticated, async (req: any, res) => {
    try {
      const reporterId = req.user.claims.sub;
      const validatedData = insertReportSchema.parse(req.body);
      const report = await storage.createReport(reporterId, validatedData);
      res.json(report);
    } catch (error) {
      console.error("Error creating report:", error);
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  app.get('/api/admin/reports', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const reports = await storage.getAllReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.patch('/api/admin/reports/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const reportId = parseInt(req.params.id);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const { status } = req.body;
      const updatedReport = await storage.updateReportStatus(reportId, status, userId);
      
      if (!updatedReport) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      res.json(updatedReport);
    } catch (error) {
      console.error("Error updating report:", error);
      res.status(500).json({ message: "Failed to update report" });
    }
  });

  // Add a special route to serve the production HTML app
  app.get('/production', (req, res) => {
    res.sendFile(path.join(process.cwd(), "client", "public", "index.html"));
  });

  // Mobile detection and routing
  app.get("/mobile.html", (req, res) => {
    res.sendFile(path.join(process.cwd(), "client/public/mobile.html"));
  });

  app.get("/mobile-redirect.html", (req, res) => {
    res.sendFile(path.join(process.cwd(), "client/public/mobile-redirect.html"));
  });

  app.get("/mobile-simple.html", (req, res) => {
    res.sendFile(path.join(process.cwd(), "client/public/mobile-simple.html"));
  });

  app.get("/mobile-test.html", (req, res) => {
    res.sendFile(path.join(process.cwd(), "mobile-test.html"));
  });

  app.get("/test-mobile-direct.html", (req, res) => {
    res.sendFile(path.join(process.cwd(), "test-mobile-direct.html"));
  });

  // Mobile API endpoint for basic functionality
  app.get("/api/mobile/check", (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    res.json({ 
      isMobile, 
      userAgent: userAgent.substring(0, 100),
      timestamp: new Date().toISOString()
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
