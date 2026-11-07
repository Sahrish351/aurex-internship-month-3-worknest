@echo off
echo =======================================================
echo  Starting WorkNest Full-Stack Development Servers
echo =======================================================
echo.
echo [1/2] Launching Backend API Server on http://localhost:5000 ...
start "WorkNest Backend" cmd /k "cd backend && npm run dev"

echo [2/2] Launching Frontend Client on http://localhost:5173 ...
start "WorkNest Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Servers are launching in separate windows.
echo  - Backend:  http://localhost:5000/api/health
echo  - Frontend: http://localhost:5173
echo.
echo Press any key to exit this launcher window...
pause > nul

