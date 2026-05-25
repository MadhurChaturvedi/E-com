Project notes — commit walkthrough and repeatable tutorial

Purpose

- Read every commit and turn the history into a concise, repeatable tutorial you can review and run.

How to use this file

- Follow the chronological steps below to understand what changed in each commit and how to test that feature locally.

Environment (required)

- Node 18+ installed
- MongoDB connection (local or Atlas)
- Cloudinary account and credentials
- Gmail account (use an app password) for OTP email
- Create a `.env` with the variables below before running the server

Essential .env variables

- `PORT` (optional)
- `DB_URL` (MongoDB connection string)
- `JWT_SEC` (JWT secret)
- `GMAIL` (sender email)
- `PASS` (email password / app password)
- `Key_Name`, `API_Key`, `API_Secret` (Cloudinary creds)

Start server (from `server` folder)

```bash
npm install
# create .env from your values
npm run dev
```

Commit-by-commit tutorial (oldest → newest)

1. cb1641b — "e-com backend setup ready 👾"

- What: Project initial scaffolding: Express app, basic folder layout, initial `package.json` and server entry point.
- Look at: `index.js`, `package.json`.
- Test: `npm run dev` then open `GET /` to ensure server responds.

2. 1d72a06 — "22:19 setup the otp userController / useRouter/trycatch wrapper"

- What: Added OTP user controller skeleton and a `TryCatch` wrapper to centralize async error handling.
- Look at: `controller/User.js` (controller functions), `utils/TryCatch.js`.
- Test: make sure `TryCatch` is used where controllers are exported; errors should return 500 with message.

3. 6745beb — "opt service done"

- What: Implemented OTP sending service with Nodemailer.
- Look at: `utils/sendOTp.js`.
- Test: Set `GMAIL` and `PASS` in `.env`, call `POST /api/user/login` with `{ "email": "you@x.com" }` and verify that an email arrives.

4. 6ead8d6 — "email opt service and verify done"

- What: Completed OTP verification flow: store OTP in DB, verify endpoint issues JWT and creates user if missing.
- Look at: `model/Otp.js`, `model/User.js`, `controller/User.js` (loginUser, verifyUser).
- Test sequence:
  1. POST `/api/user/login` body `{ "email": "you@x.com" }` → OTP stored in `otp` collection and sent by email.
  2. POST `/api/user/verify` body `{ "email": "you@x.com", "otp": 123456 }` → returns `{ token, user }`.
  3. Use returned token for authenticated requests (send header `token: <JWT>`).

5. be372ba — "add userAuth middleware & integrate cloudinary"

- What: Added `isAuth` middleware to verify JWT, and Cloudinary config usage in `index.js`.
- Look at: `middlewares/isAuth.js`, `index.js` cloudinary setup.
- Test: Call a protected endpoint (e.g., `GET /api/user/me`) with and without `token` header. Without header should return 403.

6. d839a18 — "add the product Schema"

- What: Product Mongoose schema added (`title`, `description`, `price`, `stock`, `images`, `category`, `sold`, timestamps).
- Look at: `model/Product.js`.
- Test: After creating a product, confirm product fields are saved in `products` collection.

7. b6422e0 — "add bufferGenerator & multer"

- What: File upload helper (`bufferGenerator`) and Multer memory storage middleware to accept uploads.
- Look at: `utils/bufferGenerator.js`, `middlewares/multer.js`.
- Test: Ensure `multer` is used on product endpoints that accept files. Files should be accessible as `req.files` in controller.

8. 565b0ea — "add createproduct and test on postman"

- What: Product creation endpoint implemented, uploads images to Cloudinary using `bufferGenerator`.
- Look at: `routes/Product.js` and `controller/Product.js` (createProduct).
- Test: Example `curl` (replace env and product fields):

```bash
curl -X POST "http://localhost:5000/api/product/new" \
  -H "token: <ADMIN_JWT>" \
  -F "title=Example" \
  -F "description=Desc" \
  -F "category=books" \
  -F "price=19.99" \
  -F "stock=10" \
  -F "files=@/path/to/img1.jpg" \
  -F "files=@/path/to/img2.jpg"
```

- Notes: Only users with `role === 'admin'` can create products. The controller uploads files to Cloudinary and stores `id` and `url`.

9. 7778a1a — "add getAllProduct,fillter,search,pageniation"

- What: `GET /api/product/all` added with support for `search`, `category`, `page`, and `sortByPrice`.
- Look at: `controller/Product.js` in `getAllProducts`.
- Test: Try queries:
  - `/api/product/all?page=1`
  - `/api/product/all?search=book`
  - `/api/product/all?category=books&sortByPrice=lowToHigh`
- Note: response includes `products`, `categorys`, `totalPages`, `newProduct`. You may want to add a `currentPage` and `totalCount` later.

10. 7fe4847 — "add getSignleProduct"

- What: `GET /api/product/:id` returns the product and up to 4 related products from the same category.
- Look at: `controller/Product.js` `getSingleProduct`.
- Test: `GET /api/product/<productId>` and confirm `product` and `relatedProduct` fields.

11. 32a20a5 — "add productUpdate_fields"

- What: `PUT /api/product/:id` updates product fields (title, description, category, price, stock), only admin.
- Look at: `controller/Product.js` `updateProduct`.
- Test: `PUT /api/product/<productId>` with header `token: <ADMIN_JWT>` and JSON body with fields to update.

12. 555fc5c — "add updateImage service"

- What: `POST /api/product/:id` (with files) replaces product images: deletes old Cloudinary images and uploads new ones.
- Look at: `controller/Product.js` `updateProductImages`.
- Test: Upload new files to replace images; verify Cloudinary old `public_id`s are destroyed and product `images` updated.

13. 484979e — "add Cart Model"

- What: Added `Cart` schema with `quantity`, `product` (ref), and `user` (ref).
- Look at: `model/Cart.js`.
- Test: Create cart documents in DB by adding via API.

14. 17c4b08 — "add Cart api"

- What: Added cart routes and controller to add items and remove items from cart.
- Look at: `routes/Cart.js` and `controller/Cart.js` (addToCart, removeFromCart).
- Test flow:
  1. `POST /api/cart/add` with header `token: <JWT>` body `{ "product": "<productId>" }`.
  2. `GET /api/cart/remove/<productId>` with header `token: <JWT>` to remove.
- Notes: `addToCart` increments quantity if item exists and checks stock. `removeFromCart` currently uses `$pull` semantics; the cart is modelled such that items are stored as individual cart docs per product (so remove logic expects a different schema in comments). Verify behaviour in your DB after running tests.

15. b10f459 — "add removeCart"

- What: Improvements to remove operation or bugfixes (commit message indicates extra removeCart work).
- Look at: `controller/Cart.js` for any edits to remove logic.
- Test: Ensure `GET /api/cart/remove/:id` removes the expected item and returns updated cart data.

16. 4eeb30e — "add readme.md"

- What: Project README added (you can find it in `readme.md`).
- Look at: `server/readme.md` (top-level server README).

Current notes about the codebase and testing

- Authentication: JWT is expected in the header named `token`. Some libraries or clients use `Authorization: Bearer <token>` — update middleware if you prefer that standard.
- Product image uploads use `files` as the form field name and `multer.memoryStorage()` so the app does not write files to disk.
- OTPs expire via TTL index in `OTP` model. After successful verification the OTP doc is deleted.
- Cart model uses one DB document per cart item. Depending on your frontend, you may want a single `Cart` per user with `items: [{ product, qty }]` array.

Repeatable test checklist

1. Start server: `npm run dev`
2. Request OTP: `POST /api/user/login` JSON `{ "email": "you@x.com" }` — check email
3. Verify OTP: `POST /api/user/verify` JSON `{ "email": "you@x.com", "otp": <code> }` — save `token`
4. Create product (admin only): use `token` from an admin account, `POST /api/product/new` with `multipart/form-data` and `files`
5. List/search products: `GET /api/product/all` with query params
6. View single product: `GET /api/product/<id>`
7. Add to cart: `POST /api/cart/add` header `token: <JWT>` body `{ "product": "<id>" }`
8. Remove from cart: `GET /api/cart/remove/<id>` header `token: <JWT>`

Recommended improvements (next tasks)

- Standardize JWT header to `Authorization: Bearer <token>` (update `isAuth` accordingly).
- Make `Cart` a single document per user with an `items` array (simplifies listing and checkout logic).
- Add request body validation (Joi/celebrate or express-validator).
- Add tests and an OpenAPI spec or Postman collection.

If you want, I can:

- generate a `.env.example` for you,
- create a Postman collection or OpenAPI spec from routes,
- change auth middleware to use `Authorization` header,
- refactor cart schema to a single-cart-per-user model and migrate existing entries.

---

File: `server/notes.md` — created by the assistant. Review and tell me which follow-up you want next (Postman/OpenAPI, `.env.example`, or refactor).
