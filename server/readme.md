# E‑Commerce Backend (Express + MongoDB)

This repository is the backend for a minimal e‑commerce application. It provides OTP-based login, JWT authentication, product management with image uploads (Cloudinary), and a simple cart system.

**Quick overview**
- Authentication: OTP (email) -> verify -> JWT token
- Products: create, read, update, image upload
- Cart: add/remove items per user
- Image storage: Cloudinary
- Email: Nodemailer (Gmail SMTP)

**Tech stack & key dependencies**
- Node.js + Express
- MongoDB via Mongoose
- Cloudinary for image hosting
- Multer (memory storage) for file uploads
- Nodemailer for OTP emails
- JWT for authentication

See `package.json` for full dependency list.

Getting started
- Prerequisites: Node 18+, MongoDB (Atlas or local), Cloudinary account, Gmail account (app password recommended).
- From the `server` folder:

```bash
npm install
cp .env.example .env   # create .env with values listed below
npm run dev            # start with nodemon
```

Environment variables
- `PORT` (optional, default 5000)
- `DB_URL` (MongoDB connection string)
- `JWT_SEC` (secret for signing JWTs)
- `GMAIL` (email used to send OTPs)
- `PASS` (email password or app password)
- `Key_Name`, `API_Key`, `API_Secret` (Cloudinary credentials)

Server entry
- Main file: [server/index.js](server/index.js)

API summary (base path: `/api`)

- User
	- `POST /api/user/login` — body: `{ "email": "you@example.com" }` → sends OTP to email
	- `POST /api/user/verify` — body: `{ "email": "you@example.com", "otp": 123456 }` → returns `{ message, token, user }`
	- `GET /api/user/me` — header: `token: <JWT>` → returns authenticated user profile

- Product
	- `POST /api/product/new` — auth required (admin). `multipart/form-data` with `files` (array) and body fields `title, description, category, price, stock` → creates product and uploads images to Cloudinary. Uses [server/routes/Product.js](server/routes/Product.js) and [server/controller/Product.js](server/controller/Product.js).
	- `GET /api/product/all` — query params: `search`, `category`, `page`, `sortByPrice` → paginated list
	- `GET /api/product/:id` — product details + related products
	- `PUT /api/product/:id` — auth (admin) → update product fields
	- `POST /api/product/:id` — auth (admin), `files` → replace product images

- Cart
	- `POST /api/cart/add` — auth required. body `{ product: <productId> }` → increments quantity or creates cart item
	- `GET /api/cart/remove/:id` — auth required. removes an item from the user's cart

Authentication details
- The app uses JWT tokens signed with `JWT_SEC`. The auth middleware expects the token in the request headers as `token` (see [server/middlewares/isAuth.js](server/middlewares/isAuth.js)).

Data models (high level)
- `User` — email, role (default: User) — [server/model/User.js](server/model/User.js)
- `OTP` — email, otp, expiresAt (TTL index) — [server/model/Otp.js](server/model/Otp.js)
- `Product` — title, description, price, stock, category, images, sold — [server/model/Product.js](server/model/Product.js)
- `Cart` — quantity, product (ref), user (ref) — [server/model/Cart.js](server/model/Cart.js)

File uploads & images
- Multer is configured with memory storage and expects files under the field name `files` (see [server/middlewares/multer.js](server/middlewares/multer.js)). Uploaded buffers are converted to DataURI and sent to Cloudinary.

OTP / Email
- OTPs are generated server‑side and sent via Nodemailer using Gmail SMTP. The send function is in [server/utils/sendOTp.js](server/utils/sendOTp.js). OTPs are stored in the `OTP` collection and removed on successful verification.

Database
- Connection helper: [server/utils/db.js](server/utils/db.js). Provide `DB_URL` in `.env`.

Error handling
- Controllers are wrapped with a `TryCatch` helper that sends a 500 response with the error message on exceptions ([server/utils/TryCatch.js](server/utils/TryCatch.js)).

Security & deployment notes
- Keep all secrets in environment variables (do not commit `.env`).
- Use a Gmail app password (or dedicated SMTP) instead of your primary Gmail password.
- Restrict CORS origin in production as needed (currently `cors()` is enabled globally in [server/index.js](server/index.js)).
- Consider rate limiting and stronger OTP validation for production use.

Useful links
- Server entry: [server/index.js](server/index.js)
- Routes: [server/routes](server/routes)
- Controllers: [server/controller](server/controller)

Next steps / TODOs
- Add pagination metadata to `/product/all` responses.
- Add unit/integration tests and a Postman collection or OpenAPI spec.
- Harden auth (refresh tokens, more granular roles) and add request validation.

If you want, I can:
- add a `.env.example` file with the required vars,
- generate a Postman collection or OpenAPI spec for these endpoints,
- or update the `/product/all` response to include the current page and total counts.

