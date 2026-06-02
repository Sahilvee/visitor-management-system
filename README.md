# Visitor Management System

A full-stack Visitor Management System built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).

The system helps manage visitors, appointments, QR-based check-in/check-out, and role-based dashboards for Admin, Employees, and Frontdesk staff.

---
---
# IMPORTANT: SMS functionality using Twilio could not be fully implemented because Twilio's free trial only allows messages to be sent to verified phone numbers. Since end users' phone numbers cannot be verified in advance, real SMS delivery could not be demonstrated. However, the complete SMS integration code has been implemented and is available in `services/sendSms.js`.

# Demo Video

```text
https://drive.google.com/file/d/14jSV8N3zBZEAGvT9ix33Tr-yS02itQ32/view
```

---
# Features

## Public Features

* Visitor Registration
* OTP Verification
* Appointment Booking
* Appointment Tracking

---

## Admin Features

* Manage Visitors
* Manage Employees
* Manage Appointments
* Approve / Reject Appointments
* Dashboard Analytics

---

## Employee Features

* View Assigned Appointments
* Approve / Reject Requests


---

## Frontdesk Features

* QR Code Scanning
* Visitor Check-In / Check-Out
* Appointment Verification

---

# Tech Stack

## Frontend

* React.js
* Tailwind CSS
* Axios
* React Router DOM
* Framer Motion
* Recharts
* HTML5 QRCode

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Nodemailer
* Multer
* QRCode
* bcrypt

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/your-username/your-repository-name.git
```

---

## 2. Backend Setup

Move to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

EMAIL_USER=your_email@gmail.com

EMAIL_PASS=your_email_password
```

Run backend server:

```bash
npm run dev
```

---

## 3. Frontend Setup

Move to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Run frontend server:

```bash
npm run dev
```

---

# Database Seeding

If your project contains a seed script, run:

```bash
npm run seed
```

This will insert sample data into the database such as:

* Admin accounts
* Employees
* Sample visitors
* Appointments

Example admin credentials:

```text
Email: admin@gmail.com
Password: admin123
```

If seeding is not implemented yet, you can remove this section or add it later.

# Folder Structure

## Frontend

```bash
frontend/
│
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── routes/
│   ├── assets/
│   └── App.jsx
```

## Backend

```bash
backend/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── services/
├── utils/
├── config/
├── uploads/
└── server.js
```

---

# Main Workflows

## Visitor Registration

1. Visitor enters details
2. OTP sent to email
3. OTP verification completed
4. Visitor account created

## Appointment Booking

1. Visitor selects employee
2. Selects date and time slot
3. System checks slot availability
4. Appointment created successfully

## QR Check-In Process

1. Visitor receives QR code
2. Frontdesk scans QR
3. System verifies appointment
4. Visitor check-in/check-out completed

---

# Authentication & Security

* JWT Authentication
* Protected Routes
* Role-Based Access Control
* OTP Verification
* QR Verification


---

# API Structure

## Authentication APIs

| Method | Endpoint           | Description |
| ------ | ------------------ | ----------- |
| POST   | `/auth/otp`        | Send OTP    |
| PATCH  | `/auth/otp       ` | Verify OTP  |
| POST   | `/auth/login`      | Admin Login |

---

## Visitor APIs

| Method | Endpoint               | Description      |
| ------ | ---------------------- | ---------------- |
| POST   | `/visitors`            | Register Visitor |
| GET    | `/visitors`            | Get All Visitors |
| PATCH  | `/visitors/:id/verify` | Verify Visitor   |
| DELETE | `/visitors/:id`        | Delete Visitor   |

---

## Appointment APIs

| Method | Endpoint                        | Description             |
| ------ | ------------------------------- | ----------------------- |
| POST   | `/appointments`                 | Create Appointment      |
| GET    | `/appointments/:trackingId`     | Track Appointment       |
| GET    | `/appointments`                 | Get Appointments        |
| PATCH  | `/appointments/:id/approve`     | Approve Appointment     |
| PATCH  | `/appointments/:id/reject`      | Reject Appointment      |
| POST   | `/appointments/check-slot`      | Check Slot Availability |
| GET    | `/appointments/slots/:hostId`   | Get Slot Details        |
| POST   | `/appointments/CheckInCheckOut` | QR Check-In / Check-Out |

---


# Available Scripts

## Run Development Server

```bash
npm run dev
```

## Run Production Server

```bash
npm start
```



# Screenshots

## Home Page

![Home](image.png)

## Appointment Booking

![Booking](image-1.png)

## Admin Dashboard

![Dashboard](image-2.png)

## Tracking Dashboard

![Tracking](image-3.png)

## Visitor Registration

![Visitor](image-4.png)

## Frontdesk Dashboard

![Frontdesk](image-5.png)

---

# Learning Outcomes

Through this project, I learned:

* Full-stack MERN development
* MVC model architecture
* Rest API 
* JWT authentication
* QR code integration
* Error handling
* Reusable component structure
* Validation 
* Rate limiting

