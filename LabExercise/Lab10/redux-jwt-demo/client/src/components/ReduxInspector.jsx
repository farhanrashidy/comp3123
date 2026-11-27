import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { store } from "../store/store";

const CONCEPTS = [
  ["State", "One object holding all app data"],
  ["Store", "Holds the state, created once"],
  ["Reducer", "(state, action) => new state"],
  ["Action", "A plain object: { type, payload }"],
  ["Dispatch", "Sends an action to the store"],
  ["Subscribe", "Runs a callback after each change"],
];

// Hide the raw token so the state view stays readable.
function printable(state) {
  const { token, ...auth } = state.auth;
  return { ...state, auth: { ...auth, token: token ? token.slice(0, 18) + "…" : null } };
}

export default function ReduxInspector() {
  const state = useSelector((s) => s); // STATE
  const activity = state.activity;

  // SUBSCRIBE: count how many times the store notified its listeners.
  const [notifications, setNotifications] = useState(0);
  useEffect(() => {
    const unsubscribe = store.subscribe(() => setNotifications((n) => n + 1));
    return unsubscribe;
  }, []);

  return (
    <section className="panel">
      <h2>Redux inspector</h2>

      <dl className="concepts">
        {CONCEPTS.map(([term, text]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{text}</dd>
          </div>
        ))}
      </dl>

      <h3>Current state</h3>
      <pre className="state">{JSON.stringify(printable(state), null, 2)}</pre>

      <h3>Dispatched actions</h3>
      {activity.length === 0 ? (
        <p className="small">Nothing dispatched yet. Log in to start.</p>
      ) : (
        <ol className="actions">
          {activity.map((a, i) => (
            <li key={i}>
              <code>{a.type}</code>
              <span>{a.at}</span>
            </li>
          ))}
        </ol>
      )}

      <p className="small">
        <code>store.subscribe</code> has fired <strong>{notifications}</strong> times since this page loaded.
      </p>
    </section>
  );
}
