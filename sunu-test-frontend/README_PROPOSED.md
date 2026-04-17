# gestion-pressing-frontend

A modern Next.js frontend for a dry-cleaning / pressing management app. This repository contains the UI for managing clients, orders, inventories, planning and basic settings. Built with Next.js (App Router) and TypeScript.

## Quick overview

- Framework: Next.js + TypeScript
- Styling: (global CSS + component UI primitives in `shared/components/ui`)
- Purpose: internal management dashboard for a pressing/dry-cleaning business

## Features

- Client management (list, forms)
- Orders (forms, tables)
- Inventories overview
- Planning and analytics views
- Authentication (register / login pages)

## Prerequisites

- Node.js 18+ recommended
- npm, yarn, or pnpm (this README uses npm examples)

## Install

Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

## Development

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Common scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — start production server after build
- `npm run lint` — run linter (if configured)

Check `package.json` for the exact scripts configured for this repo.

## Environment

There are no required environment variables checked into this repo. If you connect to an API, you may want to set variables like `NEXT_PUBLIC_API_URL` in a `.env.local` file. Example:

```
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Project structure

Top-level files

```
eslint.config.mjs
next-env.d.ts
next.config.ts
package.json
postcss.config.mjs
README.md
tsconfig.json
```

App and routes

```
app/
  globals.css
  layout.tsx
  not-found.tsx
  (protected)/
    layout.tsx
    page.tsx
    analytics/
      page.tsx
    clients/
      page.tsx
    inventories/
      page.tsx
    orders/
      page.tsx
    planning/
      page.tsx
    settings/
      page.tsx
  auth/
    login/
      page.tsx
    register/
      page.tsx
```

Feature modules

```
features/
  analytics/
    components/
    services/mock-analytics.ts
    views/analytics-view.tsx
  auth/
    components/
    views/
  customers/
    components/
      forms/customer-form.tsx
      tables/customer-list.tsx
    services/customer-mock.ts
    types/customer.ts
    views/customers-view.tsx
  dashboard/
    components/
      activity-feed.tsx
      order-card.tsx
      stat-card.tsx
    services/
      dashboard-api.ts
      dashboard-mock.ts
    views/dashboard-view.tsx
  inventories/
    components/
      forms/
      tables/inventory-table.tsx
    services/inventory-mocks.ts
    types/inventory.ts
    views/inventories-view.tsx
  orders/
    components/
      forms/order-form.tsx
      forms/schemas.tsx
      tables/order-table.tsx
    types/order.ts
    views/orders-view.tsx
  planning/
    components/
    services/planning-mock.ts
    views/planning-view.tsx
  settings/
    components/
      general-settings.tsx
      security-settings.tsx
      services-config.tsx
    views/settings-view.tsx

lib/
  utils.ts

shared/
  components/
    confirm-modal.tsx
    layout/
      header.tsx
      navigation-menu.tsx
      new-order-button.tsx
      sidebar-footer.tsx
      sidebar-header.tsx
      sidebar.tsx
    ui/
      alert-dialogue.tsx
      avatar.tsx
      badge.tsx
      button.tsx
      calendar.tsx
      card.tsx
      checkbox.tsx
      dialog.tsx
      dropdown-menu.tsx
      form.tsx
      input.tsx
      label.tsx
      popper.tsx
      progress.tsx
      select.tsx
      seperator.tsx
      switch.tsx
      table.tsx
      tabs.tsx
      textarea.tsx
  data/menu.data.tsx
  hooks/useClientFormatter.tsx
  types/menu.d.ts

public/

```

## Notes & tips

- The `features/*` folders implement domain-specific UI and are a good place to add tests or mocks.
- Shared UI primitives live under `shared/components/ui` — reuse them to keep the UI consistent.
- There are a number of `*-mock.ts` files under `features/*/services` for local development/testing.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Open a pull request and describe the change

If you'd like, I can add a `CONTRIBUTING.md` template and a suggested `ISSUE_TEMPLATE`.

## License

No `LICENSE` file was found in the repo. If you want to open-source this, consider adding an `MIT` or other license. Example quick command to add MIT:

```bash
echo "MIT License\n\nCopyright (c) $(date +%Y)" > LICENSE
```

## Contact

If you need help or want further README changes, tell me what to highlight (API docs, deployment, CI, tests), and I’ll add it.

---
Generated and updated by your helper — let me know if you want this README in French or with additional sections (CI, testing, Docker).
