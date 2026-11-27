# Gatekeeper: Redux + JWT demo

A small app that shows how **React Redux** and **JWT (JSON Web Token)** work together.
You log in, the server gives you a signed token (a "pass"), and the app uses it to open protected routes (the "gates").

**Built with:** React, Redux Toolkit, Vite (client) and Node.js, Express, jsonwebtoken (server).


## Redux concepts

| Concept | Meaning | Where |
| --- | --- | --- |
| State | The one object holding all app data | `client/src/store/reducer.js` |
| Store | Holds the state and runs the updates | `client/src/store/store.js` |
| Reducer | Function `(state, action) => new state` | `client/src/store/reducer.js` |
| Action | Object `{ type, payload }` describing what happened | `client/src/store/actions.js` |
| Dispatch | Sends an action to the store | `useDispatch()` in the components |
| Subscribe | Runs a function after every state change | `store.js` (saves the token) and `ReduxInspector.jsx` |

Flow: `dispatch(action)` -> `reducer` -> new `state` -> subscribers and the UI update.

## JWT in short

A JWT is three parts joined by dots: `header.payload.signature`.

- **Header:** the signing algorithm.
- **Payload:** data about the user (`username`, `role`) and the expiry time (`exp`).
- **Signature:** made with the server's secret, so any change to the token is detected.

How it is used here:

1. `POST /api/login` checks the password and returns a signed token.
2. The token is stored in the Redux store (and saved in `localStorage`).
3. Each request to a protected route sends `Authorization: Bearer <token>`.
4. The server verifies the signature and expiry, then allows or rejects the request.

The payload is readable by anyone, so never put secrets in it. This demo is for learning: real apps should hash passwords, use HTTPS and keep the secret in an environment variable.

## API

| Method | Route | Access |
| --- | --- | --- |
| POST | `/api/login` | public |
| GET | `/api/profile` | any valid token |
| GET | `/api/admin` | token with role `admin` |

