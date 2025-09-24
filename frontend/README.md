# Dex-Product-Store Frontend

This is the frontend React application for the Dex-Product-Store project, built with Vite and modern web technologies.

## 🚀 Tech Stack

- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS + DaisyUI** - Utility-first CSS framework with component library
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Toast notifications

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AddProductModal.jsx
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   └── ThemeSelector.jsx
├── pages/              # Page components
│   ├── HomePage.jsx
│   └── ProductPage.jsx
├── store/              # State management
│   ├── useProductStore.js
│   └── useThemeStore.js
├── constants/          # App constants
└── main.jsx           # App entry point
```

## 🌐 Production Deployment

The frontend is deployed on Vercel with automatic rewrites to the Fly.io backend for API calls.
