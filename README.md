# 🎯 Pulgax 3D Store - Complete E-commerce Solution

A modern, independent 3D printing store with full admin panel and API backend.

## ✨ Features

- 🛒 **Complete E-commerce Store** - Product catalog, categories, shopping cart
- 👨‍💼 **Full Admin Panel** - Manage products, categories, orders, messages
- 🔐 **Secure Authentication** - JWT-based admin login system
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🌍 **Multi-language** - Portuguese and English support
- 🎨 **Modern UI** - Beautiful design with dark/light theme
- 📊 **Dashboard Analytics** - Real-time statistics and insights
- 🔄 **Real-time Updates** - Live data synchronization
- 🚀 **Production Ready** - Optimized for deployment

## 🏗️ Architecture

- **Frontend**: React 18 + Tailwind CSS + shadcn/ui
- **Backend**: FastAPI + MongoDB/JSON storage
- **Authentication**: JWT tokens with bcrypt password hashing
- **Database**: MongoDB (production) or JSON files (development)
- **Deployment**: Docker + Docker Compose ready

## 🚀 Quick Start

### Option 1: Docker (Recommended)
```bash
# Clone the repository
git clone https://github.com/yourusername/pulgax3d-store.git
cd pulgax3d-store

# One-click deployment
deploy.bat

# Access your store
# Frontend: http://localhost
# Admin: http://localhost/admin
# API: http://localhost:8000
```

### Option 2: Manual Setup
```bash
# Backend
cd backend
python server_simple.py  # Simple JSON storage
# OR
python server.py         # Full MongoDB version

# Frontend (new terminal)
cd frontend
npm install
npm start
```

## 🎯 First Time Setup

1. **Start the application** (using Docker or manual setup)
2. **Go to admin panel**: http://localhost/admin
3. **Create admin account**: Click "Create admin account"
4. **Fill in your details**: Name, email, password
5. **Start managing**: Add categories, products, view orders

## 📁 Project Structure

```
pulgax3d-store/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   └── api.js          # API client
│   ├── public/             # Static assets
│   └── Dockerfile          # Frontend Docker config
├── backend/                 # FastAPI backend
│   ├── server.py           # Full MongoDB version
│   ├── server_simple.py    # JSON storage version
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend Docker config
├── docker-compose.yml      # Full stack deployment
├── deploy.bat             # One-click deployment
└── DEPLOYMENT_GUIDE.md    # Production deployment guide
```

## 🔧 Configuration

### Backend Environment (.env)
```env
# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=pulgax_3d_store

# Security
JWT_SECRET=your-super-secure-secret-key

# CORS
CORS_ORIGINS=http://localhost:3000,https://yoursite.com
```

### Frontend Environment (.env)
```env
# API URL
REACT_APP_BACKEND_URL=http://localhost:8000
```

## 🌐 Production Deployment

Your store is ready for production! See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for:

- **Free hosting options** (Netlify, Vercel, Railway)
- **VPS deployment** (DigitalOcean, Linode)
- **Domain setup** and SSL certificates
- **Database hosting** (MongoDB Atlas)
- **CI/CD pipelines**

### Quick Deploy Options:
- **Frontend**: Netlify, Vercel (Free tier available)
- **Backend**: Railway, Render, Heroku
- **Database**: MongoDB Atlas (Free 512MB)
- **Total cost**: $0-15/month

## 🛡️ Security Features

- ✅ **JWT Authentication** with secure token handling
- ✅ **Password Hashing** using bcrypt
- ✅ **CORS Protection** with configurable origins
- ✅ **Input Validation** with Pydantic models
- ✅ **SQL Injection Protection** (NoSQL database)
- ✅ **XSS Protection** with proper sanitization

## 📊 Admin Panel Features

- **Dashboard**: Real-time statistics and overview
- **Categories**: Create, edit, delete product categories
- **Products**: Full product management with images, colors, sizes
- **Orders**: View and manage customer orders
- **Messages**: Handle customer contact messages
- **Multi-language**: Portuguese and English interface

## 🔄 API Endpoints

- `GET /api/` - Health check
- `POST /api/admin/register` - Create admin account
- `POST /api/admin/login` - Admin login
- `GET /api/categories` - Get categories
- `POST /api/categories` - Create category
- `GET /api/products` - Get products
- `POST /api/products` - Create product
- `GET /api/orders` - Get orders
- `GET /api/contact` - Get messages
- `GET /api/stats` - Dashboard statistics

Full API documentation available at: http://localhost:8000/docs

## 🎨 Customization

The store is fully customizable:
- **Colors & Themes**: Modify Tailwind CSS classes
- **Layout**: Update React components
- **Features**: Add new API endpoints and UI
- **Branding**: Replace logo and styling
- **Languages**: Add more language support

## 📱 Mobile Support

- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Touch Friendly** - Optimized for mobile interaction
- ✅ **Fast Loading** - Optimized images and code splitting
- ✅ **PWA Ready** - Can be installed as mobile app

## 🆘 Support

### Common Issues:
- **API not connecting**: Check if backend is running on port 8000
- **CORS errors**: Verify CORS_ORIGINS in backend configuration
- **Database connection**: Ensure MongoDB is running or use JSON version
- **Build errors**: Run `npm install` in frontend directory

### Development:
```bash
# View backend logs
docker compose logs backend -f

# View frontend logs  
docker compose logs frontend -f

# Restart services
docker compose restart

# Stop all services
docker compose down
```

## 📄 License

This project is completely independent and you own all the code. You can:
- ✅ Use for commercial purposes
- ✅ Modify and customize freely
- ✅ Deploy anywhere you want
- ✅ No vendor lock-in or dependencies

## 🌟 What's Next?

Your Pulgax 3D Store is production-ready! Consider adding:
- **Payment Integration** (Stripe, PayPal)
- **Email Notifications** (SendGrid, Mailgun)
- **Analytics** (Google Analytics)
- **SEO Optimization** (Meta tags, sitemap)
- **Social Media Integration**
- **Customer Reviews** system
- **Inventory Management**
- **Multi-vendor Support**

---

**🎉 Congratulations! Your independent 3D printing store is ready for the world!**
