# COMP3123 Assignment 1 — Employee Management API

A REST API built with Node.js, Express and Mongoose. Users register and log in to receive a JWT; authenticated users can manage only employees whose `user` reference matches their own account. MongoDB database name is fixed to `comp3123_assignment1`.

## Technologies and structure

- Node.js 18+, Express 4, MongoDB, Mongoose
- bcryptjs password hashing, JSON Web Tokens, Helmet, express-rate-limit, express-validator, Morgan
- `src/config`: database connection; `src/models`: User and Employee; `src/routes`: endpoint maps; `src/controllers`: endpoint logic; `src/middleware`: authentication, validation and errors; `src/validators`: request schemas; `logs/application.log`: local request and event log
- `postman/COMP3123-Assignment-1.postman_collection.json`: importable request collection

## Install and run

1. Install Node.js 18+ and MongoDB Community Server, then start the MongoDB service.
2. From this folder run `npm install`.
3. Copy `.env.example` to `.env`. Set `MONGODB_URI` to your local/Atlas connection string, and replace `JWT_SECRET` with a unique random value of at least 32 characters. Never commit `.env`.
4. Run `npm start` (or `npm run dev` during development). The API listens on `http://localhost:3000` by default.
5. Import the Postman collection, select the `Local API` environment, and perform signup then login. Copy the login `token` to the collection's `token` variable, or save the token from the login response as a collection variable.

### Environment variables

| Name | Purpose | Default |
| --- | --- | --- |
| `PORT` | HTTP port | `3000` |
| `NODE_ENV` | Runtime mode | `development` |
| `MONGODB_URI` | MongoDB connection string | local DB shown in `.env.example` |
| `JWT_SECRET` | HS256 signing key (at least 32 characters) | required |
| `JWT_EXPIRES_IN` | Token lifetime | `1h` |
| `AUTH_RATE_LIMIT_WINDOW_MS` / `AUTH_RATE_LIMIT_MAX` | Signup/login limit window and requests | 900000 / 10 |
| `API_RATE_LIMIT_WINDOW_MS` / `API_RATE_LIMIT_MAX` | API-wide limit window and requests | 900000 / 100 |

## API

All request and response bodies are JSON. Errors use `{ "error": { "code": "...", "message": "..." } }`; validation errors also include a `fields` array.

| Method and path | Auth | Success | Purpose |
| --- | --- | --- | --- |
| `GET /health` | No | 200 | Service health and timestamp |
| `POST /api/v1/user/signup` | No | 201 | `{ "username", "email", "password" }`; password requires 8+ characters, lower/upper case and a digit |
| `POST /api/v1/user/login` | No | 200 | `{ "username", "password" }` or `{ "email", "password" }`; returns a Bearer JWT |
| `GET /api/v1/emp/employees` | Bearer JWT | 200 | List only the current user's employees |
| `POST /api/v1/emp/employees` | Bearer JWT | 201 | Create an employee; the owner is taken from the verified token |
| `GET /api/v1/emp/employees/{eid}` | Bearer JWT | 200 | Get an owned employee |
| `PUT /api/v1/emp/employees/{eid}` | Bearer JWT | 200 | Update an owned employee; owner fields are ignored |
| `DELETE /api/v1/emp/employees?eid={eid}` | Bearer JWT | 204 | Delete an owned employee; no response body |

Employee JSON fields: `first_name`, `last_name`, `email`, `position`, `salary`, `date_of_joining` (ISO 8601 date), and `department`. `eid` must be a valid MongoDB ObjectId. An unowned or nonexistent employee returns 404 without revealing which case applies.

## Authentication, ownership, and security

Signup stores passwords only after bcrypt hashing (12 rounds). The schema excludes the password by default, and user responses never serialize it. Login accepts a username or email and returns an HS256 JWT. Send it as `Authorization: Bearer <jwt>`. Employee routes reject missing, invalid, or expired tokens with 401.

Employee list, read, update, and delete queries all include both employee `_id` (where applicable) and the authenticated user's `user` ID. Creation sets `user` from the token, never from request JSON. Updates whitelist employee fields, preventing ownership reassignment. A user therefore cannot enumerate, view, edit, or delete another user's employee.

Helmet sets standard HTTP security headers. Authentication requests are limited to 10 per 15 minutes by default; all `/api` traffic is limited to 100 per 15 minutes. Exceeding either limit returns JSON 429 and writes a rate-limit event to the local log. Tune both via environment variables. Express-validator checks required fields, lengths, email, salary, dates and IDs before controller work. A centralized error handler returns JSON and avoids stack traces. `.env` keeps credentials outside source control; `.env.example` contains placeholders only.

## Logging and health

Requests, startup, auth outcomes, validation failures, rate limiting, employee changes and errors are appended to `logs/application.log`. Passwords and Authorization headers/tokens are not logged. The `.gitignore` excludes generated logs; the log directory is created at startup. `GET /health` returns HTTP 200 with `{ "status": "ok", "service": "comp3123-assignment1-api", "timestamp": "..." }` when the process is serving requests. Database connection is checked at startup.

## Postman verification and evidence

The included collection covers health, signup, duplicate signup, invalid signup, username/email login, invalid login, employee CRUD, missing/invalid JWT, bad ID, malformed employee inputs, cross-user attempts, and repeated login attempts for rate limiting. Run requests with a live MongoDB instance. To demonstrate isolation, create two separate accounts, create an employee with each token, then try User A's token against User B's employee read/update/delete and repeat in reverse. Those operations should return 404; each user's list should contain only their own employee. After more than the configured authentication limit, login should return 429.

The `screenshots/` folder explains the required genuine evidence: MongoDB database/collections and ownership/hash, signup/login (redact JWT), employee CRUD, validation, rate limit, Helmet headers, health check, local log, and two-user access tests. Screenshots cannot be captured until you run the app against a MongoDB instance and use a client such as Postman or MongoDB Compass. Add them before submission; do not expose secrets.

## Submission checklist

- [ ] Run and verify each Postman request against MongoDB; save screenshots into `screenshots/`.
- [ ] Add the public GitHub URL after creating `Student#_COMP3123_Assignment1` using your student number; use regular commits.
- [ ] If submitting a ZIP, exclude `node_modules/` and `.env`.
- [ ] Supply safe sample marking credentials separately and never reuse real passwords.

The source project is prepared locally. Publishing a public GitHub repository and capturing live MongoDB/client screenshots require your GitHub account, student number, and a running database/client; no credentials or fabricated evidence are included here.
