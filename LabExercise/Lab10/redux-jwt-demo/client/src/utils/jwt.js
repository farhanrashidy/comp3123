// A JWT is three base64url strings joined by dots:  header.payload.signature
// The client can READ header and payload (they are only encoded, not encrypted),
// but it can never verify the signature: only the server knows the secret.

function base64UrlDecode(segment) {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return decodeURIComponent(
    atob(padded)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
}

export function decodeToken(token) {
  try {
    const [header, payload, signature] = token.split(".");
    return {
      header: JSON.parse(base64UrlDecode(header)),
      payload: JSON.parse(base64UrlDecode(payload)),
      signature,
      parts: [header, payload, signature],
    };
  } catch {
    return null;
  }
}

// "exp" is seconds since the Unix epoch.
export function secondsRemaining(payload) {
  return Math.floor(payload.exp - Date.now() / 1000);
}

// Flip a character in the signature so the server rejects the token.
export function tamper(token) {
  const parts = token.split(".");
  const sig = parts[2];
  parts[2] = (sig[0] === "A" ? "B" : "A") + sig.slice(1);
  return parts.join(".");
}
