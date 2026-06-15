# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

CoderHouse Backend 1 final project: an Express + MongoDB (Mongoose) e-commerce API for products and carts, with server-side rendered Handlebars views. ES modules throughout (`"type": "module"`).

## Commands

- `npm run dev` — run with nodemon (auto-reload) on `src/app.js`
- `npm start` — run once with node

There is no build step, linter, or test suite configured.

## Environment

A `.env` file (loaded via `dotenv`) is required — the server will not connect to the DB without it. Expected variables:

- `PORT` — HTTP port (views/links hardcode `http://localhost:8080`, so 8080 is expected)
- `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_NAME` — assembled into a `mongodb+srv://` Atlas connection string in `src/db/index.js`

## Architecture

Request flow is layered: **router → controller → manager → Mongoose model**.

- `src/app.js` — entry point. Creates the HTTP server, wires up Socket.IO (`io` is exported but currently unused beyond logging connections), and defines the `/` (home) and `*` (404) routes. The exported `app` comes from `src/server.js`.
- `src/server.js` — builds the Express app: JSON/urlencoded body parsing, static files from `src/public`, Handlebars engine + views from `src/views`, calls `mongoConnect()`, and mounts routes via `router(app)`.
- `src/router/index.js` — mounts the three controllers: `/api/products`, `/api/carts` (JSON APIs) and `/products` (rendered view). The `/` (home), `/cart` (cart page) and `*` (404) view routes are defined directly in `src/app.js`.
- `src/controllers/*` — Express `Router` instances holding route handlers. Note `apiProducts.controller.js` and `products.controller.js` share nearly identical list logic; the API one returns JSON, the `/products` one `render`s `products.handlebars`.
- `src/managers/*` — `ProductManager` / `CartManager` classes encapsulate all DB access. Controllers instantiate one manager and call its async methods. This is the only layer that touches the models.
- `src/models/*` — Mongoose schemas. `product.model.js` registers the `mongoose-paginate-v2` plugin (so `Product.paginate()` works). `cart.model.js` has a `pre("findOne")` hook that auto-populates `products.product`.

## Conventions

- HTTP status codes come from the `HTTP_RESPONSES` constant (`src/constants/http-responses.constant.js`) — use it instead of raw numbers.
- API responses are wrapped in `{ response }` or `{ payload }` (and `{ error: error.message }` on failure). Managers re-throw errors; controllers catch them and map to status codes.
- Product list endpoints accept `?limit=&page=&sort=` query params; `sort=asc|desc` maps to price ascending/descending and is passed to `paginate`.
- Cart references products by ObjectId. `CartManager` mutates the loaded cart document and calls `cart.markModified("products")` before `save()`.

## Frontend ↔ backend binding

The rendered pages talk to the JSON API from the browser via `fetch` — there are no HTML form POSTs.

- `src/public/js/ui.js` is loaded on every page (via the layout, `defer` in `<head>`). It owns the cart id in `localStorage` (`getCartId`/`setCartId`/`clearCartId`), the `showToast` notifications, and the navbar cart badge (`updateCartBadge`). Page scripts (`products.js`, `cart.js`) depend on these globals, so ui.js must load first — that ordering is guaranteed by `defer` + document position.
- The cart id is per-browser (localStorage). The cart page (`/cart`) and badge render entirely client-side from `GET /api/carts/:cid`; the server never needs to know which cart belongs to the visitor.
- CSS: `base.css` (always loaded) holds the reset, theme variables, navbar, buttons and toasts. Page-specific files (`index.css`, `products.css`, `carts.css`) only hold page layout.

## Notes

- `data/products.json` and `data/carts.json` are legacy file-based storage and are not used by the current Mongoose-backed code.
- `cart.model.js` uses collection name `carts`, `product.model.js` uses `products` (passed as the model name, which Mongoose pluralizes — here already plural).
