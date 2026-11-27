import { decodeToken, tamper } from "../utils/jwt";

// ---------------------------------------------------------------------------
// ACTION TYPES: plain strings that name "what happened".
// ---------------------------------------------------------------------------
export const LOGIN_REQUEST = "auth/loginRequest";
export const LOGIN_SUCCESS = "auth/loginSuccess";
export const LOGIN_FAILURE = "auth/loginFailure";
export const LOGOUT = "auth/logout";
export const API_RESULT = "api/result";
export const API_CLEAR = "api/clear";

// ---------------------------------------------------------------------------
// ACTION CREATORS: functions that return ACTIONS (plain objects with a `type`).
// An action describes an event; it does not change state by itself.
// ---------------------------------------------------------------------------
export const loginRequest = () => ({ type: LOGIN_REQUEST });
export const loginSuccess = (token) => ({ type: LOGIN_SUCCESS, payload: { token } });
export const loginFailure = (message) => ({ type: LOGIN_FAILURE, payload: { message } });
export const logout = (reason = "You logged out.") => ({ type: LOGOUT, payload: { reason } });
export const apiResult = (result) => ({ type: API_RESULT, payload: result });
export const clearResults = () => ({ type: API_CLEAR });

// ---------------------------------------------------------------------------
// THUNKS: functions that receive `dispatch` so they can do async work
// (a network call) and DISPATCH several actions along the way.
// ---------------------------------------------------------------------------
export const login = (username, password) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    dispatch(loginSuccess(data.token));
  } catch (err) {
    dispatch(loginFailure(err.message || "Could not reach the server."));
  }
};

// Calls a protected route with the token from the store.
// options.tampered sends a token with a broken signature on purpose.
export const callProtected = (path, options = {}) => async (dispatch, getState) => {
  const { token } = getState().auth;
  const sent = options.tampered ? tamper(token) : token;

  try {
    const res = await fetch(path, { headers: { Authorization: `Bearer ${sent}` } });
    const body = await res.json();
    dispatch(
      apiResult({
        id: Date.now(),
        path,
        status: res.status,
        ok: res.ok,
        tampered: !!options.tampered,
        body,
      })
    );
    // Server says the token is no longer valid, so end the session in the store.
    if (res.status === 401 && !options.tampered) dispatch(logout(body.message));
  } catch {
    dispatch(
      apiResult({ id: Date.now(), path, status: 0, ok: false, body: { message: "Network error." } })
    );
  }
};

// Used when the page loads and again whenever the token is stored.
export const userFromToken = (token) => {
  const decoded = decodeToken(token);
  return decoded ? decoded.payload : null;
};
