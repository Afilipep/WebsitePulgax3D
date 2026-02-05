# Render Deployment Guide

## Backend Configuration

### Required Render Settings:
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
- **Root Directory**: `backend`
- **Python Version**: Automatically detected from `runtime.txt` (Python 3.12.7)

### Environment Variables:
Set these in your Render dashboard:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pulgax_3d_store
CORS_ORIGINS=https://your-frontend-domain.com
JWT_SECRET=your-secure-jwt-secret-key-64-chars-minimum
DB_NAME=pulgax_3d_store
```

### Files Added/Updated:
- ✅ `backend/runtime.txt` - Forces Python 3.12.7
- ✅ `backend/requirements.txt` - Updated pydantic to 2.5.3 for compatibility
- ✅ `backend/Dockerfile` - Updated to Python 3.12-slim
- ✅ `backend/server.py` - Production-ready with proper environment variables

### Troubleshooting:
If Python 3.13 is still used:
1. Ensure `backend/runtime.txt` exists with `python-3.12.7`
2. Set Root Directory to `backend` in Render dashboard
3. Clear build cache and redeploy

The `runtime.txt` file should force Render to use Python 3.12.7, avoiding the pydantic-core build issues with Python 3.13.