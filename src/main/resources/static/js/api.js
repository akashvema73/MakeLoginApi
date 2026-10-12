// Page Spring Boot (8080) se khula ho to relative URL, Live Server se khula ho to full URL
const API = location.port === "8080" ? "" : "http://localhost:8080";

// Har method (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS) ke liye ek hi helper
async function api(method, path, body) {
  const opts = { method, headers: {} };
  if (body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  try {
    const res = await fetch(API + path, opts);
    let data = {};
    try { data = await res.json(); } catch (e) { /* empty body */ }
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 0, data: { message: "Server se connect nahi ho pa raha. Spring Boot chal raha hai?" } };
  }
}
