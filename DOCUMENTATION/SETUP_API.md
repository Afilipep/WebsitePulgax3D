# Pulgax 3D Store - API Setup Guide

## Prerequisites

1. **Python 3.8+** - Download from [python.org](https://python.org)
2. **MongoDB** - Choose one option:
   - **Local MongoDB**: Download from [mongodb.com](https://mongodb.com/try/download/community)
   - **MongoDB Atlas**: Free cloud database at [mongodb.com/atlas](https://mongodb.com/atlas)

## Quick Start

### 1. Start MongoDB (if using local installation)
```bash
# Windows (if MongoDB is installed as service)
net start MongoDB

# Or start manually
mongod --dbpath C:\data\db
```

### 2. Start the Backend API
```bash
# Navigate to backend folder
cd backend

# Run the start script (Windows)
start.bat

# Or manually:
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Start the Frontend
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (if not done already)
npm install

# Start the development server
npm start
```

## Configuration

### Backend Configuration (backend/.env)
```env
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=pulgax_3d_store

# JWT Configuration
JWT_SECRET=pulgax-3d-store-secret-key-2024

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Server Configuration
PORT=8000
HOST=0.0.0.0
```

### Frontend Configuration (frontend/.env)
```env
# Real API Configuration
REACT_APP_BACKEND_URL=http://localhost:8000
```

## Using MongoDB Atlas (Cloud Database)

If you prefer using MongoDB Atlas instead of local MongoDB:

1. Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `backend/.env`:
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=pulgax_3d_store
```

## API Endpoints

Once running, your API will be available at:
- **Base URL**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Admin Panel**: http://localhost:3000/admin

### Key Endpoints:
- `POST /api/admin/register` - Create first admin account
- `POST /api/admin/login` - Admin login
- `GET /api/categories` - Get categories
- `GET /api/products` - Get products
- `GET /api/stats` - Dashboard statistics

## First Time Setup

1. Start both backend and frontend
2. Go to http://localhost:3000/admin
3. Click "Create admin account" 
4. Fill in your admin details
5. Start managing your store!

## Troubleshooting

### Backend Issues:
- **Port 8000 in use**: Change PORT in backend/.env
- **MongoDB connection failed**: Check if MongoDB is running
- **Python not found**: Install Python and add to PATH

### Frontend Issues:
- **API connection failed**: Check if backend is running on port 8000
- **CORS errors**: Verify CORS_ORIGINS in backend/.env includes your frontend URL

## Features

✅ **Complete Admin Panel**
- Dashboard with statistics
- Category management
- Product management (with images, colors, sizes)
- Order management
- Contact message management

✅ **Real Database Storage**
- MongoDB for persistent data
- JWT authentication
- Secure password hashing

✅ **Production Ready**
- FastAPI backend with automatic API docs
- React frontend with modern UI
- Proper error handling and validation