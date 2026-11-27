// Minimal Express API that issues and verifies JSON Web Tokens (JWT).
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// In a real app the secret comes from an environment variable and is long and random.
const JWT_SECRET = process.env.JWT_SECRET || "demo-secret-do-not-use-in-production";
// Short lifetime so the expiry behaviour is easy to see in the demo.
const TOKEN_LIFETIME_SECONDS = 60;
const PORT = process.env.PORT || 5000;

// Demo users. Real apps store hashed passwords (bcrypt/argon2) in a database.
const users = [
  { id: 1, username: "admin", password: "admin123", role: "admin", email: "admin@example.com" },
  { id: 2, username: "viewer", password: "viewer123", role: "viewer", email: "viewer@example.com" },
];

// ---------- Middleware: verify the JWT sent in the Authorization header ----------
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Missing token. Send 'Authorization: Bearer <token>'." });
  }

  try {
    // Checks the signature AND the exp claim.
    req.auth = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    const message =
      err.name === "TokenExpiredError" ? "Token expired. Please log in again." : "Invalid token.";
    return res.status(401).json({ message });
  }
}

function requireRole(role) {
  return (req, res, next) =>
    req.auth.role === role
      ? next()
      : res.status(403).json({ message: `Forbidden: requires the '${role}' role.` });
}

// ---------- Routes ----------
app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Wrong username or password." });
  }

  // Payload (claims): "sub" = subject (user id). Never put secrets in a JWT payload;
  // it is only signed, not encrypted.
  const token = jwt.sign(
    { sub: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_LIFETIME_SECONDS }
  );

  res.json({ token, expiresIn: TOKEN_LIFETIME_SECONDS });
});

// Any logged-in user
app.get("/api/profile", requireAuth, (req, res) => {
  const user = users.find((u) => u.id === Number(req.auth.sub));
  res.json({ id: user.id, username: user.username, email: user.email, role: user.role });
});

// Admins only
app.get("/api/admin", requireAuth, requireRole("admin"), (req, res) => {
  res.json({ message: "Welcome, admin. Only tokens with role=admin reach this route." });
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
