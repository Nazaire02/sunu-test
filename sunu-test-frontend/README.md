# RÉASSURANCE - Frontend Application

A modern Next.js 16 web application for managing requests and workflow approvals with a robust UI built on React 19, TypeScript, and Tailwind CSS.

## 🎯 Project Overview

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sunu-test-frontend

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Production

```bash
# Build the application
npm build

# Start the production server
npm start
```

## 📁 Project Structure

```
sunu-test-frontend/
├── app/                          # Next.js app router directory
│   ├── layout.tsx               # Root layout with metadata
│   ├── globals.css              # Global Tailwind styles
│   ├── not-found.tsx            # 404 page
│   └── (protected)/             # Protected route group
│       ├── layout.tsx           # Protected routes layout
│       ├── page.tsx             # Dashboard home
│       ├── demandes/            # Request management feature
│       │   └── [id]/            # Request detail page
│       └── workflow/            # Workflow management feature
│           └── [id]/            # Workflow detail page
│
├── features/                     # Feature-based modules
│   └── demandes/                # Requests feature
│       ├── components/          # Feature-specific components
│       │   ├── CotationStepper.tsx
│       │   ├── DemandeList.tsx
│       │   ├── DemandeTable.tsx
│       │   ├── StatutBadge.tsx
│       │   ├── StepAccepte.tsx
│       │   ├── StepEnAttente.tsx
│       │   ├── StepRefuse.tsx
│       │   ├── StepReponseRecue.tsx
│       │   └── ...
│       ├── data/                # Mock data and fixtures
│       ├── hooks/               # Feature-specific hooks (useDemandes)
│       ├── services/            # API services
│       └── views/               # Feature views/pages
│
├── shared/                       # Shared utilities and components
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── table.tsx
│   │   │   ├── form.tsx
│   │   │   └── ...
│   │   └── layout/              # Layout components
│   │       ├── header.tsx
│   │       ├── sidebar.tsx
│   │       └── navigation-menu.tsx
│   ├── data/                    # Shared data
│   └── types/                   # Shared type definitions
│
├── lib/                          # Utility functions
│   ├── demandes.ts
│   └── utils.ts
│
└── public/                       # Static assets
```

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
