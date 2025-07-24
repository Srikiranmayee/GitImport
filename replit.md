# Replit GitHub Importer - Authentication Dashboard

## Overview

This is a full-stack web application that allows users to import their GitHub repositories into Replit with Google authentication. The application provides a dashboard interface for managing the import process, tracking project status, and troubleshooting common issues.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with the following key characteristics:

### Frontend Architecture
- **Framework**: React with TypeScript
- **Bundler**: Vite for development and build processes
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints under `/api` prefix
- **Development**: Hot reload with Vite integration in development mode

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema**: Shared schema definitions between client and server
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### Authentication System
- **Provider**: Google OAuth 2.0 authentication
- **Storage**: In-memory storage implementation (MemStorage class) for development
- **Session Management**: JWT tokens stored in localStorage
- **Authorization**: Bearer token middleware for protected routes

### Project Management
- **Import Pipeline**: Multi-stage process (pending → cloning → setting_up → ready/failed)
- **Status Tracking**: Real-time status updates for import operations
- **Configuration Options**: Include history, install dependencies, create Replit project

### User Interface
- **Dashboard**: Single-page application with multiple card components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: shadcn/ui for consistent design system
- **Icons**: Lucide React for consistent iconography

### Data Models
- **Users**: Google ID, email, name, avatar, OAuth tokens
- **Projects**: GitHub URL, Replit URL, status, configuration options, timestamps

## Data Flow

1. **Authentication Flow**:
   - User clicks Google Sign-In button
   - Google OAuth popup authenticates user
   - Server verifies Google token and creates/retrieves user
   - JWT token returned to client and stored locally

2. **Project Import Flow**:
   - User enters GitHub repository URL
   - Configures import options (history, dependencies, Replit creation)
   - Server validates repository and creates project record
   - Background process handles cloning and setup
   - Client polls for status updates via React Query

3. **Dashboard Updates**:
   - Real-time status updates using React Query with automatic refetching
   - Toast notifications for user feedback
   - Error handling with detailed error messages

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18, React DOM, React Query
- **UI Components**: Radix UI primitives, Lucide React icons
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns for date formatting

### Backend Dependencies
- **Server**: Express.js with TypeScript support
- **Database**: Drizzle ORM, @neondatabase/serverless for Neon PostgreSQL
- **Authentication**: Mock implementation (production would use Google Auth Library)
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build Tools**: Vite with React plugin, esbuild for server bundling
- **TypeScript**: Full TypeScript configuration with strict mode
- **Linting/Formatting**: ESM modules, path aliases for clean imports
- **Replit Integration**: Cartographer plugin for development mode

## Deployment Strategy

### Development Mode
- **Frontend**: Vite dev server with HMR (Hot Module Replacement)
- **Backend**: tsx with auto-restart on file changes
- **Database**: Local or cloud PostgreSQL instance
- **Integration**: Vite middleware integration for seamless development

### Production Build
- **Frontend**: Vite build to `dist/public` directory
- **Backend**: esbuild bundle to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Database**: Cloud PostgreSQL (Neon Database recommended)

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **NODE_ENV**: Environment detection (development/production)
- **Google OAuth**: Client ID and secret for authentication
- **Replit Integration**: Automatic banner injection for external access

### Key Architectural Decisions

1. **Monorepo Structure**: Frontend (`client/`), backend (`server/`), and shared code (`shared/`) in single repository for easier development and deployment

2. **TypeScript First**: Full TypeScript implementation with shared types between client and server for type safety

3. **Component-Based UI**: Modular dashboard with reusable card components for different functionality areas

4. **Optimistic Updates**: React Query provides optimistic updates and automatic retry logic for better user experience

5. **Mock Authentication**: Development-friendly authentication system that can be easily replaced with production Google OAuth implementation

6. **Flexible Storage**: Interface-based storage system allows easy migration from in-memory to database persistence

## Recent Changes

### January 24, 2025 - Google Authentication Implementation
- Implemented Google OAuth 2.0 authentication system using Google Identity Services
- Created AuthProvider context to manage authentication state across the application
- Built authentication dashboard with real-time status indicators
- Added Google Sign-In button with proper token handling
- Set up authentication middleware for protected API routes
- Created mock authentication system for development (needs real Google Client ID for production)
- Fixed component import structure and TypeScript compatibility issues

### Current Status
- Authentication system is partially implemented
- Dashboard components are created but have some TypeScript import issues
- Server-side authentication routes are working
- Frontend authentication flow is connected but needs Google Client ID configuration

### Known Issues
- TypeScript cannot resolve some component import paths
- Google authentication requires VITE_GOOGLE_CLIENT_ID environment variable
- Some LSP diagnostics remain for component imports