# Smart Inventory OS Frontend Setup

## Environment Variables

Create a `.env` file in the frontend directory with the following:

```
VITE_API_BASE_URL=http://localhost:5000
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Build for Production

```bash
npm run build
```

## Features

### Pages
- **Login/Register** - User authentication
- **Dashboard** - Overview with KPI cards, charts, and transactions
- **Products** - Product management with CRUD operations
- **Transactions** - Stock In/Out tracking
- **AI Assistant** - Chat interface for inventory insights

### UI Components
- Reusable Button, Card, Input, Select, Badge components
- Modal and Toast notifications
- Loading skeletons
- Responsive design with Tailwind CSS
- Dark mode support
- Framer Motion animations

### Features
- Protected routes
- JWT-based authentication
- Real-time inventory tracking
- Health score calculation
- AI-powered inventory insights
- Responsive dashboard
