# Redux + JWT demo

A small full-stack app that demonstrates **React Redux** and **JSON Web Tokens (JWT)** working together.

- **Client:** React 18, Redux Toolkit, React-Redux, Vite
- **Server:** Node.js, Express, `jsonwebtoken`

You log in, the server returns a signed JWT, the token is kept in the Redux store, and the app uses it to call protected routes. A live "Redux inspector" panel shows the state, the actions being dispatched, and how often `store.subscribe` fires.

## Screenshots

| Login | Token and protected routes |
| --- | --- |
| ![Login](screenshots/login.png) | ![Dashboard](screenshots/dashboard.png) |

## Run it

Requires Node.js 18 or newer.

```bash
npm run install:all     # installs root, server and client dependencies
npm run dev             # API on :5000, web app on :5173
```

Open http://localhost:5173 and log in with a demo account:

| Username | Password | Role |
| --- | --- | --- |
| admin | admin123 | admin |
| viewer | viewer123 | viewer |

## What to try

1. **Log in** and watch `auth/loginRequest` then `auth/loginSuccess` appear in the inspector.
2. **Read the token.** The header and payload are decoded in the browser. The signature is not, because only the server can check it.
3. **Call `GET /api/profile`.** Any valid token works.
4. **Call `GET /api/admin` as `viewer`.** You get `403 Forbidden`: the token is valid, but the role is wrong.
5. **Send the tampered token.** One character of the signature is changed and the server answers `401 Invalid token`.
6. **Wait 60 seconds.** The token expires, the server would answer `401`, and the app dispatches `auth/logout`.
7. **Refresh the page** while logged in. The token is restored from `localStorage` by the store (see `store.subscribe`).

---

## Redux concepts and where they appear

Redux keeps the whole app's data in one predictable place and changes it only through a fixed flow:

```
UI event -> dispatch(action) -> reducer(state, action) -> new state -> store notifies subscribers -> UI re-renders
```

| Concept | What it is | Where in this project |
| --- | --- | --- |
| **0. State** | One plain object holding all app data. | Shape defined by the reducers in `client/src/store/reducer.js` (`auth`, `api`, `activity`). Shown live in the inspector. |
| **1. Store** | The object that holds the state and exposes `getState`, `dispatch`, `subscribe`. | `client/src/store/store.js` (`configureStore`), supplied to React by `<Provider>` in `main.jsx`. |
| **2. Reducer** | A pure function `(state, action) => newState`. No side effects, no mutation. | `authReducer`, `apiReducer`, `activityReducer` in `reducer.js`, merged with `combineReducers`. |
| **3. Action** | A plain object describing what happened: `{ type, payload }`. | Types and creators in `client/src/store/actions.js`, e.g. `loginSuccess(token)`. |
| **4. Dispatch** | Sends an action to the store so the reducer runs. | `useDispatch()` in `LoginForm`, `TokenPanel`, `ApiPanel`. Thunks (`login`, `callProtected`) dispatch several actions around an async call. |
| **5. Subscribe** | Registers a callback that runs after every state change. | `store.js` subscribes to save or remove the token in `localStorage`. `ReduxInspector.jsx` subscribes to count notifications. |

React-Redux connects the store to components: `useSelector` reads state and re-renders when it changes, and `useDispatch` returns `dispatch`.

**Why Redux Toolkit?** It is the officially recommended way to use Redux. This project uses only `configureStore` (which adds async "thunk" support) and writes reducers and actions by hand so each concept stays visible.

---

## JWT concepts

A JSON Web Token is a compact string with three base64url parts separated by dots:

```
header.payload.signature
```

- **Header:** the signing algorithm and token type, e.g. `{ "alg": "HS256", "typ": "JWT" }`.
- **Payload:** the *claims*: data about the user and the token, e.g. `sub` (subject), `role`, `iat` (issued at) and `exp` (expiry).
- **Signature:** `HMAC-SHA256(header + "." + payload, secret)`. If anyone changes the header or payload, the signature no longer matches.

### Authentication flow

1. Client sends credentials to `POST /api/login`.
2. Server checks them and signs a JWT with its secret (`jwt.sign`).
3. Client stores the token (here: in the Redux store, mirrored to `localStorage`).
4. Client sends `Authorization: Bearer <token>` with each request to a protected route.
5. Server middleware runs `jwt.verify`, which checks the signature and the `exp` claim, then allows or rejects the request.

The server is **stateless**: it does not keep a session list. Everything it needs is inside the signed token.

### Important points

- **Signed, not encrypted.** Anyone can read the payload (this app decodes it in the browser). Never put passwords or secrets in it.
- **Authentication vs authorization.** A valid signature proves who you are (`401` if not). The `role` claim decides what you may do (`403` if not).
- **Short expiry.** The token lifetime here is 60 seconds so expiry is easy to observe. Real apps commonly use minutes for access tokens, plus a refresh token.
- **Secret handling.** The signing secret must come from an environment variable (`JWT_SECRET`) and never be committed.

### Security notes for real projects

This is a learning demo. For production:

- Hash passwords with bcrypt or argon2 and use a database.
- Serve everything over HTTPS.
- Storing tokens in `localStorage` is readable by any script on the page (XSS risk). Many apps prefer an `HttpOnly`, `Secure`, `SameSite` cookie for the token instead.
- Add refresh tokens and a way to revoke them, since a stateless access token cannot be recalled before it expires.

---

## API

| Method | Route | Access | Result |
| --- | --- | --- | --- |
| POST | `/api/login` | public | `{ token, expiresIn }` or `401` |
| GET | `/api/profile` | any valid token | the user's profile |
| GET | `/api/admin` | token with `role: "admin"` | message, or `403` |

## Project structure

```
redux-jwt-demo/
├── server/
│   ├── index.js              Express API: login, verify middleware, protected routes
│   └── package.json
├── client/
│   ├── index.html
│   ├── vite.config.js        Proxies /api to the Express server
│   └── src/
│       ├── main.jsx          Creates the root and wraps the app in <Provider>
│       ├── App.jsx
│       ├── styles.css
│       ├── store/
│       │   ├── actions.js    Action types, action creators, thunks
│       │   ├── reducer.js    auth, api and activity reducers
│       │   └── store.js      configureStore, preloaded state, subscribe
│       ├── components/
│       │   ├── LoginForm.jsx
│       │   ├── TokenPanel.jsx
│       │   ├── ApiPanel.jsx
│       │   └── ReduxInspector.jsx
│       └── utils/jwt.js      Decode a token, compute expiry, tamper for the demo
├── package.json              Scripts to install and run both apps
└── README.md
```

## References

- Redux fundamentals: https://redux.js.org/tutorials/fundamentals/part-1-overview
- React-Redux hooks: https://react-redux.js.org/api/hooks
- JWT introduction: https://jwt.io/introduction
- RFC 7519 (JSON Web Token): https://datatracker.ietf.org/doc/html/rfc7519
