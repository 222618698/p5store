# P5Store Admin

Admin console for P5Store, built against the `pillar5store2` Spring Boot backend.

**Stack:** React 19 + Vite, TypeScript, Tailwind CSS v4, React Router, Axios,
React Hook Form + Zod, TanStack Query, Chart.js.

## Getting started

```bash
npm install
cp .env.example .env   # points VITE_API_URL at your backend
npm run dev
```

Runs on `http://localhost:5173`. The backend must be running on
`http://localhost:8080/store` (its `server.servlet.context-path` is `/store`)
and its `app.cors.allowed-origins` already includes `http://localhost:5173`,
so no CORS config changes are needed.

Login with an account that has `role: ADMIN` — non-admin accounts can sign in
but get an "Access restricted" screen instead of the dashboard.

## What's built (v1)

- **Auth** — login page, JWT stored in `localStorage`, auto-redirect to
  `/login` on 401, admin-only route guard.
- **Dashboard** — stat cards + Chart.js bar/doughnut charts, computed
  client-side from the product catalog.
- **Products** — full list (paginated + search), create, edit, delete. This
  is the one module with 100% backend support today.
- **Orders** — lookup by order number, view detail, update status. No list
  view yet (see gaps below).

## Backend gaps (blocking full admin functionality)

The `com.p5store.controller` package doesn't have everything an admin
console needs yet. Flagging these so they can go on the backend backlog:

| Missing endpoint | Blocks |
|---|---|
| `GET /v1/categories` | Category dropdown in the product form (`CategoryRepository` exists, `CategoryController` doesn't — `SecurityConfig` already has a `permitAll` rule for it, so the path is anticipated) |
| `GET /v1/orders` (admin, paginated) | An actual Orders list screen — currently orders can only be looked up one at a time by order number/ID |
| `GET /v1/users` (admin) | A Users/customers management screen |
| Discount, Review, Payment controllers | Any admin screens for those entities — repositories exist, no controllers |
| Order/revenue stats endpoint | Real dashboard numbers instead of catalog-only stats |

Everything in `src/api/*.ts` is written 1:1 against the DTOs/endpoints that
exist right now (`AuthController`, `ProductController`, `OrderController`).
Where I anticipated an endpoint (categories), it's commented inline.

## Project structure

```
src/
  api/            axios client + one file per backend resource
  components/
    layout/       Sidebar, Topbar, AdminLayout (route shell)
    ui/           StatCard, StatusBadge
  context/        AuthContext (session state)
  features/
    auth/          LoginPage + zod schema
    dashboard/      DashboardPage (charts)
    products/       ProductListPage, ProductFormPage + zod schema
    orders/         OrderLookupPage
  routes/         ProtectedRoute guard
  types/          TS types mirroring backend DTOs
```

## Brand

Navy `#1B3A6B` / Gold `#C9A84C`, DM Serif Display for headings, DM Sans for
body — matches the P5Store UI/UX proposal doc. Tokens live in `src/index.css`
under `@theme` (Tailwind v4's CSS-first config, no `tailwind.config.js`).

## Next up

Products is the only fully wired module. Natural next steps once the
backend gaps above are addressed: a real Orders table, Categories CRUD, and
a Users screen. Happy to scaffold any of those against stub data now if you
want the UI ahead of the backend — just say which one.
