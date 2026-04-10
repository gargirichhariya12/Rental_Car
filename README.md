# Rental Car App

Full-stack car rental platform with:

- a public customer app for browsing cars and creating bookings
- an owner dashboard for listing and managing cars
- an admin area for platform stats
- Google auth, JWT-based sessions, Stripe checkout, and ImageKit uploads

## Stack

- Client: React, Vite, React Router, Axios, Tailwind CSS, Framer Motion
- Server: Node.js, Express 5, MongoDB, Mongoose
- Auth: JWT, Google OAuth, cookies
- Payments: Stripe
- Media: ImageKit

## Main Features

- Browse available cars with location, category, fuel type, price, and sorting filters
- View detailed car pages and create bookings
- See personal bookings and pay for unpaid bookings through Stripe
- Upgrade a user to owner and manage owner listings/bookings
- Admin dashboard for platform stats
- Review endpoints for car reviews
- Automatic logout when the access token expires

## Project Structure

```text
Rental_Car/
├── client/                  # React + Vite frontend
├── server/                  # Express backend
├── docker-compose.yml       # App + MongoDB containers
└── README.md                # Project documentation
```

## Frontend Routes

- `/` home page
- `/cars` browse cars
- `/CarDetails/:id` car details and booking form
- `/my-bookings` logged-in user bookings
- `/owner` owner dashboard
- `/owner/add-car` add a listing
- `/owner/manage-cars` manage owner cars
- `/owner/manage-bookings` manage owner bookings
- `/admin` admin dashboard
- `/auth-success` Google auth callback landing page

## Backend Route Groups

### User

- `GET /api/user/cars`
- `GET /api/user/cars/:id`
- `POST /api/user/register`
- `POST /api/user/login`
- `GET /api/user/data`

### Owner

- `POST /api/owner/change-role`
- `POST /api/owner/add-car`
- `GET /api/owner/cars`
- `POST /api/owner/toggle-car`
- `POST /api/owner/delete-car`
- `POST /api/owner/dashboard`
- `POST /api/owner/update-image`

### Bookings

- `POST /api/bookings/check-availability`
- `POST /api/bookings/create`
- `GET /api/bookings/user`
- `POST /api/bookings/checkout/:bookingId`
- `GET /api/bookings/owner`
- `POST /api/bookings/change-status`

### Reviews

- `GET /api/reviews`
- `POST /api/reviews`
- `DELETE /api/reviews/:id`

### Admin

- `GET /api/admin/stats`
- `GET /api/admin/users`
- `PATCH /api/admin/update-role`

### Auth / Webhooks

- `GET /auth/google`
- `GET /auth/google/callback`
- `GET /auth/logout`
- `GET /auth/refresh`
- `POST /auth/refresh`
- `POST /api/webhooks/stripe`

## Environment Variables

### Client

Create `client/.env`:

```env
VITE_BASE_URL=http://localhost:3000
VITE_CURRENCY=$
```

### Server

Create `server/.env`:

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

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

Notes:

- The server connects to `${MONGODB_URI}/car-rental`, so `MONGODB_URI` should be the base Mongo connection string.
- Google OAuth, Stripe checkout, and ImageKit uploads require valid third-party credentials.

## Local Setup

### 1. Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

### 2. Start the backend

```bash
cd server
npm run server
```

Backend runs on `http://localhost:3000`.

### 3. Start the frontend

```bash
cd client
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Docker

The repo includes a `docker-compose.yml` for:

- `server`
- `client`
- `mongodb`

Run with:

```bash
docker compose up --build
```

## Authentication and Session Behavior

- Login returns an access token and sets auth cookies.
- Protected client routes use the current user token.
- When the token expires, the app logs the user out and redirects to the home page.
- Google login redirects through `/auth/google/callback` and lands on `/auth-success`.

## Booking Flow

1. User browses or filters cars.
2. User opens a car detail page.
3. User submits pickup and return dates.
4. Backend validates date range and availability.
5. Booking is created with `pending` status.
6. User can open Stripe checkout for payment.
7. Stripe webhook marks the booking as `paid` and `confirmed`.

## Owner Flow

1. Logged-in user clicks owner upgrade.
2. Role changes to `owner`.
3. Owner can add cars, toggle availability, and view dashboard stats.
4. Owner can manage incoming bookings.

## Quality Checks

Frontend checks:

```bash
cd client
npm run lint
npm run build
```

Backend basic syntax check:

```bash
node --check server/server.js
```

## Current Notes

- `POST /api/owner/update-image` is still a placeholder response and needs full implementation.
- Admin child pages for user management and car management are currently placeholders in the frontend.
- Uploaded local files are stored in `server/uploads/` before ImageKit upload.
