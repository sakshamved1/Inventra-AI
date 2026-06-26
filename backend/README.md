# Smart Inventory OS Backend Setup

## Environment Variables

Create a `.env` file in the backend directory with the following:

```
MONGODB_URI=mongodb://localhost:27017/Inventra AI
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running on your system

3. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/low-stock` - Get low stock products
- `GET /api/products/summary` - Get inventory summary

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/recent` - Get recent transactions
- `GET /api/transactions/product/:productId` - Get product transactions

### AI Assistant
- `POST /api/ai/insights` - Get inventory insights
- `GET /api/ai/health-score` - Get inventory health score
