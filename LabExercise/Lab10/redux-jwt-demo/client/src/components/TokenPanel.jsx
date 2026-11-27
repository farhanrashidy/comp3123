import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/actions";
import { decodeToken, secondsRemaining } from "../utils/jwt";

export default function TokenPanel() {
  const token = useSelector((s) => s.auth.token);
  const dispatch = useDispatch();
  const decoded = decodeToken(token);
  const [left, setLeft] = useState(() => secondsRemaining(decoded.payload));

  // Count down to the "exp" claim and end the session when it passes.
  useEffect(() => {
    const id = setInterval(() => {
      const remaining = secondsRemaining(decoded.payload);
      setLeft(remaining);
      if (remaining <= 0) dispatch(logout("Your token expired, so you were logged out."));
    }, 500);
    return () => clearInterval(id);
  }, [token]);

  const [h, p, s] = decoded.parts;

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Your JWT</h2>
        <button className="ghost" onClick={() => dispatch(logout())}>
          Log out
        </button>
      </div>

      <p className="token" aria-label="Encoded token">
        <span className="seg-h">{h}</span>.<span className="seg-p">{p}</span>.<span className="seg-s">{s}</span>
      </p>

      <div className="decoded">
        <div>
          <h3 className="seg-h">Header</h3>
          <pre>{JSON.stringify(decoded.header, null, 2)}</pre>
        </div>
        <div>
          <h3 className="seg-p">Payload</h3>
          <pre>{JSON.stringify(decoded.payload, null, 2)}</pre>
        </div>
        <div>
          <h3 className="seg-s">Signature</h3>
          <p className="small">Created with the server's secret. The browser cannot verify it.</p>
        </div>
      </div>

      <p className={left <= 15 ? "expiry warn" : "expiry"}>
        Expires in <strong>{Math.max(left, 0)}s</strong>
      </p>
    </section>
  );
}
