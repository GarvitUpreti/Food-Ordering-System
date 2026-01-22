# Food-Delivery-System

**FOOD ORDERING PLATFORM – FULL STACK RBAC APPLICATION**

A complete web-based food ordering application demonstrating Role-Based Access Control (RBAC) and Location-Based Access Filtering.

**Assignment for:** Slooze  
**Tech Stack:** NestJS (Backend) + Next.js (Frontend) + PostgreSQL + Prisma

---

## ASSIGNMENT REQUIREMENTS COMPLETED

1. Full-stack web application (Backend + Frontend)
2. View restaurants and menu items
3. Create orders and add food items
4. Checkout cart and pay using payment method
5. Cancel orders
6. Modify payment methods
7. **Role-Based Access Control (RBAC)**
8. **BONUS:** Country-based access filtering (India / America)

---

## USER ROLES & ACCESS MATRIX

**View restaurants & menu items**
- Admin: Yes
- Manager: Yes (own country only)
- Member: Yes (own country only)

**Create order (add items)**
- Admin: Yes
- Manager: Yes
- Member: Yes

**Place order (checkout & pay)**
- Admin: Yes
- Manager: Yes
- Member: No

**Cancel order**
- Admin: Yes
- Manager: Yes
- Member: No

**Update payment method**
- Admin: Yes
- Manager: No
- Member: No

---

## COUNTRY-BASED ACCESS (BONUS)

- **Admin** has global access (India + America)
- **Managers and Members** can only access data related to their own country
- Cross-country access is strictly blocked at backend level

---

## PROJECT STRUCTURE
Food-Delivery-System/
│
├── README.md (this file)
│
├── food-ordering-backend/
│ ├── README.md
│ ├── src/
│ ├── prisma/
│ └── package.json
│
├── food-ordering-frontend/
│ ├── README.md
│ ├── src/
│ └── package.json
│
├── api-collection.json (Postman / Thunder Client collection)
└── screenshots/ (application screenshots)

text

---

## HOW TO RUN THE PROJECT LOCALLY

### PREREQUISITES

- Node.js v18 or higher
- npm
- Git
- Internet connection (cloud database)

---

### STEP 1: CLONE THE REPOSITORY

```bash
git clone https://github.com/GarvitUpreti/Food-Delivery-System.git
cd Food-Delivery-System
STEP 2: BACKEND SETUP
1. Navigate to backend folder:

bash
cd food-ordering-backend
2. Install dependencies:

bash
npm install
3. Create a .env file in backend root with the following keys:

env
DATABASE_URL=postgresql://<username>:<password>@<host>:5432/<database>?sslmode=require
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=64-character-secret-key
PORT=3001
4. Run database setup and start backend:

bash
npx prisma generate
npx prisma migrate dev
node prisma/seed.js
npm run start:dev
5. Backend will run at:

text
http://localhost:3001/api
STEP 3: FRONTEND SETUP
1. Open a new terminal

2. Navigate to frontend folder:

bash
cd food-ordering-frontend
3. Install dependencies:

bash
npm install
4. Create a .env.local file:

env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
5. Start frontend:

bash
npm run dev
6. Frontend will run at:

text
http://localhost:3000
STEP 4: ACCESS APPLICATION
Open browser and visit:

text
http://localhost:3000
TEST USERS (SEEDED DATA)
Name	Email	Password	Role	Country
Nick Fury	nick.fury@avengers.com	admin123	ADMIN	AMERICA
Captain Marvel	captain.marvel@avengers.com	manager123	MANAGER	INDIA
Captain America	captain.america@avengers.com	manager123	MANAGER	AMERICA
Thanos	thanos@avengers.com	member123	MEMBER	INDIA
Thor	thor@avengers.com	member123	MEMBER	INDIA
Travis	travis@avengers.com	member123	MEMBER	AMERICA
RBAC TESTING SCENARIOS
TEST 1: MEMBER CANNOT CHECKOUT
Login as Thanos (Member – India)
Browse restaurants (only India visible)
Add items to cart
Checkout is blocked
Result: Member cannot place order

TEST 2: MANAGER CAN CHECKOUT
Login as Captain Marvel (Manager – India)
Add items and checkout
Payment update is blocked
Result: Manager can checkout but cannot update payment

TEST 3: ADMIN FULL ACCESS
Login as Nick Fury (Admin)
View all restaurants (India + America)
View all orders
Update payment method
Result: Admin has unrestricted access

TEST 4: LOCATION FILTERING
Manager/Member sees only their country's data
Admin sees all data
Result: Country-based access enforced

API DOCUMENTATION
API collection provided in: api-collection.json

Can be imported into Postman or Thunder Client

SCREENSHOTS
Application screenshots are available in the /screenshots folder:

Login page
Admin viewing all orders
Manager checkout flow
Member checkout blocked
DEMO VIDEO
Demo video link will be added soon.

The demo shows:

Login with different roles
RBAC restrictions
Location-based filtering
Complete order lifecycle
Admin-only actions
TROUBLESHOOTING
Backend not starting
Check .env file exists
Ensure Node.js version >= 18
Run: npx prisma generate
Frontend not connecting
Ensure backend is running on port 3001
Check NEXT_PUBLIC_API_URL in .env.local
Database issues
Run: npx prisma migrate reset --force
Run: node prisma/seed.js
