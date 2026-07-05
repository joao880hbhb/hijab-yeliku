export function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }

  if (Array.isArray(forwarded)) {
    return forwarded[0] || req.socket.remoteAddress || "unknown";
  }

  return req.socket.remoteAddress || "unknown";
}
