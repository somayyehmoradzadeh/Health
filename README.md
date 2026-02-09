
# Medical Travel Platform 🏥✈️

A full-stack medical travel management platform built with **Django REST Framework** and **Next.js**.

This platform allows patients and staff to manage medical cases, documents, and invoices in a secure and modern dashboard.

---

## ✨ Features

### 👤 Guest Users
- Landing / Home page with platform introduction
- Feature overview
- Call to action for registration and login

### 🔐 Authenticated Users
- Personalized dashboard (data from backend, not fake)
- Overview of:
  - Total cases
  - Medical documents
  - Unpaid invoices
- Recent:
  - Cases
  - Invoices
  - Documents
- Secure JWT authentication

### 🛠 Staff Users
- Access to all related cases
- Full visibility of documents and invoices

---

## 🧱 Tech Stack

### Backend
- Python 3.12
- Django
- Django REST Framework
- JWT Authentication
- PostgreSQL (recommended)
- django-cors-headers

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Fetch API
- JWT-based auth

---

## 📸 Screenshots

> Screenshots are located in the `screenshots/` folder.

### Home Page (Guest)
![Home Guest](screenshots/home.png)

### Home Page (Logged In)
![Home Logged In](screenshots/home-after-login.png)

### Dashboard Overview
![Dashboard](screenshots/dashboard.png)

---

## 🚀 How to Run the Project Locally

### 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/medical-travel-platform.git
cd medical-travel-platform
```

Backend Setup (Django)
2️⃣ Create Virtual Environment

```bash
cd backend
python -m venv .venv
```

Activate it:

Windows:

```bash
.venv\Scripts\activate
```

Linux / macOS

```bash
source .venv/bin/activate
3️⃣ Install Dependencies
pip install -r requirements.txt
```
```bash
4️⃣ Environment Variables

Create .env file in backend/:

DJANGO_SECRET_KEY=your-secret-key
DEBUG=1
ALLOWED_HOSTS=127.0.0.1,localhost
DATABASE_URL=postgres://user:password@localhost:5432/medical_travel
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

```bash
5️⃣ Database & Migrations
python manage.py migrate
python manage.py createsuperuser
```
```bash
6️⃣ Run Backend Server
python manage.py runserver

Backend will run on:

http://127.0.0.1:8000
🎨 Frontend Setup (Next.js)
```
```bash
7️⃣ Install Dependencies
cd ../frontend
npm install
```

```bash
8️⃣ Frontend Environment Variables

Create frontend/.env.local:

NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000

```

```bash
9️⃣ Run Frontend
npm run dev
```

Frontend will run on:

http://localhost:3000
🔐 Authentication

JWT-based authentication

Tokens stored securely on the client

Backend endpoints protected with IsAuthenticated

📂 Project Structure (Simplified)
medical-travel-platform/
│
├─ backend/
│   ├─ cases/
│   ├─ documents/
│   ├─ billing/
│   └─ users/
│
├─ frontend/
│   ├─ app/
│   ├─ components/
│   └─ services/
│
└─ screenshots/

