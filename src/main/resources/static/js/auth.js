const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const $ = (id) => document.getElementById(id);

function clearErrors() {
  document.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));
  const box = $("msg");
  box.className = "alert";
  box.hidden = true;
}
function showMsg(text, type) {
  const box = $("msg");
  box.className = "alert " + type;
  box.textContent = text;
  box.hidden = false;
}
function fieldError(id, text) {
  $(id).textContent = text;
  return false;
}
function showServerFieldErrors(data) {
  Object.keys(data).forEach((k) => { if ($(k + "Error")) $(k + "Error").textContent = data[k]; });
}

// Already logged in ho to seedha dashboard
if (sessionStorage.getItem("user")) location.replace("dashboard.html");

const loginForm = $("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();
    const email = $("email").value.trim();
    const password = $("password").value;
    let ok = true;
    if (!EMAIL_RE.test(email)) ok = fieldError("emailError", "Enter a valid email");
    if (!password) ok = fieldError("passwordError", "Password is required");
    if (!ok) return;

    const btn = $("submitBtn");
    btn.disabled = true;
    const r = await api("POST", "/api/auth/login", { email, password });
    btn.disabled = false;
    if (r.ok) {
      sessionStorage.setItem("user", JSON.stringify(r.data.user));
      location.href = "dashboard.html";
    } else if (r.status === 400) {
      showServerFieldErrors(r.data);
    } else {
      showMsg(r.data.message || "Something went wrong", "error");
    }
  });
}

const registerForm = $("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();
    const name = $("name").value.trim();
    const email = $("email").value.trim();
    const password = $("password").value;
    let ok = true;
    if (!name) ok = fieldError("nameError", "Name is required");
    if (!EMAIL_RE.test(email)) ok = fieldError("emailError", "Enter a valid email");
    if (password.length < 6) ok = fieldError("passwordError", "Password must be at least 6 characters");
    if (!ok) return;

    const btn = $("submitBtn");
    btn.disabled = true;
    const r = await api("POST", "/api/auth/register", { name, email, password });
    btn.disabled = false;
    if (r.ok) {
      showMsg("Account created. Redirecting to login...", "success");
      registerForm.reset();
      setTimeout(() => (location.href = "index.html"), 1300);
    } else if (r.status === 400) {
      showServerFieldErrors(r.data);
    } else {
      showMsg(r.data.message || "Something went wrong", "error");
    }
  });
}
