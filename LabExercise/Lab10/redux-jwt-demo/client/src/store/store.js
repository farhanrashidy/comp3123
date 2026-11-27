import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";
import { decodeToken, secondsRemaining } from "../utils/jwt";
import { userFromToken } from "./actions";

const STORAGE_KEY = "demo.jwt";

// Restore a saved token on page load, but only if it has not expired yet.
function loadPreloadedState() {
  const token = localStorage.getItem(STORAGE_KEY);
  const decoded = token && decodeToken(token);
  if (!decoded || secondsRemaining(decoded.payload) <= 0) {
    localStorage.removeItem(STORAGE_KEY);
    return undefined;
  }
  return {
    auth: { token, user: userFromToken(token), status: "authenticated", message: null },
  };
}

// ---------------------------------------------------------------------------
// STORE: holds the state tree. It exposes three methods:
//   store.getState()        read the current state
//   store.dispatch(action)  send an action to the reducer
//   store.subscribe(fn)     run fn after every state change
// ---------------------------------------------------------------------------
export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadPreloadedState(),
});

// SUBSCRIBE: keep localStorage in sync with the token in the store.
let lastToken = store.getState().auth.token;
store.subscribe(() => {
  const { token } = store.getState().auth;
  if (token === lastToken) return;
  lastToken = token;
  if (token) localStorage.setItem(STORAGE_KEY, token);
  else localStorage.removeItem(STORAGE_KEY);
});
