# Replit.md - Proof of a Miracle Faith Community App

## Overview

This is a full-stack Christian faith community application built with modern web technologies. The app allows users to share miracle testimonies, connect with fellow believers, and discover faith experiences through an interactive map interface. It features user authentication via Replit Auth, real-time social interactions, and a mobile-first responsive design.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**App Simplification - Feed-Only View (July 12, 2025)**
- Completely removed map view functionality from the entire application
- Simplified navigation to show only feed view with top navigation
- Updated home page to only display feed content without view switching
- Removed map-related content from help modal and documentation
- Streamlined user interface for simpler, cleaner experience
- Moved navigation menu from bottom to top directly under "Proof of a Miracle" title
- Fixed post action buttons layout to fit mobile screens properly with smaller icons and text
- Adjusted top navigation menu with bigger fonts and icons, reduced padding for optimal mobile experience
- Enlarged landing page elements including cross image, title, text, buttons, and spacing for better visibility
- Moved text and buttons closer to cross image by reducing spacing between elements
- Further tightened spacing to create ultra-compact landing page layout

**Cross Image Integration (July 12, 2025)**
- Integrated user's custom black cross image across the entire application for complete consistency
- Landing page: Large cross (288px) as main focal point, black color for contrast
- Navigation header: Custom cross (48px) replaces SVG cross next to "Proof of a Miracle" title
- Replaced ALL cross icons (15+ locations): map markers, loading states, buttons, modals, empty states
- Added zip code support (75214) to map view for location-based posts
- Removed cross icon from "Create Post" button per user preference
- Cross sizes range from 16px (small buttons) to 288px (landing page) with proper styling

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend, backend, and data layers:

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing  
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI components with Tailwind CSS for styling
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **Language**: TypeScript for type safety across the stack
- **API Pattern**: RESTful APIs with JSON responses
- **File Uploads**: Multer for handling image uploads
- **Session Management**: Express sessions with PostgreSQL storage

### Database Architecture
- **Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Session Storage**: PostgreSQL table for user sessions

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions stored in PostgreSQL
- **Authorization**: Role-based access with admin privileges
- **Security**: HTTP-only cookies with secure flags

### Content Management
- **Posts**: Faith testimonies and miracle stories with optional images and location data
- **Comments**: Threaded commenting system on posts
- **Prayer Counters**: Community engagement through prayer counts
- **Media Storage**: Local file storage with served static assets

### Social Features
- **User Connections**: Friend request system with pending/accepted states
- **Private Messaging**: Direct messaging between connected users
- **User Profiles**: Customizable profiles with demographics and profile pictures
- **Community Feed**: Chronological feed of posts from the community

### Geographic Features
- **Location Services**: GPS coordinates for miracle locations
- **Interactive Map**: Visual representation of miracles worldwide
- **Location Names**: Human-readable location descriptions

### Admin Dashboard
- **User Management**: View and manage community members
- **Content Moderation**: Administrative oversight of posts and content
- **Analytics**: Basic statistics on community growth and engagement

## Data Flow

### User Registration Flow
1. User initiates authentication via Replit Auth
2. OIDC provider validates credentials and returns user claims
3. Backend creates/updates user record in PostgreSQL
4. Session established with cookie-based authentication
5. User completes profile registration with additional details

### Content Creation Flow
1. Authenticated user creates post through modal interface
2. Optional image upload processed by Multer middleware
3. Location data captured via browser geolocation API
4. Post data validated against Zod schema
5. Record persisted to PostgreSQL via Drizzle ORM
6. Real-time UI updates via React Query cache invalidation

### Social Interaction Flow
1. User interactions (prayers, comments, connections) trigger API calls
2. Backend validates user permissions and relationships
3. Database updates executed within transactions
4. Optimistic UI updates provide immediate feedback
5. Error handling with rollback and user notifications

## External Dependencies

### Core Infrastructure
- **Database**: Neon Database (serverless PostgreSQL)
- **Authentication**: Replit Auth (OpenID Connect)
- **Deployment**: Replit hosting platform

### Frontend Libraries
- **UI Components**: Radix UI primitives for accessibility
- **Styling**: Tailwind CSS for utility-first styling
- **Icons**: Lucide React for consistent iconography
- **Validation**: Zod for runtime type validation
- **Fonts**: Google Fonts (Inter, Georgia)

### Backend Libraries  
- **ORM**: Drizzle ORM for type-safe database queries
- **File Uploads**: Multer for multipart form handling
- **Session Storage**: connect-pg-simple for PostgreSQL sessions
- **Build**: ESBuild for production bundling

### Development Tools
- **TypeScript**: Static type checking across the stack
- **Vite**: Development server with hot module replacement
- **PostCSS**: CSS processing with Autoprefixer
- **TSX**: TypeScript execution for Node.js

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reloading**: Automatic refresh on code changes
- **Database**: Direct connection to Neon Database
- **Environment Variables**: Local .env file configuration

### Production Deployment
- **Build Process**: Vite builds frontend assets, ESBuild bundles backend
- **Static Assets**: Frontend served from dist/public directory
- **Process Management**: Single Node.js process serving both API and static files
- **Database Migrations**: Drizzle Kit push commands for schema updates

### Environment Configuration
- **Database**: DATABASE_URL environment variable for PostgreSQL connection
- **Authentication**: REPL_ID and session secrets for Replit Auth
- **File Storage**: Local uploads directory with Express static middleware
- **Security**: HTTPS enforcement and secure cookie settings in production

### Scaling Considerations
- **Database**: Serverless PostgreSQL automatically scales with usage
- **File Storage**: Local storage suitable for moderate usage, could migrate to cloud storage
- **Session Management**: PostgreSQL session storage supports horizontal scaling
- **Caching**: React Query provides client-side caching, could add Redis for server-side caching