# PromptForge Frontend

Modern React application for the PromptForge AI prompt marketplace, built with React 18, TypeScript, and Vite.

## Tech Stack

- **React 18** + **TypeScript** - UI framework with type safety
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **TanStack Query** (React Query) - Server state management
- **Zustand** - Client state management
- **Tailwind CSS** + **shadcn/ui** - Styling and UI components
- **React Hook Form** + **Zod** - Form handling and validation
- **Axios** - HTTP client

## Getting Started

### Prerequisites

- Node.js 20+ (current version: 22.8.0)
- npm 10+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment configuration:
```bash
# Create .env.local file
cp .env.example .env.local
```

3. Configure environment variables in `.env.local`:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:9001
VITE_USE_MOCK_API=true
```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173

### Building for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:9001` |
| `VITE_USE_MOCK_API` | Use mock API instead of real backend | `false` |

### Mock API Mode

Set `VITE_USE_MOCK_API=true` to use the built-in mock API for development without a backend.

**Mock credentials:**
- Username: `demo`
- Password: Any password (mock mode accepts any password)

You can also register new users in mock mode - they'll be stored in memory during the session.

### Real Backend Mode

Set `VITE_USE_MOCK_API=false` to connect to the actual Java backend.

**Backend requirements:**
- Backend API Gateway running on port 9001
- Services: user-service, prompt-service, marketplace-service, etc.

**To start the backend:**
```bash
cd ..
.\START_ALL_SERVICES.ps1
```

## Project Structure

```
src/
├── api/              # API client and services
│   ├── client.ts     # Axios instance with interceptors
│   ├── auth.api.ts   # Authentication API endpoints
│   ├── index.ts      # API factory (mock/real switcher)
│   └── mock/         # Mock API implementations
├── components/       # Reusable components
│   ├── ui/          # shadcn/ui components (Button, Input, Card, etc.)
│   └── layout/      # Layout components (Navbar, Layout)
├── features/        # Feature-based modules
│   ├── auth/        # Authentication (Login, Register)
│   └── dashboard/   # Dashboard page
├── hooks/           # Custom React hooks
├── routes/          # Route components (ProtectedRoute)
├── stores/          # Zustand stores
│   └── auth.store.ts # Authentication state
├── types/           # TypeScript type definitions
│   ├── user.types.ts # User types
│   └── api.types.ts  # API request/response types
├── utils/           # Utility functions
│   └── cn.ts        # Tailwind class name merger
├── App.tsx          # Main app component with routing
├── main.tsx         # App entry point
└── index.css        # Global styles with Tailwind
```

## Features

### Phase 1 (Current) ✅
- [x] Project setup and configuration
- [x] Authentication (Login/Register)
- [x] JWT token management
- [x] Protected routes
- [x] Mock API support
- [x] Responsive layout with Navbar
- [x] Dashboard page

### Phase 2 (Coming Soon)
- [ ] Prompt browsing and search
- [ ] Prompt detail view
- [ ] Create/edit prompts
- [ ] User profile

### Phase 3 (Planned)
- [ ] Marketplace browse
- [ ] Purchase flow
- [ ] Transaction history

### Phase 4 (Planned)
- [ ] Social features (like, comment, follow)
- [ ] User ratings

### Phase 5 (Planned)
- [ ] AI testing lab
- [ ] Analytics dashboard

## Authentication Flow

1. **Registration**: User creates account → Auto-login → Redirect to dashboard
2. **Login**: User enters credentials → Token stored in localStorage → Redirect to dashboard
3. **Token Persistence**: Tokens loaded from localStorage on app init
4. **Protected Routes**: Unauthenticated users redirected to login
5. **Logout**: Clear tokens and state → Redirect to login
6. **401 Handling**: Automatic token cleanup and redirect on unauthorized requests

## API Integration

### Request Flow

```
Component → Zustand Store → API Layer → Axios Client → Backend
                                            ↓
                                    Interceptors:
                                    - Add JWT token
                                    - Add X-User-Id header
                                    - Handle 401 errors
```

### Backend Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/users/me` | Get current user profile |
| POST | `/auth/refresh` | Refresh access token |

### Response Format

**Success (Login/Register):**
```json
{
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string"
  },
  "accessToken": "jwt_token",
  "refreshToken": "jwt_token"
}
```

**Error:**
```json
{
  "message": "Error message",
  "status": 400,
  "errors": {
    "field": ["validation error"]
  }
}
```

## Development Guidelines

### Code Style

- Use TypeScript for all components
- Arrow functions for components
- Destructure props in parameters
- Export components as named exports

### Component Structure

```tsx
// Imports
import { useState } from 'react';
import { ComponentProps } from './Component.types';

// Component
export const Component = ({ prop1, prop2 }: ComponentProps) => {
  // Hooks first
  const [state, setState] = useState();
  
  // Event handlers
  const handleClick = () => { };
  
  // Render
  return <div>...</div>;
};
```

### Naming Conventions

- Components: `PascalCase` (e.g., `UserCard.tsx`)
- Functions: `camelCase` (e.g., `fetchUserData`)
- Types: `PascalCase` with suffix (e.g., `UserCardProps`)
- Files: Match component name

## Styling

### Tailwind CSS

- Use Tailwind utility classes
- Mobile-first approach (default → `md:` → `lg:`)
- Use shadcn/ui components where possible

### Color System

The app uses CSS variables for theming:
- Primary: Blue (`--primary`)
- Secondary: Gray (`--secondary`)
- Destructive: Red (`--destructive`)
- Muted: Light gray (`--muted`)

See `src/index.css` for full color palette.

## Troubleshooting

### Port Already in Use

If port 5173 is in use:
```bash
# Kill process on Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Backend Connection Issues

1. Verify backend is running on port 9001
2. Check `VITE_API_BASE_URL` in `.env.local`
3. Try mock API mode: `VITE_USE_MOCK_API=true`

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Contributing

When adding new features:
1. Create feature in `src/features/[feature-name]/`
2. Add types in `src/types/`
3. Create API service in `src/api/`
4. Update routes in `App.tsx`

## License

Part of the PromptForge project. See root LICENSE file.

## Next Steps

After completing Phase 1, the next priorities are:
1. Implement prompt browsing page with grid layout
2. Create prompt detail view with comments/ratings
3. Build create/edit prompt forms
4. Add marketplace listing functionality

See `docs/FIGMA_CURSOR_GUIDE.md` in the root directory for UI design guidelines.


