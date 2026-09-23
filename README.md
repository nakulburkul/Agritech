# AgriTech

A full-stack agricultural web platform designed to empower farmers and buyers. This application provides AI-driven insights, live market predictions, and real-time weather analytics to support smarter, more sustainable farming.

## Key Features

*   **Farmer Dashboard:** A dedicated portal for verified sellers to manage active crop listings, track inventory, and negotiate direct deals with buyers.
*   **Live Market Prices:** APMC mandi rates across different cities, complete with interactive UI cards, location filtering, and price trend indicators.
*   **AI & Weather Insights:** Integrated crop prediction tools, local weather forecasts, and dynamic market trend analytics for better decision-making.
*   **Cinematic UI:** A highly responsive frontend featuring scroll-driven animations, Framer Motion page transitions, and Lenis smooth scrolling.

## Tech Stack

*   **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Lucide React.
*   **Backend:** Python, Django, and SQLite for lightweight, secure data management.

## Local Setup Instructions

To run this project on your local machine, you will need to start both the Django backend server and the React frontend server.

### 1. Backend Setup (Django)
*   Open a terminal and navigate to your main project folder.
*   Run `python manage.py migrate` to initialize your local SQLite database.
*   Run `python manage.py runserver` to boot up the backend API.

### 2. Frontend Setup (React/Vite)
*   Open a second, separate terminal in the same root folder.
*   Run `npm install` to download all necessary dependencies into the `node_modules` folder.
*   Run `npm run dev` to start the blazing-fast Vite development server.

---
*Developed by Nakul Burkul, Ansel, and Utsav for the Artificial Intelligence and Machine Learning program at St. Francis Institute of Technology.*
