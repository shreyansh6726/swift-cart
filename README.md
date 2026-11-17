# Swift Cart Client

The Swift Cart client is a React application built with Vite. It serves the
customer, retailer, and admin experiences from one frontend based on the
current URL path.

## Prerequisites

- Node.js 18 or newer
- npm
- The Swift Cart server running locally or at a reachable API URL

## Environment variables

Create a `.env` file in this directory:

```env
API_BASE_URL=http://localhost:5000
```

The variable must use the `API_` prefix because Vite is configured to expose
only variables with that prefix to the browser. Do not put secrets in this
file; frontend environment variables are included in the browser bundle.

## Install

From the `client` directory:

```bash
npm ci
```

Use `npm install` instead if you need to update the lockfile.

## Build

Create an optimized production bundle:

```bash
npm run build
```

The generated files are written to `dist/`. The build uses the `.env` values
available when the command runs, so set `API_BASE_URL` before building.

## Run

### Development

Start the Vite development server:

```bash
npm run dev
```

By default, the client is available at `http://localhost:5173`.

To make it available to other devices on the local network:

```bash
npm run dev -- --host
```

### Preview the production build

After running `npm run build`, serve the bundle locally with:

```bash
npm run preview
```

## Application routes

The application selects its experience from the browser path:

- `/` - customer application
- `/retailer` - retailer application
- `/admin` - admin application

The selected path is also sent to the server in the `X-Frontend-Path` header
so the server can use the corresponding MongoDB database.

## Running with the server

Start the server separately from the `server` directory:

```bash
cd ..\server
npm run dev
```

Then start the client from this directory in another terminal:

```bash
npm run dev
```

If the server is not running on port `5000`, update `API_BASE_URL` in `.env`
before starting or building the client.

## Deployment notes

When deploying the production bundle, configure the web server to serve
`index.html` for the application routes (`/`, `/retailer`, and `/admin`) so
direct navigation and browser refreshes continue to work.
