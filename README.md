# PawPal - Pet Adoption Platform (Frontend)

PawPal is a modern, full-featured pet adoption web application that connects loving families with pets in need of a home. This repository contains the frontend client, built with React, TypeScript, and Tailwind CSS v4. The application provides an intuitive browsing experience for adopters and a powerful management dashboard for administrators.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Development Server](#running-the-development-server)
  - [Building for Production](#building-for-production)
- [Application Overview](#application-overview)
  - [Public Pages](#public-pages)
  - [User Pages](#user-pages)
  - [Admin Pages](#admin-pages)
- [API Integration](#api-integration)
- [Authentication and Authorization](#authentication-and-authorization)
- [Design System](#design-system)
- [Routing](#routing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### For Adopters (Users)

- **Browse Pets**: View all available pets with filtering by species, breed, age, and name search.
- **Pet Details**: View comprehensive details about each pet including photos, breed, age, gender, species, and description.
- **Adopt a Pet**: Submit adoption requests directly from the pet details page via a confirmation modal.
- **User Dashboard**: Track all submitted adoption requests with real-time status updates (pending, approved, rejected).
- **Withdraw Requests**: Cancel pending adoption requests with a confirmation prompt.
- **Pagination**: Client-side pagination across all listing pages for improved navigation.

### For Administrators

- **Admin Dashboard**: A tabbed interface to manage all aspects of the platform.
- **Add Pet**: Create new pet listings with image upload via drag-and-drop or file browser, supporting up to 5MB image files.
- **Manage Pets**: View all listed pets in a table format with the ability to edit details, update status, or delete pets.
- **Edit Pet Modal**: Update any pet attribute including name, species, breed, age, gender, status, description, and photo.
- **Adoption Requests**: Review, approve, or reject adoption applications. Includes filterable views by status (all, pending, approved, rejected) with summary statistics.

### General

- **Responsive Design**: Fully responsive layout that adapts to mobile, tablet, and desktop screens.
- **Toast Notifications**: Contextual feedback for all user actions (success, error, info, warning).
- **Social Login Buttons**: Google and Facebook login buttons (UI-ready, with placeholder handlers).
- **Protected Routes**: Role-based route protection for user and admin sections.
- **JWT Authentication**: Secure token-based authentication with automatic token attachment and session management.

---

## Tech Stack

| Technology       | Version | Purpose                              |
| ---------------- | ------- | ------------------------------------ |
| React            | 19.2    | UI component library                 |
| TypeScript       | 5.9     | Type safety and developer experience |
| Vite             | 7.3     | Build tool and dev server            |
| Tailwind CSS     | 4.1     | Utility-first CSS framework          |
| React Router DOM | 7.13    | Client-side routing                  |
| Axios            | 1.13    | HTTP client for API requests         |
| ESLint           | 9.39    | Code linting and quality             |

---

## Project Structure

```
PawPal-FE/
|-- public/                         # Static assets
|-- src/
|   |-- api/                        # API layer
|   |   |-- axiosInstance.ts         # Configured Axios instance with interceptors
|   |   |-- authApi.ts              # Authentication endpoints (login, register, getMe)
|   |   |-- petApi.ts               # Public pet endpoints (getAllPets, getPetById, getBreeds)
|   |   |-- userApi.ts              # User endpoints (adoptPet, getUserAdoptions, withdrawAdoption)
|   |   |-- adminApi.ts             # Admin endpoints (CRUD pets, manage adoption requests)
|   |
|   |-- components/
|   |   |-- admin/
|   |   |   |-- AdminRoute.tsx       # Route guard for admin-only access
|   |   |-- layouts/
|   |   |   |-- Navbar.tsx           # Global navigation bar with user dropdown
|   |   |   |-- Footer.tsx           # Global footer with links and social icons
|   |   |   |-- ProtectedRoute.tsx   # Route guard for authenticated users
|   |   |-- pets/
|   |   |   |-- PetCard.tsx          # Individual pet display card
|   |   |   |-- PetGrid.tsx          # Responsive grid layout for pet cards
|   |   |   |-- PetFilters.tsx       # Search and filter sidebar (species, breed, age)
|   |   |   |-- AdoptModal.tsx       # Adoption confirmation modal dialog
|   |   |-- ui/
|   |       |-- Pagination.tsx       # Reusable pagination component
|   |       |-- Toast.tsx            # Toast notification component
|   |
|   |-- context/
|   |   |-- AuthContext.tsx          # Authentication state and methods (login, register, logout)
|   |   |-- ToastContext.tsx         # Global toast notification provider
|   |
|   |-- pages/
|   |   |-- Home.tsx                 # Main pet browsing page with filters and pagination
|   |   |-- Login.tsx                # User login page with split-panel layout
|   |   |-- Register.tsx            # User registration page with password strength indicator
|   |   |-- PetDetails.tsx           # Individual pet detail view with adopt button
|   |   |-- UserDashboard.tsx        # User's adoption request tracking page
|   |   |-- admin/
|   |       |-- AdminDashboard.tsx   # Admin panel with tabbed navigation
|   |       |-- AddPet.tsx           # Form for creating new pet listings
|   |       |-- ManagePets.tsx       # Table view for managing all pets
|   |       |-- EditPetModal.tsx     # Modal form for editing pet details
|   |       |-- AdoptionRequests.tsx # List and manage adoption applications
|   |
|   |-- App.tsx                      # Root component with routing configuration
|   |-- main.tsx                     # Application entry point
|   |-- index.css                    # Global styles and Tailwind imports
|   |-- App.css                      # App-level styles
|
|-- package.json
|-- tsconfig.json
|-- vite.config.ts
|-- README.md
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher) or **yarn**
- A running instance of the **PawPal Backend API** (see the backend repository for setup instructions)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Dins2344/PawPal-FE.git
   cd PawPal-FE
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the project root with the following variable:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

| Variable            | Description                             | Default                     |
| ------------------- | --------------------------------------- | --------------------------- |
| `VITE_API_BASE_URL` | Base URL of the PawPal backend API      | `http://localhost:3000/api` |

If no `.env` file is provided, the application defaults to `http://localhost:3000/api`.

### Running the Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173` (default Vite port).

### Building for Production

```bash
npm run build
```

This runs the TypeScript compiler followed by the Vite production build. The output is generated in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## Application Overview

### Public Pages

| Route         | Page        | Description                                                              |
| ------------- | ----------- | ------------------------------------------------------------------------ |
| `/`           | Home        | Displays all available pets in a filterable, paginated grid layout.      |
| `/pets/:id`   | Pet Details | Shows full details of a selected pet with an option to adopt.            |
| `/login`      | Login       | User authentication page with email/password and social login options.   |
| `/register`   | Register    | New account creation with password strength indicator and validation.    |

### User Pages (Requires Authentication)

| Route        | Page           | Description                                                          |
| ------------ | -------------- | -------------------------------------------------------------------- |
| `/dashboard` | User Dashboard | Lists all adoption requests submitted by the logged-in user.         |

### Admin Pages (Requires Admin Role)

| Route    | Page            | Description                                                             |
| -------- | --------------- | ----------------------------------------------------------------------- |
| `/admin` | Admin Dashboard | Tabbed interface with Add Pet, Manage Pets, and Adoption Requests tabs. |

---

## API Integration

The frontend communicates with the backend API through a centralized Axios instance (`src/api/axiosInstance.ts`) that provides:

- **Base URL configuration** via environment variable
- **Request interceptor**: Automatically attaches the JWT token from `localStorage` to every outgoing request
- **Response interceptor**: Handles 401 (unauthorized) errors by clearing the session and redirecting to the login page; logs 403 and 500 errors to the console
- **Request timeout**: 15 seconds

### API Modules

| Module          | Endpoints                                              |
| --------------- | ------------------------------------------------------ |
| `authApi.ts`    | `POST /auth/login`, `POST /auth/register`, `GET /auth/me` |
| `petApi.ts`     | `GET /pets`, `GET /pets/:id`, `GET /pets/breeds`       |
| `userApi.ts`    | `POST /users/adopt`, `GET /users/adoptions`, `DELETE /users/adoptions/:id` |
| `adminApi.ts`   | `POST /admin/pets`, `PUT /admin/pets/:id`, `GET /admin/pets`, `DELETE /admin/pets/:id`, `GET /admin/adoptions`, `PUT /admin/adoptions/:id/approve`, `PUT /admin/adoptions/:id/reject` |

---

## Authentication and Authorization

Authentication is managed through the `AuthContext` provider, which wraps the entire application and provides:

- **Login**: Authenticates the user, stores the JWT token and user object in `localStorage`, and updates the application state.
- **Register**: Creates a new user account and automatically logs them in.
- **Logout**: Clears the token and user data from `localStorage` and resets the application state.
- **Session Persistence**: On page load, the context checks `localStorage` for an existing token and validates it with the `/auth/me` endpoint.

### Route Protection

- **ProtectedRoute**: Wraps routes that require any authenticated user. Redirects unauthenticated users to `/login`.
- **AdminRoute**: Wraps routes that require admin privileges. Redirects non-admin users appropriately.

---

## Design System

The application uses a warm, pet-friendly color theme designed to feel inviting and nurturing:

### Color Palette

| Role               | Color                                       |
| ------------------ | ------------------------------------------- |
| Primary / CTA      | Amber to Orange gradient (`amber-500` to `orange-500`) |
| Background         | Warm cream (`#FFFBF5`)                      |
| Active Links       | `amber-600`                                 |
| Card Borders       | `amber-100` (with transparency)             |
| Focus Rings        | `amber-500` (30% opacity)                   |
| Status: Available  | Emerald (`emerald-100` / `emerald-700`)     |
| Status: Pending    | Amber (`amber-100` / `amber-700`)           |
| Status: Adopted    | Sky / Rose tones                            |
| Status: Rejected   | Rose (`rose-100` / `rose-700`)              |
| Error Actions      | Rose (`rose-500` / `rose-600`)              |

### Typography

The application uses the system font stack with `Inter` as the preferred typeface, falling back to `Segoe UI` and other system fonts.

### UI Components

- **Cards**: Rounded corners (`rounded-2xl`), subtle amber-tinted shadows, and hover lift effects.
- **Buttons**: Gradient primary buttons with shadow effects and micro-animations on hover.
- **Inputs**: Warm amber-tinted backgrounds with amber focus rings.
- **Modals**: Backdrop blur overlay with centered card layout.
- **Tables**: Amber-tinted header row with alternating hover states.
- **Pagination**: Numbered pages with gradient active state and prev/next buttons.
- **Toast Notifications**: Gradient backgrounds per notification type with slide-in animation.

---

## Routing

Routing is handled by React Router DOM v7 with the following configuration:

```
/                  -> Home (public)
/pets/:id          -> PetDetails (public)
/login             -> Login (public)
/register          -> Register (public)
/dashboard         -> UserDashboard (authenticated users)
/admin             -> AdminDashboard (admin only)
```

The application uses a persistent layout with the `Navbar` at the top and `Footer` at the bottom across all pages, with the main content area using flexbox to fill the remaining viewport height.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes with clear, descriptive messages.
4. Push to your fork and open a Pull Request.

Please ensure all code passes TypeScript type checking (`npx tsc --noEmit`) and ESLint validation (`npm run lint`) before submitting.

---

## License

This project is open source and available under the [MIT License](LICENSE).
