# Gestion Pressing Frontend

A **Next.js 14** application that serves as the front end for the `gestion-pressing` system—an administrative dashboard and client interface for a pressing/laundry management service. The codebase is written entirely in **TypeScript** and follows the App Router architecture with server and client components.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ / 20+ (LTS recommended)
- npm, Yarn or pnpm
- Tailwind CSS (included via dependencies)

Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

### Development

Start the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application. Live reload is enabled; modify files under the `app/` directory to see changes.

### Environment variables

Create a `.env` file at the project root and define any required secrets, for example:

```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXTAUTH_URL=http://localhost:3000

# add other keys used by auth, analytics, etc.
```

Refer to the `/lib` and `/context` modules for the specific variables consumed.

## 🧱 Architecture Overview

- **app/** – Next.js App Router pages and layouts (public and authenticated sections)
- **context/** – React contexts (authentication, etc.)
- **features/** – Domain-specific modules (analytics, orders, customers, etc.) with their own components, services, types and views
- **shared/** – Generic components, hooks and utilities used across features
- **lib/** – low-level helpers (jwt, auth, utils)
- **public/** – Static assets

Authentication is managed via a custom context and tokens (see `lib/auth.ts` and `features/auth`).  Services wrap fetch calls with a centralized `fetch-wrapper` in `shared/services`.

## 📁 Directory Structure

Below is a high-level view of the main folders and their purpose. Each feature typically contains its own sub‑folders for components, services, types, and views.

```
app/                         # Next.js routing: pages & layouts
  globals.css
  layout.tsx
  auth/                      # public auth pages (login/register/verify)
  (protected)/               # authenticated area
    _planning/
    analytics/
    clients/
    inventories/
    managers/
    orders/
    pricings/
    settings/
    shifts/
context/                     # React context providers (auth, etc.)
features/                    # Domain modules
  analytics/
    services/
    types/
    views/
  articles/
    components/
    services/
    types/
  auth/
    components/
      register/
    forms/
      login/
      register/
      verify-email/
    services/
    store/
    types/
      login.ts
      pressing.ts
      register.ts
      user.ts
    views/
      login/
      register/
      verify-email/
  customers/
    components/
      forms/
      tables/
    services/
    types/
    views/
  # ... other feature folders similar structure ...
shared/                     # shared components, hooks, services, utils
  components/
    confirm-modal.tsx
    data-table.tsx
    layout/
    ui/
  data/
    city.data.ts
    menu.data.tsx
  hooks/
    use-fetch.ts
    useClientFormatter.tsx
  services/
    error-handler.ts
    fetch-wrapper.ts
  types/
    menu.d.ts
  utils/
    time-ago.ts
lib/                         # low-level helpers (jwt, auth, etc.)
public/                      # static assets (images, fonts, etc.)

```

## ✅ Running Tests

*(if applicable)*

```bash
npm run test
```


## 📦 Deployment

You can deploy the frontend easily on Vercel by pushing to the main branch. Alternatively, use Docker or another Node hosting provider. Ensure environment variables are set in the deployment platform.

## 📚 Learn More

For general Next.js reference:

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Overview](https://nextjs.org/docs/app)

## 🤝 Contributing

Feel free to open issues or pull requests. Follow typical GitHub community practices:

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Submit a pull request describing your changes

## 🛡 Security

Snyk is configured for security scans. Run `snyk_code_scan` after making changes and address any findings before merging.

---

*Generated initially with `create-next-app` and customized for the pressing management project.*
