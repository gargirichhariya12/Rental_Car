# Rental Car Platform

A full-stack car rental web application built with the MERN stack. The app lets users browse cars, check availability, make bookings, pay through Stripe, and manage their reservations. It also includes an owner dashboard for adding cars, managing listings, updating availability, and handling booking requests.

## Live Links

- Frontend: [https://rental-car-red-phi.vercel.app](https://rental-car-red-phi.vercel.app)
- Backend: [https://rentalca.up.railway.app](https://rentalca.up.railway.app)

## Features

- User registration and login with JWT authentication
- Google OAuth 2.0 login support
- Protected user and owner routes
- Role switching from user to owner
- Browse, search, and filter available cars
- View detailed car pages with availability information
- Create and track bookings
- Stripe checkout integration for booking payments
- Stripe webhook support for payment confirmation
- Owner dashboard with booking and listing management
- Add, delete, and update car availability
- Image upload and optimization through ImageKit
- Reviews API support
- Centralized error handling and async controller utilities
- Security middleware including Helmet, CORS, rate limiting, and request sanitization
- Responsive React UI with Tailwind CSS and Framer Motion page transitions

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Axios
- React Hot Toast
- Lucide React

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT
- Passport Google OAuth
- Stripe
- ImageKit
- Multer
- Helmet
- Express Rate Limit
- Express Mongo Sanitize
- Zod

## Project Structure

```text
cars/
  client/
    src/
      components/        Reusable UI components
      Context/           Global React context
      pages/             Public, user, and owner pages
      assets/            Images and static assets
    package.json
    vite.config.js

  server/
    configs/             Database, Passport, and ImageKit configuration
    controllers/         Request handlers
    middleware/          Auth, upload, and error middleware
    models/              Mongoose models
    routes/              API route definitions
    services/            Business logic and integrations
    utils/               Shared helpers
    package.json
    server.js

  docker-compose.yml
  vercel.json
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB, or a MongoDB Atlas connection string
- Stripe account for payment testing
- ImageKit account for image uploads
- Google Cloud OAuth credentials, if using Google login

## Environment Variables

Create environment files from the provided examples:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

### Client Environment

```env
VITE_BASE_URL=http://localhost:3000
VITE_CURRENCY=$
```

### Server Environment

```env
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000

MONGODB_URI=mongodb://127.0.0.1:27017

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
SESSION_SECRET=your_session_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint

STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

SENDGRID_API_KEY=SG.your_sendgrid_api_key
EMAIL_FROM=no-reply@yourdomain.com
EMAIL_REPLY_TO=support@yourdomain.com
```

Use strong secrets for `JWT_SECRET`, `JWT_REFRESH_SECRET`, and `SESSION_SECRET` before deploying.

## Installation

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

## Running Locally

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

The app will run at:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

You can also run the mock backend:

```bash
cd server
npm run dev:mock
```

## Available Scripts

### Client

```bash
npm run dev       # Start Vite development server
npm run build     # Build frontend for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

### Server

```bash
npm run dev       # Start backend with nodemon
npm run server    # Start backend with nodemon
npm start         # Start backend with Node
npm run dev:mock  # Start mock backend
```

## API Overview

### User Routes

Base path: `/api/user`

- `GET /cars` - Get all cars
- `GET /cars/:id` - Get car details
- `POST /recommendations` - Get car recommendations
- `POST /register` - Register a user
- `POST /login` - Login a user
- `GET /data` - Get authenticated user data

### Auth Routes

Base path: `/auth`

- `GET /google` - Start Google OAuth login
- `GET /google/callback` - Google OAuth callback
- `GET /logout` - Logout user
- `GET /refresh` - Refresh access token
- `POST /refresh` - Refresh access token

### Booking Routes

Base path: `/api/bookings`

- `GET /check-availability` - Check car availability
- `POST /check-availability` - Check car availability
- `GET /availability/:carId` - Get availability for a car
- `POST /create` - Create a booking
- `GET /user` - Get logged-in user's bookings
- `POST /checkout/:bookingId` - Create Stripe checkout session
- `GET /owner` - Get owner bookings
- `POST /change-status` - Change booking status

### Owner Routes

Base path: `/api/owner`

- `POST /change-role` - Switch user role to owner
- `POST /add-car` - Add a car listing
- `GET /cars` - Get owner cars
- `DELETE /cars/:carId` - Delete a car
- `PATCH /cars/:carId/availability` - Toggle car availability
- `POST /toggle-car` - Toggle car availability
- `POST /delete-car` - Delete a car
- `GET /dashboard` - Get owner dashboard data
- `POST /dashboard` - Get owner dashboard data
- `PATCH /update-image` - Update owner profile image
- `POST /update-image` - Update owner profile image

### Other Routes

- `/api/reviews` - Review related endpoints
- `/api/webhooks` - Stripe webhook endpoint

## Running With Docker

The project includes a `docker-compose.yml` file for running the client, server, and MongoDB together.

```bash
docker compose up --build
```

Docker services:

- Client: `http://localhost`
- Server: `http://localhost:3000`
- MongoDB: `localhost:27017`

## Deployment

The project includes Vercel configuration for deployment. Before deploying, update production environment variables in your hosting provider:

- Frontend `VITE_BASE_URL`
- Server `CLIENT_URL`
- Server `BACKEND_URL`
- MongoDB connection string
- JWT and session secrets
- Stripe keys and webhook secret
- ImageKit keys
- Google OAuth credentials

For Stripe webhooks, configure your Stripe dashboard to send events to:

```text
https://your-backend-domain.com/api/webhooks
```

## Security Notes

- API routes are rate limited.
- Helmet is used for secure HTTP headers.
- MongoDB query data is sanitized before reaching route handlers.
- Authenticated routes use JWT-based protection.
- Owner-only routes are restricted with role-based access control.
- Stripe webhook handling is mounted before JSON body parsing so Stripe signatures can be verified correctly.

## License

This project is currently marked as ISC in the server package metadata.
