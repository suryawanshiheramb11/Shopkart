# ShopKart

ShopKart is a full-stack shopping application with a React/Vite client and an
Express/MongoDB API.

## Requirements

- Node.js and npm
- MongoDB connection string
- Cloudinary credentials for product image uploads
- Razorpay test credentials for checkout/payment features

## Run locally

1. Configure the backend environment:

   ```sh
   cd server
   cp .env.example .env
   ```

   Set `dbUrl`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`,
   `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `RAZORPAY_KEY_ID`, and
   `RAZORPAY_KEY_SECRET` in `server/.env`. The server listens on port `8088`
   by default; `PORT` can override it.

2. Install backend dependencies and start the API:

   ```sh
   cd server
   npm install
   npm run dev
   ```

3. In a separate terminal, install and start the frontend:

   ```sh
   cd client
   npm install
   npm run dev
   ```

   The Vite client runs on `http://localhost:5173` and calls the API at
   `http://localhost:8088`.

Never commit `.env` files or real credentials. Keep local secrets in
`server/.env`.
