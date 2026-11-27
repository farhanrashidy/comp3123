import { useSelector } from "react-redux";
import LoginForm from "./components/LoginForm";
import TokenPanel from "./components/TokenPanel";
import ApiPanel from "./components/ApiPanel";
import ReduxInspector from "./components/ReduxInspector";

export default function App() {
  // useSelector reads a slice of state and re-renders when it changes.
  const authenticated = useSelector((s) => s.auth.status === "authenticated");

  return (
    <div className="page">
      <header className="top">
        <h1>COMP 3123 - Lab 10</h1>
        
      </header>

      <main className="grid">
        <div className="col">
          {authenticated ? (
            <>
              <TokenPanel />
              <ApiPanel />
            </>
          ) : (
            <LoginForm />
          )}
        </div>
        <div className="col">
          <ReduxInspector />
        </div>
      </main>
    </div>
  );
}
