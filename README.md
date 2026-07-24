# PCAF Wireframe

A full-stack wireframe for a PCAF-style financed emissions platform. The app includes a React/Vite frontend and an Express/PostgreSQL backend for authentication, roles, users, settings, and seeded demo data.

## Project Structure

```text
pcaf-wireframe/
  backend/   Express API, database initialisation, repositories, services, routes
  common/    Shared domain types and constants
  frontend/  React application, layouts, pages, components, and styling
```

Generated folders such as `node_modules/` and `frontend/dist/` are intentionally ignored and should not be committed.

## Requirements

- Node.js 18+
- npm 9+
- PostgreSQL running locally, unless `backend/.env` points to another database

## Setup

```powershell
npm install
```

If your local settings differ from the defaults, copy the example files before starting the app:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Then run both apps together:

```powershell
npm run start
```

Useful commands:

```powershell
npm run dev      # frontend only
npm run api      # backend only
npm run build    # production frontend build
npm run start    # frontend and backend together
```

The frontend expects the API at `http://localhost:5000/v1` by default. Set `VITE_API_URL` in `frontend/.env` to override it.

## Notes

- Backend routes are mounted under `/v1`.
- Database tables are created and seeded automatically on backend start.
- Keep environment files local; `.env` files are ignored by git.