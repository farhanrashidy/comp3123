import { useDispatch, useSelector } from "react-redux";
import { callProtected, clearResults } from "../store/actions";

export default function ApiPanel() {
  const dispatch = useDispatch();
  const results = useSelector((s) => s.api);
  const role = useSelector((s) => s.auth.user?.role);

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Call protected routes</h2>
        {results.length > 0 && (
          <button className="ghost" onClick={() => dispatch(clearResults())}>
            Clear
          </button>
        )}
      </div>

      <div className="row wrap">
        <button className="primary" onClick={() => dispatch(callProtected("/api/profile"))}>
          GET /api/profile
        </button>
        <button className="primary" onClick={() => dispatch(callProtected("/api/admin"))}>
          GET /api/admin
        </button>
        <button className="danger" onClick={() => dispatch(callProtected("/api/profile", { tampered: true }))}>
          Send tampered token
        </button>
      </div>
      <p className="small">
        You are signed in as <strong>{role}</strong>. /api/admin needs the admin role, and the tampered token
        has a broken signature.
      </p>

      <ul className="results">
        {results.map((r) => (
          <li key={r.id} className={r.ok ? "ok" : "fail"}>
            <div className="result-head">
              <code>{r.path}</code>
              {r.tampered && <span className="tag">tampered</span>}
              <span className="status">{r.status || "error"}</span>
            </div>
            <pre>{JSON.stringify(r.body, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </section>
  );
}
