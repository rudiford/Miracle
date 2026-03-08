# Replit.md - Proof of a Miracle Faith Community App

## Overview

This is a full-stack Christian faith community website designed to connect believers, allow users to share miracle testimonies, and engage through an interactive platform. The site emphasizes real-time social interactions, user authentication, and a responsive website design, aiming to foster a global community around shared faith experiences.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application employs a modern full-stack architecture with a clear separation of concerns.

### UI/UX Decisions
- **Design Language**: Desktop-friendly responsive website design with centered max-width layouts.
- **Color Scheme**: Dual-button language selection (English/Spanish) with distinct gold login/registration buttons.
- **Iconography**: Integrated custom black cross image consistently across all UI elements, varying in size based on context.
- **Navigation**: Horizontal top navigation bar with inline links (Feed, Messages, Profile, New Post) and action icons.
- **Landing Page**: Hero section with feature cards grid, cross image as a focal point, and clear call-to-action buttons.

### Technical Implementations
- **Frontend**: React 18 with TypeScript, Wouter for routing, TanStack Query for state management, Radix UI with Tailwind CSS for styling, React Hook Form with Zod for validation, and Vite for building.
- **Backend**: Node.js with Express.js, TypeScript, RESTful APIs, Multer for image uploads, and Express sessions.
- **Database**: PostgreSQL with Drizzle ORM, connected via Neon Database (serverless PostgreSQL), and Drizzle Kit for migrations.
- **Authentication**: Replit Auth using OpenID Connect, with sessions stored in PostgreSQL.
- **Content Features**: Posts with images/location, threaded comments, prayer counters, and local static media storage.
- **Social Features**: User connections, private messaging, customizable user profiles, and a chronological community feed.
- **Geographic Features**: GPS coordinates for miracle locations and interactive location displays.
- **Admin Dashboard**: User management, content moderation, and basic analytics.
- **Website Mode**: Standard browser-based website (PWA standalone mode removed, service worker removed).

### Feature Specifications
- **Multi-language Support**: Complete Spanish translation implemented with language persistence based on login button choice.
- **Account Management**: GDPR-compliant account deletion with full user data removal.
- **Content Moderation**: Comprehensive post reporting system with predefined reasons and admin review interface.
- **User Safety**: User blocking functionality to filter out unwanted content and interactions.
- **Simplified Interface**: Removed map view, focusing solely on a feed-only experience with top navigation.

## External Dependencies

### Core Infrastructure
- **Database**: Neon Database (serverless PostgreSQL)
- **Authentication**: Replit Auth (OpenID Connect)
- **Deployment**: Replit hosting platform

### Frontend Libraries
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Validation**: Zod
- **Fonts**: Google Fonts (Inter, Georgia)

### Backend Libraries
- **ORM**: Drizzle ORM
- **File Uploads**: Multer
- **Session Storage**: connect-pg-simple

### Development Tools
- **Type Checking**: TypeScript
- **Development Server**: Vite
- **CSS Preprocessing**: PostCSS
- **TypeScript Execution**: TSX