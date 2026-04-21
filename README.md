🚗 Rental Car Platform (MERN Stack)

A full-stack rental car web application built using the MERN stack, featuring secure authentication, dynamic car listings, real-time booking, and a premium user experience.

📌 Architecture Overview

This project follows a Decoupled Client–Server Architecture

🔹 Frontend (Client)
Built with React + Vite (SPA architecture)
State Management- React Context API
Styling- Tailwind CSS
Animations- Framer Motion (smooth transitions & interactions)
🔹 Backend (Server)
Node.js + Express REST API
Design Pattern- Controller → Service → Model
Database- MongoDB with Mongoose
🔹 Security Layer
Helmet (secure headers)
express-mongo-sanitize (NoSQL injection protection)
Custom XSS sanitization middleware
JWT-based authentication
Google OAuth 2.0 via Passport.js
🚀 Key Features
🔐 Authentication System
Email/Password login & registration
Google OAuth 2.0 integration
Auto account linking (same email)
JWT-based session handling
🚘 Car Management (Owner Mode)
Role-Based Access Control (RBAC)
Users can switch to Owner Mode
Add, edit, and manage car listings
🔍 Search & Filtering
Location-based search (regex-powered)
Price filtering
Real-time UI updates
📅 Booking System
End-to-end booking lifecycle
View booking history
Status tracking (pending → confirmed)
💳 Payment Integration
Stripe-powered checkout
Webhook-based payment confirmation
Automatic booking finalization
🧠 Technical Highlights (USPs)
Feature	Description
RBAC	Owner/User role switching system
Image Optimization	ImageKit integration (resize + WebP conversion)
Security Hardening	Express 5-compatible custom sanitization
Premium UX	Page transitions using Framer Motion
Global Error Handling	Centralized error system
⚙️ Core System Workflows
🔑 Authentication Flow
Managed via authController.js and passport.js
Google login auto-verifies users
Uses JWT for API + session for OAuth handshake
💳 Booking & Payment Lifecycle
User Action- Selects dates & clicks Book Now
Server- Creates pending booking
Stripe Checkout- Redirects user
Webhook- Confirms payment
Finalization- Booking confirmed + email sent
🧩 Service Layer (Clean Architecture)
Service	Responsibility
CarService	Image upload, processing, DB logic
PaymentService	Stripe integration, currency handling
EmailService	Notification abstraction
🛡️ Security Innovation

A custom sanitizer was implemented to handle Express 5’s read-only req.query issue, ensuring compatibility with modern middleware while preventing XSS attacks.

✨ Frontend Experience
Global Modal Control- Context API (no prop drilling)
Page Animations- AnimatePresence for smooth transitions
Skeleton Loading- Prevents layout shift (CLS)
📂 Project Structure
client/
  ├── src/
  │   ├── Context/
  │   ├── Pages/
  │   ├── Components/

server/
  ├── controllers/
  ├── services/
  ├── models/
  ├── routes/
  ├── middleware/
🛠️ Tech Stack
Frontend- React, Vite, Tailwind CSS, Framer Motion
Backend- Node.js, Express
Database- MongoDB (Mongoose)
Auth- JWT + Google OAuth
Payments- Stripe
Image Processing- ImageKit