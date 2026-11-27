import { combineReducers } from "@reduxjs/toolkit";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  API_RESULT,
  API_CLEAR,
  userFromToken,
} from "./actions";

// ---------------------------------------------------------------------------
// STATE: the single JavaScript object holding everything the UI needs.
// REDUCER: a pure function (state, action) => newState.
//   - no API calls, no Date.now(), no mutation: it returns a NEW object.
// ---------------------------------------------------------------------------

const initialAuth = { token: null, user: null, status: "idle", message: null };

function authReducer(state = initialAuth, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, status: "loading", message: null };
    case LOGIN_SUCCESS:
      return {
        token: action.payload.token,
        user: userFromToken(action.payload.token),
        status: "authenticated",
        message: null,
      };
    case LOGIN_FAILURE:
      return { ...initialAuth, message: action.payload.message };
    case LOGOUT:
      return { ...initialAuth, message: action.payload.reason };
    default:
      return state;
  }
}

// Responses from protected routes, newest first.
function apiReducer(state = [], action) {
  switch (action.type) {
    case API_RESULT:
      return [action.payload, ...state].slice(0, 5);
    case API_CLEAR:
    case LOGOUT:
    case LOGIN_SUCCESS:
      return [];
    default:
      return state;
  }
}

// A small history of dispatched actions so you can SEE actions flowing through.
function activityReducer(state = [], action) {
  if (action.type.startsWith("@@")) return state;
  return [{ type: action.type, at: new Date().toLocaleTimeString() }, ...state].slice(0, 8);
}

export default combineReducers({
  auth: authReducer,
  api: apiReducer,
  activity: activityReducer,
});
