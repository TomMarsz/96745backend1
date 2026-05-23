# 96745 Backend I - Product & Cart Management Backend

## Index

- [Overview](#overview-💡)
- [Features](#features-🚀)
- [Tech Stack](#tech-stack-🧰)
- [Installation](#installation-⚙️)
- [Available Scripts](#available-scripts-▶️)
- [Project Structure](#project-structure-📦)
- [Environment Variables](#environment-variables-🔐)
- [API Endpoints](#api-endpoints-📡)
  - [Products](#products-📦)
  - [Carts](#carts-🛒)
- [Views](#views-🌐)
- [Notes](#notes-📝)
- [Legal & Attribution](#legal--attribution-📜)

## Overview 💡

A simple, production-ready backend for product and cart management. This project combines Express, MongoDB, Handlebars, and Socket.IO to offer REST API endpoints, server-rendered pages, and database persistence.

## Features 🚀

A fast overview of the project capabilities:

- RESTful product and cart APIs for CRUD operations
- Pagination and sort support for product listing
- MongoDB Atlas connection via Mongoose
- Handlebars views for listing products and handling 404s
- Socket.IO setup for future real-time functionality
- Static asset delivery from `src/public`

## Tech Stack 🧰

Technologies used to build and run the backend:

- Node.js — runtime environment
- Express — HTTP server and routing
- MongoDB / Mongoose — data persistence and models
- express-handlebars — view template engine
- mongoose-paginate-v2 — pagination support
- socket.io — real-time server support
- dotenv — environment variable management

## Installation ⚙️

How to get the project running locally:

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with the database and server settings:

```env
PORT=8080
DB_USER=<your-mongodb-user>
DB_PASSWORD=<your-mongodb-password>
DB_HOST=<your-mongodb-host>
DB_NAME=<your-database-name>
```

4. Start the server in development mode:

```bash
npm run dev
```

5. Or start the server in production mode:

```bash
npm start
```

## Available Scripts ▶️

Run the main project commands with npm:

- `npm run dev` — launch the server with `nodemon` for live reload
- `npm start` — run the app with Node
- `npm test` — placeholder command, no tests configured yet

## Project Structure 📦

How the project files are organized:

- `src/app.js` — Express app, middleware, and router setup
- `src/server.js` — server startup, root route, 404 handling, Socket.IO initialization
- `src/router/index.js` — central route registration
- `src/controllers/` — controllers for API and view routes
- `src/managers/` — product and cart business logic
- `src/models/` — Mongoose schemas and models
- `src/db/index.js` — MongoDB connection module
- `src/configs/` — environment-based configuration
- `src/views/` — Handlebars templates and layouts
- `src/public/` — static CSS and JavaScript assets

## Environment Variables 🔐

Configurable values required for deployment:

- `PORT` — server port
- `DB_USER` — MongoDB username
- `DB_PASSWORD` — MongoDB password
- `DB_HOST` — MongoDB host or cluster address
- `DB_NAME` — MongoDB database name

## API Endpoints 📡

A complete summary of available REST endpoints.

### Products 📦

- `GET /api/products` — list products with optional query params:
  - `limit` (default `10`)
  - `page` (default `1`)
  - `sort=asc|desc`
- `GET /api/products/:pid` — get one product by ID
- `POST /api/products` — add a new product
  - body: `title`, `description`, `price`, `stock`, `category`
- `PUT /api/products/:pid` — update an existing product
- `DELETE /api/products/:pid` — remove a product

### Carts 🛒

- `GET /api/carts` — retrieve all carts
- `GET /api/carts/:cid` — retrieve a single cart by ID
- `POST /api/carts` — create a new empty cart
- `POST /api/carts/:cid/products/:pid` — add a product to a cart
  - body: `quantity` (default `1`)
- `PUT /api/carts/:cid` — replace the cart contents
  - body: `products` array
- `PUT /api/carts/:cid/products/:pid` — update quantity for a cart item
  - body: `quantity`
- `DELETE /api/carts/:cid/products/:pid` — remove an item from a cart
- `DELETE /api/carts/:cid` — clear all products from a cart

## Views 🌐

User-facing routes and rendered pages:

- `GET /` — homepage rendered by `src/views/index.handlebars`
- `GET /products` — product listing page rendered by `src/views/products.handlebars`
- fallback `GET *` — custom 404 page rendered by `src/views/404.handlebars`

## Notes 📝

Additional implementation details to keep in mind:

- Socket.IO is initialized in `src/app.js`, but currently it only logs incoming connections.
- Product listing uses `mongoose-paginate-v2` to support paging and metadata.
- Database credentials are loaded from `.env` using `dotenv`.

---

## Legal & Attribution 📜

This repository is a course project completed for the Coderhouse Backend course. All code and implementation belong to Tromas Masico.

- Name: Tomás Mársico
- Course: Coderhouse Comisión 96745 - Backend I
- Purpose: Educational project and portfolio demonstration

Happy coding! ✨
