# Swift Cart Server

The Swift Cart server is a Node.js and Express API backed by MongoDB through
Mongoose. It provides authentication endpoints for customer, retailer, and
admin clients.

## Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB deployment, such as MongoDB Atlas

## Environment variables

Create a `.env` file in this directory. Do not commit it; it contains
credentials and is ignored by Git.

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-host>/
JWT_SECRET=replace-with-a-long-random-secret
```

`MONGO_URI` is used as the base connection string. The server creates three
databases from it:

- `user` for customer accounts
- `retailer` for retailer accounts
- `swift_cart_admin` for admin accounts

Make sure the MongoDB user has permission to access all three databases.

## Install

From the `server` directory:

```bash
npm ci
```

Use `npm install` instead if you need to update the lockfile.

## Build

This server is plain CommonJS JavaScript and does not require a compilation or
bundling step. Installing dependencies is the only setup step before running
it.

## Run

### Development

Start the server with automatic restarts when source files change:

```bash
npm run dev
```

### Production

Start the server directly with Node.js:

```bash
npm start
```

The server listens on `http://localhost:5000` by default, or on the port
specified by `PORT`.

## API endpoints

Authentication routes are available under `/api/auth`:

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Log in and receive a JWT |
| `GET` | `/api/auth/profile` | Get the authenticated user's profile |
| `GET` | `/api/cart` | Get the authenticated user's cart item IDs |
| `PUT` | `/api/cart` | Replace the authenticated user's cart item IDs |
| `POST` | `/api/wishlist` | Add an item to the authenticated user's wishlist |

Profile and cart routes require an `Authorization: Bearer <token>` header. A
cart stores one `user_id`, an `item_ids` array, and a parallel `quantities`
array where each quantity uses the same index as its item ID. The server
chooses the MongoDB database from the `x-frontend-path` header, or from
the request `Referer` when that header is absent:

- `/admin` uses the admin database
- `/retailer` uses the retailer database
- Any other path uses the customer database

## Troubleshooting

- If startup fails with `MONGO_URI is not configured`, verify that `.env` is
  in the `server` directory and that `MONGO_URI` is set.
- If MongoDB connection times out, check the connection string and allow the
  current IP address in the MongoDB deployment's network access settings.
- If the port is already in use, set `PORT` to another available port.
