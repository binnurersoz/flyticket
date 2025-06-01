# FlyTicket

A full-stack flight ticket booking and management system with an admin panel.

## Technologies Used

- **Frontend:** React, TypeScript, Vite, TailwindCSS, Shadcn UI, Radix UI, Lucide Icons
- **Backend:** Node.js, Express.js, MySQL
- **Other:** JWT (Authentication), bcrypt (Password hashing)

## Project Structure

- `frontend/` — React-based user and admin interface
- `backend/` — Express.js REST API and database logic

---

## How to Run the Project

### 1. Clone the Repository
```bash
git clone <repo-url>
cd <repo-folder>
```

### 2. Database Setup
- Create a MySQL database (e.g. `flyticket_db`).
- Import or run the SQL scripts to create the tables:
  - `City` and `Flight` tables (see below for example schemas)
- (Optional) Seed cities using `backend/seed/citiesSeed.js`.

#### Example Table Schemas
```sql
CREATE TABLE City (
  city_id INT AUTO_INCREMENT PRIMARY KEY,
  city_name VARCHAR(255) NOT NULL
);

CREATE TABLE Flight (
  flight_id VARCHAR(36) PRIMARY KEY,
  from_city VARCHAR(36),
  to_city VARCHAR(36),
  departure_time DATETIME,
  arrival_time DATETIME,
  price DECIMAL(10,2),
  seats_total INT,
  seats_available INT,
  FOREIGN KEY (from_city) REFERENCES City(city_id),
  FOREIGN KEY (to_city) REFERENCES City(city_id),
  UNIQUE (from_city, departure_time),
  UNIQUE (to_city, arrival_time)
);
```

### 3. Backend Setup
```bash
cd backend
npm install
node server.js
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Admin Login Credentials

- **Username:** `admin`
- **Password:** `admin`

> (You can change these in the database or seed script.)

---

## Features
- Search and book flights as a user
- Admin panel for managing flights
- Add, edit, delete flights
- View bookings
- JWT-based authentication for admin

---


