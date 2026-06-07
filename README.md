# ShapeStream — Technical Assessment Solution

ShapeStream is a real-time full-stack web application built to allow administrators to manage a catalog of shape items (name, color, shape, and timestamp) while regular users can view these items updated dynamically in real-time.

This project implements a clean separation of concern between the React frontend and Django backend, coupled with a premium, responsive design system.

---

## 🚀 Live Demo
* **Deployed Web URL**: [https://shapestream-bvxhu.ondigitalocean.app/](https://shapestream-bvxhu.ondigitalocean.app/)
* **Default Admin Credentials**:
  * **Username**: `admin`
  * **Password**: `password`

---

## 🛠 Tech Stack

### Frontend
* **Core**: React 19, Vite (for ultra-fast development and optimized production building)
* **Styling**: Tailwind CSS with custom fonts (Playfair Display for headers, Inter for UI text)
* **Real-time Pipeline**: Native browser WebSockets
* **Testing**: Vitest + jsdom + React Testing Library

### Backend
* **Core Framework**: Python Django 6 & Django REST Framework (DRF)
* **ASGI Server**: Daphne (for concurrent HTTP and WebSocket connections)
* **Real-time Pipeline**: Django Channels (broadcasting mutations using memory or Upstash Redis)
* **Database**: PostgreSQL (production) / SQLite (local development fallback)
* **Authentication**: JWT (`djangorestframework-simplejwt`)
* **Testing**: Django APITestCase

---

## 📁 Project Structure

```
ALPHV_Project/
├── README.md                  # Project-wide documentation
├── backend_project/           # Django Backend Application
│   ├── api/                   # REST API and Channels App
│   │   ├── migrations/        # DB Migrations (includes auto-seeded admin)
│   │   ├── consumers.py       # WebSocket connection handlers
│   │   ├── serializers.py     # Data validators and formatters
│   │   └── tests.py           # Backend automated unit tests
│   ├── backend_project/       # Core project settings and routing
│   │   ├── settings.py        # Django config (CORS, Channels, Databases)
│   │   └── asgi.py            # ASGI endpoint mapping
│   ├── manage.py
│   └── requirements.txt       # Backend Python dependencies
└── frontend/                  # React Frontend Application
    ├── src/
    │   ├── components/        # Frontend view components
    │   │   ├── Welcome.jsx    # Portal Selection Landing Page
    │   │   ├── Auth.jsx       # Unified JWT Authentication
    │   │   ├── AdminPortal.jsx# Privileged CRUD interface
    │   │   └── UserPortal.jsx # Real-time visual grid display
    │   ├── App.jsx            # React routing rules
    │   ├── App.test.jsx       # Frontend automated unit tests
    │   └── index.css          # Design system variables & micro-animations
    ├── package.json           # Frontend Node dependencies
    └── vite.config.js         # Build system configuration
```

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env` or DO App Settings)
* `VITE_API_URL`: The URL of the backend API (e.g. `https://your-backend.ondigitalocean.app` or `http://localhost:8000`). **Do not include a trailing slash.**
* `VITE_WS_URL`: The WebSocket equivalent URL of the backend API (e.g. `wss://your-backend.ondigitalocean.app` or `ws://localhost:8000`). **Do not include a trailing slash.**

### Backend (`backend_project/` Environment Variables)
* `DEBUG`: Set to `True` for local error trace screens, defaults to `False`.
* `DATABASE_URL`: Connection string for PostgreSQL database. Falls back to SQLite if not provided.
* `REDIS_URL`: Upstash or DigitalOcean Redis connection string for Channels. Falls back to In-Memory Channel Layer if not provided.
* `FRONTEND_URL`: The exact production domain of the frontend app (e.g. `https://shapestream-bvxhu.ondigitalocean.app`). Configures CORS rules dynamically. **Do not include a trailing slash.**

---

## 🏃‍♂️ How to Run Locally

### 1. Run the Backend
Navigate to the backend directory, set up your Python environment, and start the Daphne server:
```bash
cd backend_project
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```
*The local development server will be available at `http://127.0.0.1:8000`.*

### 2. Run the Frontend
Navigate to the frontend directory, install dependencies, and run the Vite dev server:
```bash
cd ../frontend
npm install
npm run dev
```
*The React app will start at `http://localhost:5173`.*

---

## 🧪 Running Automated Tests

### Backend Tests
Runs APITestCase suite covering authentication, REST endpoints, and schema validators:
```bash
cd backend_project
python manage.py test
```

### Frontend Tests
Runs Vitest environment verifying rendering safety and Auth views:
```bash
cd frontend
npm run test
```

---

## ✨ Features and Details
* **JWT Authentication**: Users and Admins obtain JSON Web Tokens to query API endpoints securely.
* **Robust Input Validation**: Forms are checked on the frontend before dispatch, and sanitized on the backend through Django DRF Serializers.
* **Auto-seeded Admin Account**: On initial migration, a data migration script automatically provisions the default `admin` superuser if it does not exist, ensuring clean deployments.
