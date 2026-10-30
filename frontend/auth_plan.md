# Plan 1: Auth & User Management

## 1. Objective
Implement a secure, role-based authentication system using the **Hybrid BFF** pattern. This ensures that sensitive JWT tokens are stored in `httpOnly` cookies, protecting against XSS, while providing a seamless session experience across the application.

## 2. Pages (App Router)
All pages should be located in `src/app/(auth)/` to share a common layout.
- **`/login`**: The primary entry point for all roles.
- **`/register`**: Step-based or role-specific selection for signing up.
- **`/forgot-password`**: Password recovery flow.
- **`/api/auth/[...auth]`**: Catch-all for BFF operations (login, logout, refresh, session check).

## 3. Feature Components (`src/features/auth/components`)
- **`LoginForm.tsx`**: High-fidelity form with Zod validation, error surfacing (sonner), and loading states.
- **`RegisterForm.tsx`**: Multi-step form including role selection (Owner, Driver, Traveler).
- **`AuthLayout.tsx`**: A premium split-screen layout (decorative image on one side, form on the other).
- **`RoleGuard.tsx`**: A client-side component to wrap role-restricted UI elements.

## 4. State Management
- **Zustand (`src/features/auth/store/authStore.ts`)**:
  - `user`: Currently logged-in user details.
  - `isAuthenticated`: Boolean flag.
  - `isInitialLoading`: To prevent flickering during session rehydration.
  - `actions`: `login`, `logout`, `checkSession`.

## 5. BFF Implementation (`src/app/api/auth`)
- **Route Handlers**:
  - `POST /api/auth/login`: Receives credentials → Calls Spring Boot `/api/v1/auth/login` → Encrypts & sets `accessToken` in `httpOnly` cookie.
  - `POST /api/auth/logout`: Clears the `accessToken` cookie.
  - `GET /api/auth/me`: Validates the cookie and returns the user object (BFF session check).

## 6. Logic & Types
- **`types/index.ts`**: `LoginSchema`, `RegisterSchema`, `AuthResponse`.
- **`lib/fetch.ts`**: Interceptor logic to handle 401s and trigger redirection to `/login`.
- **`middleware.ts`**: Global guard to redirect unauthenticated users away from `/(driver)`, `/(owner)`, and `/(traveler)` route groups.

## 7. Verification Plan
- [ ] Verify `httpOnly` cookie is set and not accessible via `document.cookie`.
- [ ] Test cross-role redirection (e.g., Driver shouldn't access Owner dashboard).
- [ ] Ensure smooth "rehydration" of user state on page refresh.

