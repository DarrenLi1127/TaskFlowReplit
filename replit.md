# TaskFlow - Minimal Task Management Application

## Overview

TaskFlow is a minimal task management application built with a modern full-stack architecture. The application enables users to create, manage, and track tasks with a clean, Linear-inspired interface. It features user authentication via Replit Auth, persistent storage with PostgreSQL, and a React-based frontend with shadcn/ui components.

The application prioritizes clarity, efficiency, and minimal friction in task management workflows, following a "Design System-Based (Productivity Focus)" approach with generous spacing, scannable hierarchy, and contextual actions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**Routing**: Wouter for client-side routing with two main routes:
- Landing page for unauthenticated users
- Home page with task management interface for authenticated users

**UI Components**: shadcn/ui component library (New York style variant) with Radix UI primitives
- Design system configured for productivity with Inter font family
- Tailwind CSS for styling with custom theme supporting light/dark modes
- Component aliases configured for clean imports (@/components, @/lib, @/hooks)

**State Management**:
- TanStack Query (React Query) for server state management and API calls
- Query keys follow REST-like patterns (["/api/tasks"], ["/api/auth/user"])
- Custom query client configuration with credential inclusion and optimized refetching

**Form Handling**: React Hook Form with Zod validation using @hookform/resolvers
- Schema validation using drizzle-zod for type-safe forms
- Centralized validation schemas shared between client and server

**Design System**:
- Linear-inspired minimal aesthetic with Material Design form patterns
- Typography scale: Inter (400, 500, 600 weights) for UI, JetBrains Mono for metadata
- Spacing system based on Tailwind units (2, 4, 6, 8)
- Max-width container (max-w-4xl) for optimal task list readability
- Responsive single-column layout collapsing appropriately on mobile

### Backend Architecture

**Framework**: Express.js running on Node.js with TypeScript (ESM modules)

**Server Structure**:
- `server/index.ts` - Main application entry point with middleware setup
- `server/routes.ts` - API route definitions and handlers
- `server/db.ts` - Database connection configuration
- `server/storage.ts` - Data access layer with IStorage interface abstraction
- `server/replitAuth.ts` - Authentication middleware and session management

**API Design**: RESTful API endpoints:
- `GET /api/auth/user` - Get current authenticated user
- `GET /api/tasks` - List all tasks for authenticated user
- `GET /api/tasks/:id` - Get single task by ID
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id` - Update existing task
- `DELETE /api/tasks/:id` - Delete task

**Request/Response Handling**:
- JSON body parsing with raw body preservation for webhooks
- Request logging middleware tracking duration and response bodies
- Centralized error handling with Zod validation error formatting
- Authentication middleware protecting all task routes

**Development/Production Setup**:
- Vite dev server integration in development mode with HMR
- Static file serving in production from dist/public
- Separate build commands for client (Vite) and server (esbuild)

### Data Storage

**Database**: PostgreSQL accessed via Neon serverless driver
- WebSocket-based connection pooling for serverless environments
- Connection string from DATABASE_URL environment variable

**ORM**: Drizzle ORM with type-safe queries
- Schema-first approach with TypeScript inference
- Migration files stored in ./migrations directory
- Schema definitions in shared/schema.ts for client/server sharing

**Database Schema**:

1. **sessions table** - Session storage for Replit Auth
   - sid (varchar, primary key)
   - sess (jsonb)
   - expire (timestamp with index)

2. **users table** - User profiles from Replit Auth
   - id (varchar, primary key, UUID default)
   - email (varchar, unique)
   - firstName, lastName (varchar)
   - profileImageUrl (varchar)
   - createdAt, updatedAt (timestamp)

3. **tasks table** - Task management
   - id (integer, auto-incrementing primary key)
   - userId (varchar, foreign key to users with cascade delete)
   - title (text, required)
   - description (text, optional)
   - completed (boolean, default false)
   - createdAt, updatedAt (timestamp)

**Data Access Pattern**:
- Repository pattern via DatabaseStorage class implementing IStorage interface
- Type-safe operations with Drizzle's query builder
- Row-level security through userId filtering on all task operations
- Upsert pattern for user authentication flow

### Authentication & Authorization

**Authentication Provider**: Replit OpenID Connect (OIDC)
- Discovery endpoint: https://replit.com/oidc or ISSUER_URL environment variable
- Passport.js strategy for OIDC integration
- Token management with access_token and refresh_token storage

**Session Management**:
- Express session middleware with PostgreSQL storage (connect-pg-simple)
- 7-day session TTL with secure, httpOnly cookies
- Session data stored in sessions table
- SESSION_SECRET environment variable for session encryption

**Authorization**:
- isAuthenticated middleware protecting routes
- User identification via JWT claims (sub claim)
- Per-user data isolation enforced at storage layer
- Automatic user profile creation/update via upsertUser on login

**Auth Flow**:
1. User clicks "Sign In" → redirects to /api/login
2. OIDC provider authentication → callback with tokens
3. User profile upserted in database
4. Session created with claims and tokens
5. Client redirected to home page
6. Protected routes verify session and extract userId

### Build & Development

**Build Tools**:
- Vite for frontend bundling with React plugin
- esbuild for server bundling (ESM output)
- TypeScript compilation with strict mode
- Path aliases for clean imports (@/, @shared/, @assets/)

**Development Workflow**:
- `npm run dev` - Runs tsx server with Vite middleware and HMR
- `npm run build` - Builds client and server bundles
- `npm run start` - Production server from dist
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push Drizzle schema changes to database

**Development Features**:
- Runtime error overlay plugin (Replit-specific)
- Cartographer and dev banner plugins in Replit environment
- Hot module replacement for client code
- Automatic server restart with tsx

**Environment Configuration**:
- DATABASE_URL (required) - PostgreSQL connection string
- SESSION_SECRET (required) - Session encryption key
- ISSUER_URL (optional) - OIDC provider URL
- REPL_ID (optional) - Replit environment identifier
- NODE_ENV - Environment mode (development/production)

## External Dependencies

### Third-Party Services

1. **Replit Authentication (OIDC)**
   - Purpose: User authentication and identity management
   - Integration: OpenID Connect via passport.js
   - Required environment variables: ISSUER_URL, REPL_ID, SESSION_SECRET

2. **Neon Serverless PostgreSQL**
   - Purpose: Primary data persistence layer
   - Integration: @neondatabase/serverless driver with WebSocket support
   - Required environment variable: DATABASE_URL

### Key NPM Packages

**Frontend Dependencies**:
- @tanstack/react-query - Server state management
- wouter - Lightweight routing
- react-hook-form - Form state management
- zod - Schema validation
- @radix-ui/* - Headless UI primitives (20+ components)
- tailwindcss - Utility-first CSS framework
- class-variance-authority - Variant-based component styling
- lucide-react - Icon library
- date-fns - Date manipulation

**Backend Dependencies**:
- express - Web framework
- drizzle-orm - Type-safe ORM
- passport - Authentication middleware
- openid-client - OIDC client with Passport strategy
- express-session - Session middleware
- connect-pg-simple - PostgreSQL session store
- ws - WebSocket client for Neon

**Development Dependencies**:
- vite - Build tool and dev server
- tsx - TypeScript execution
- esbuild - Server bundling
- drizzle-kit - Database migration tool
- @replit/vite-plugin-* - Replit development enhancements

### Font Dependencies

- Google Fonts: Inter (weights 400, 500, 600) for interface
- Google Fonts: JetBrains Mono (weights 400, 500) for monospace elements