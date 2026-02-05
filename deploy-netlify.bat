@echo off
echo Building Pulgax 3D Store for Netlify deployment...
cd frontend
call npm run build
echo.
echo Build completed! 
echo.
echo To deploy to Netlify:
echo 1. Go to https://netlify.com
echo 2. Drag and drop the 'frontend/build' folder
echo 3. Or connect your Git repository for automatic deployments
echo.
echo Admin credentials:
echo Email: admin@pulgax.com
echo Password: admin123
echo.
pause