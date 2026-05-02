# Coursivo Frontend

React 19 + TypeScript + Vite frontend for Coursivo — an EdTech platform for educators to sell courses and test series.

## Features

- **Course Builder**: Intuitive drag-and-drop course creation.
- **Instructor Dashboard**: Detailed analytics and course management.
- **Student Experience**: Seamless course consumption and testing.
- **Editorial Scholar UI**: Premium, high-contrast design system.

## Tech Stack

- **React 19**
- **TypeScript**
- **Vite 7**
- **Tailwind CSS v3** (OKLCH colors)
- **shadcn/ui**
- **Redux Toolkit**
- **React Router 7**

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build & Lint

```bash
# Type-check and build for production
npm run build

# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## Related Projects

- [coursivo-backend](../coursivo-backend): Spring Boot 4.0 API.
