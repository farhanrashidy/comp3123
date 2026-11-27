import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/actions";

const DEMO_USERS = [
  { username: "admin", password: "admin123" },
  { username: "viewer", password: "viewer123" },
];

export default function LoginForm() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const dispatch = useDispatch(); // DISPATCH: send an action to the store
  const { status, message } = useSelector((s) => s.auth);

  const submit = (e) => {
    e.preventDefault();
    dispatch(login(username, password));
  };

  return (
    <section className="panel">
      <h2>Log in</h2>
      <form onSubmit={submit} className="form">
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        <button className="primary" disabled={status === "loading"}>
          {status === "loading" ? "Logging in…" : "Log in"}
        </button>
      </form>

      {message && <p className="notice">{message}</p>}

      <div className="hint">
        <p>Demo accounts</p>
        <div className="row">
          {DEMO_USERS.map((u) => (
            <button
              key={u.username}
              type="button"
              className="ghost"
              onClick={() => {
                setUsername(u.username);
                setPassword(u.password);
              }}
            >
              {u.username}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
