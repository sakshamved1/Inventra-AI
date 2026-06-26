# Smart Inventory OS - Setup & Deployment Guide

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas cloud)
- Gemini API key from Google AI Studio
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
cd Inventra AI
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Update:
# - MONGODB_URI (local or MongoDB Atlas connection string)
# - JWT_SECRET (use a strong random key)
# - GEMINI_API_KEY (from Google AI Studio)
# - PORT (default: 5000)

# Start development server
npm run dev
```

Backend will run on: `http://localhost:5000`

### 3. Frontend Setup

In a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env if needed
# VITE_API_BASE_URL=http://localhost:5000

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

### 4. Access the Application

Open your browser and go to: `http://localhost:5173`

**Default Test Credentials:**
- Email: test@example.com
- Password: password123

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service:
   ```bash
   # Windows
   mongod

   # macOS (if installed via Homebrew)
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

3. Update `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/Inventra AI
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Copy connection string
5. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/Inventra AI?retryWrites=true&w=majority
   ```

## 🤖 Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com)
2. Click "Get API Key"
3. Create a new API key
4. Copy the key
5. Update `.env`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

## 🔐 Security Setup

### JWT Secret

Generate a strong JWT secret:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update `.env`:
```
JWT_SECRET=your_generated_secret_here
```

## 📦 Production Build

### Frontend

```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

Build output will be in `frontend/dist/`

### Backend

```bash
cd backend
npm start
```

## 🌐 Deployment

### Deploy Frontend

#### Vercel (Recommended)

```bash
npm install -g vercel
cd frontend
vercel
```

#### Netlify

```bash
cd frontend
npm run build
# Deploy the 'dist' folder to Netlify
```

#### GitHub Pages

Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/Inventra AI/',
  // ... rest of config
})
```

### Deploy Backend

#### Heroku

```bash
# Install Heroku CLI
heroku login
cd backend
heroku create your-app-name
git push heroku main
```

Update `Procfile`:
```
web: node src/server.js
```

#### Railway

1. Connect GitHub repository
2. Add MongoDB database
3. Set environment variables
4. Deploy

#### DigitalOcean

1. Create a Droplet
2. SSH into the server
3. Install Node.js and MongoDB
4. Clone repository
5. Setup PM2 for process management
6. Configure Nginx as reverse proxy

## 🔧 Environment Variables

### Backend (.env)

```
# Database
MONGODB_URI=mongodb://localhost:27017/Inventra AI

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key_here

# AI
GEMINI_API_KEY=your_gemini_api_key_here

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

```
# API
VITE_API_BASE_URL=http://localhost:5000
```

## 🧪 Testing

### Backend API Testing

Use Postman or curl:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123","confirmPassword":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Frontend Testing

1. Register a new account
2. Login
3. Navigate through dashboard
4. Create a product
5. Create a transaction
6. Test AI assistant with questions

## 📊 Database Collections

Collections created automatically:

- **users** - User accounts and authentication
- **products** - Product inventory
- **transactions** - Stock movements

## 🚨 Common Issues

### MongoDB Connection Error

**Problem:** `MongoServerSelectionError`

**Solution:**
1. Check MongoDB is running
2. Verify connection string
3. Check network connectivity for Atlas
4. Verify IP whitelist on Atlas

### Gemini API Error

**Problem:** `API key not valid`

**Solution:**
1. Verify API key is correct
2. Check API is enabled
3. Ensure quota is available

### CORS Error

**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Check backend CORS configuration
2. Verify API URL in frontend .env
3. Restart both servers

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

## 🎯 Performance Optimization

### Frontend

- Lazy load routes with React.lazy
- Use React Suspense for code splitting
- Optimize images
- Minify CSS/JS in production

### Backend

- Add database indexes
- Implement caching
- Use pagination for large datasets
- Add request rate limiting

## 📚 Documentation

- [React Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion)
- [Google Generative AI Documentation](https://ai.google.dev)

## 🆘 Support

For issues and questions:
1. Check documentation
2. Review common issues section
3. Check error logs
4. Contact development team

## 📝 License

MIT License - See LICENSE file

---

**Happy Building! 🚀**
