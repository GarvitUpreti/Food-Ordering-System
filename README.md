# Food-Delivery-System

FOOD ORDERING PLATFORM – FULL STACK RBAC APPLICATION

A complete web-based food ordering application demonstrating Role-Based Access Control (RBAC) and Location-Based Access Filtering.

Assignment for: Slooze  
Tech Stack: NestJS (Backend), Next.js (Frontend), PostgreSQL, Prisma

## 🚀 Live Demo

> **Note:** Please use a **desktop/laptop** for the best experience.

👉 **Live Application:**  
https://foodorderingsystem-jet.vercel.app/
---

## ASSIGNMENT REQUIREMENTS COMPLETED

1. Full-stack web application (Backend + Frontend)
2. View restaurants and menu items
3. Create orders and add food items
4. Checkout cart and pay using payment method
5. Cancel orders
6. Modify payment methods
7. Role-Based Access Control (RBAC)
8. BONUS: Country-based access filtering (India / America)

---

## USER ROLES & ACCESS MATRIX

View restaurants & menu items  
- Admin: Yes  
- Manager: Yes (own country only)  
- Member: Yes (own country only)

Create order (add items)  
- Admin: Yes  
- Manager: Yes  
- Member: Yes  

Place order (checkout & pay)  
- Admin: Yes  
- Manager: Yes  
- Member: No  

Cancel order  
- Admin: Yes  
- Manager: Yes  
- Member: No  

Update payment method  
- Admin: Yes  
- Manager: No  
- Member: No  

---

## COUNTRY-BASED ACCESS (BONUS)

- Admin has global access (India + America)
- Managers and Members can only access their own country’s data
- Cross-country access is enforced at backend level

---

## PROJECT STRUCTURE

Food-Delivery-System/  
├── README.md  
├── food-ordering-backend/  
│   ├── src/  
│   ├── prisma/  
│   └── package.json  
├── food-ordering-frontend/  
│   ├── src/  
│   └── package.json  
├── api-collection.json  
└── screenshots/  

---

## HOW TO RUN THE PROJECT LOCALLY

### PREREQUISITES

- Node.js v18 or higher
- npm
- Git
- Internet connection

---

## STEP 1: CLONE THE REPOSITORY

    git clone https://github.com/GarvitUpreti/Food-Delivery-System.git
    cd Food-Delivery-System

---

## STEP 2: BACKEND SETUP

Navigate to backend folder:

    cd food-ordering-backend

Install dependencies:

    npm install

Create a .env file in backend root:

    DATABASE_URL=postgresql://<username>:<password>@<host>:5432/<database>?sslmode=require
    JWT_SECRET=your-secret-key
    JWT_EXPIRES_IN=7d
    ENCRYPTION_KEY=64-character-secret-key
    PORT=3001

Run database setup and start backend:

    npx prisma generate
    npx prisma migrate dev
    node prisma/seed.js
    npm run start:dev

Backend runs at:  
http://localhost:3001/api

---

## STEP 3: FRONTEND SETUP

    cd food-ordering-frontend
    npm install

Create .env.local:

    NEXT_PUBLIC_API_URL=http://localhost:3001/api

Start frontend:

    npm run dev

Frontend runs at:  
http://localhost:3000

---

## STEP 4: ACCESS APPLICATION

http://localhost:3000

---

## TEST USERS (SEEDED DATA)

| Name | Email | Password | Role | Country |
|------|------|----------|------|---------|
| Nick Fury | nick.fury@avengers.com | admin123 | ADMIN | AMERICA |
| Captain Marvel | captain.marvel@avengers.com | manager123 | MANAGER | INDIA |
| Captain America | captain.america@avengers.com | manager123 | MANAGER | AMERICA |
| Thanos | thanos@avengers.com | member123 | MEMBER | INDIA |
| Thor | thor@avengers.com | member123 | MEMBER | INDIA |
| Travis | travis@avengers.com | member123 | MEMBER | AMERICA |

---

## RBAC TESTING SCENARIOS

TEST 1: MEMBER CANNOT CHECKOUT  
Login as Thanos (India)  
Checkout blocked  
Result: Member cannot place order

TEST 2: MANAGER CAN CHECKOUT  
Login as Captain Marvel  
Payment update blocked  
Result: Manager can checkout but cannot update payment

TEST 3: ADMIN FULL ACCESS  
Login as Nick Fury  
Result: Full access

TEST 4: LOCATION FILTERING  
Managers/Members see own country  
Admin sees all  
Result: Backend enforced

---

## API DOCUMENTATION

API collection available in api-collection.json  
Import into Postman or Thunder Client

---

## SCREENSHOTS

Located in /screenshots folder  
- Login page  
- Admin orders  
- Manager checkout  
- Member blocked checkout  

---

## DEMO VIDEO

Coming soon.

---

## TROUBLESHOOTING

Backend issues:
- Check .env
- Node >= 18
- Run npx prisma generate

Frontend issues:
- Backend running on port 3001
- Correct API URL

Database reset:

    npx prisma migrate reset --force
    node prisma/seed.js

---

## TECHNOLOGIES USED

Backend: NestJS, PostgreSQL, Prisma, JWT, bcrypt  
Frontend: Next.js, TypeScript, Tailwind CSS  

---

## FEATURES IMPLEMENTED

- JWT Authentication
- Role-Based Access Control
- Country-based filtering
- Order & payment management
- Secure APIs

---

## PROJECT HIGHLIGHTS

- Clean architecture
- Fully typed
- Secure by design
- Cloud ready
- Well documented
