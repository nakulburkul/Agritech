@echo off
echo Starting Agritech Servers...

:: 1. Start the Django Backend (Activates your virtual environment and runs server)
start "Django Backend" cmd /k "venv\Scripts\activate && python manage.py runserver"

:: 2. Start the React/Vite Frontend
:: Note: If your React package.json is inside a subfolder (like 'frontend'), 
:: change the command below to: "cd frontend && npm run dev"
start "React Frontend" cmd /k "npm run dev"