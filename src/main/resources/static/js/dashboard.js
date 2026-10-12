(function () {
  const me = JSON.parse(sessionStorage.getItem("user") || "null");
  if (!me) { location.replace("index.html"); return; }

  const isAdmin = me.role === "ADMIN";
  const $ = (id) => document.getElementById(id);
  const state = { all: [], list: [], page: 1, size: 8, editId: null, deleteId: null };

  const ICONS = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>',
    power: '<path d="M18.4 6.6a9 9 0 1 1-12.8 0"/><path d="M12 2v10"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>'
  };
  const svg = (n, s = 18) =>
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]}</svg>`;

  const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const initials = (n) => n.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const COLORS = ["#4f46e5", "#0891b2", "#16a34a", "#d97706", "#db2777", "#7c3aed", "#0d9488", "#ea580c"];
  const color = (n) => COLORS[[...n].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];
  const avatar = (n, cls = "") => `<div class="avatar ${cls}" style="background:${color(n)}">${esc(initials(n))}</div>`;
  const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const cap = (s) => s.charAt(0) + s.slice(1).toLowerCase();

  function toast(text, type = "success") {
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.textContent = text;
    $("toasts").appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  /* ---------- Layout setup ---------- */
  document.querySelectorAll("[data-icon]").forEach((el) => (el.innerHTML = svg(el.dataset.icon)));
  $("meAvatar").style.background = color(me.name);
  $("meAvatar").textContent = initials(me.name);
  $("meName").textContent = me.name;
  $("meRole").textContent = cap(me.role);
  $("welcomeText").textContent = "Welcome back, " + me.name.split(" ")[0];
  if (!isAdmin) document.querySelectorAll(".admin-only").forEach((el) => (el.hidden = true));

  function showView(name) {
    ["overview", "users"].forEach((v) => ($("view-" + v).hidden = v !== name));
    document.querySelectorAll(".nav button").forEach((b) => b.classList.toggle("active", b.dataset.view === name));
    $("pageTitle").textContent = name === "overview" ? "Overview" : "Users";
    $("sidebar").classList.remove("open");
  }
  document.querySelectorAll(".nav button").forEach((b) => b.addEventListener("click", () => showView(b.dataset.view)));
  $("menuBtn").addEventListener("click", () => $("sidebar").classList.toggle("open"));
  $("logoutBtn").addEventListener("click", () => { sessionStorage.removeItem("user"); location.href = "index.html"; });

  /* ---------- Data ---------- */
  async function refresh() {
    const [s, a] = await Promise.all([api("GET", "/api/users/stats"), api("GET", "/api/users")]);
    if (!s.ok || !a.ok) { toast((s.data && s.data.message) || (a.data && a.data.message) || "Could not load data", "error"); return; }
    state.all = a.data;
    renderStats(s.data);
    renderRecent();
    await applyFilters();
  }

  async function applyFilters() {
    const q = $("fSearch").value.trim(), st = $("fStatus").value, ro = $("fRole").value;
    if (!q && !st && !ro) {
      state.list = state.all;
    } else {
      const p = new URLSearchParams();
      if (q) p.set("search", q);
      if (st) p.set("status", st);
      if (ro) p.set("role", ro);
      const r = await api("GET", "/api/users?" + p.toString());
      if (r.ok) state.list = r.data;
    }
    state.page = 1;
    renderTable();
  }

  /* ---------- Render ---------- */
  function renderStats(s) {
    $("sTotal").textContent = s.total;
    $("sActive").textContent = s.active;
    $("sInactive").textContent = s.inactive;
    $("sAdmin").textContent = s.admins;
    const pa = s.total ? Math.round((s.active / s.total) * 100) : 0;
    const pd = s.total ? Math.round((s.admins / s.total) * 100) : 0;
    $("pActive").textContent = pa + "%"; $("barActive").style.width = pa + "%";
    $("pAdmin").textContent = pd + "%"; $("barAdmin").style.width = pd + "%";
  }

  function renderRecent() {
    $("recentList").innerHTML = state.all.slice(0, 5).map((u) =>
      `<li>${avatar(u.name)}<div class="who"><b>${esc(u.name)}</b><span>${esc(u.email)}</span></div>
       <span class="badge ${u.status}">${cap(u.status)}</span></li>`).join("") || '<li class="empty">No users yet</li>';
  }

  function renderTable() {
    const total = state.list.length;
    const pages = Math.max(1, Math.ceil(total / state.size));
    if (state.page > pages) state.page = pages;
    const start = (state.page - 1) * state.size;
    const rows = state.list.slice(start, start + state.size);

    $("emptyState").hidden = total !== 0;
    $("userRows").innerHTML = rows.map((u) => {
      const self = u.id === me.id;
      const acts = isAdmin
        ? `<div class="actions">
             <button class="icon-btn" data-act="edit" data-id="${u.id}" title="Edit">${svg("edit", 16)}</button>
             <button class="icon-btn" data-act="toggle" data-id="${u.id}" title="${u.status === "ACTIVE" ? "Deactivate" : "Activate"}" ${self ? "disabled" : ""}>${svg("power", 16)}</button>
             <button class="icon-btn del" data-act="delete" data-id="${u.id}" title="Delete" ${self ? "disabled" : ""}>${svg("trash", 16)}</button>
           </div>`
        : '<span style="color:#94a3b8">View only</span>';
      return `<tr>
        <td><div class="usercell">${avatar(u.name)}<div><b>${esc(u.name)}</b><span>${esc(u.email)}</span></div></div></td>
        <td>${esc(u.phone || "-")}</td>
        <td><span class="badge ${u.role}">${cap(u.role)}</span></td>
        <td><span class="badge ${u.status}">${cap(u.status)}</span></td>
        <td>${fmtDate(u.createdAt)}</td>
        <td>${acts}</td></tr>`;
    }).join("");

    const from = total ? start + 1 : 0;
    $("pagerInfo").textContent = `Showing ${from}-${Math.min(start + state.size, total)} of ${total} users`;
    $("prevBtn").disabled = state.page <= 1;
    $("nextBtn").disabled = state.page >= pages;
  }

  /* ---------- Events: filters, paging, row actions ---------- */
  let timer;
  $("fSearch").addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(applyFilters, 300); });
  $("fStatus").addEventListener("change", applyFilters);
  $("fRole").addEventListener("change", applyFilters);
  $("prevBtn").addEventListener("click", () => { state.page--; renderTable(); });
  $("nextBtn").addEventListener("click", () => { state.page++; renderTable(); });

  $("userRows").addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;
    const user = state.all.find((u) => u.id === Number(btn.dataset.id));
    if (!user) return;
    if (btn.dataset.act === "edit") openForm(user);
    if (btn.dataset.act === "delete") openDelete(user);
    if (btn.dataset.act === "toggle") {
      const next = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const r = await api("PATCH", "/api/users/" + user.id, { status: next });       // PATCH: sirf status
      if (r.ok) { toast(`${user.name} is now ${next.toLowerCase()}`); refresh(); }
      else toast(r.data.message || "Update failed", "error");
    }
  });

  /* ---------- Add / Edit modal ---------- */
  const openModal = (id) => $(id).classList.add("open");
  const closeModals = () => document.querySelectorAll(".modal").forEach((m) => m.classList.remove("open"));
  document.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeModals));
  document.querySelectorAll(".modal").forEach((m) => m.addEventListener("click", (e) => { if (e.target === m) closeModals(); }));

  function clearFormErrors() { document.querySelectorAll(".fe").forEach((el) => (el.textContent = "")); }

  function openForm(user) {
    state.editId = user ? user.id : null;
    clearFormErrors();
    $("modalTitle").textContent = user ? "Edit user" : "Add user";
    $("fName").value = user ? user.name : "";
    $("fEmail").value = user ? user.email : "";
    $("fPhone").value = user && user.phone ? user.phone : "";
    $("fPassword").value = "";
    $("fFormRole").value = user ? user.role : "USER";
    $("fFormStatus").value = user ? user.status : "ACTIVE";
    $("pwField").hidden = !!user;               // password sirf naya user banate time
    openModal("userModal");
    $("fName").focus();
  }
  $("topAddBtn").addEventListener("click", () => openForm(null));

  $("userForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    clearFormErrors();
    const body = {
      name: $("fName").value.trim(),
      email: $("fEmail").value.trim(),
      phone: $("fPhone").value.trim(),
      role: $("fFormRole").value,
      status: $("fFormStatus").value
    };
    let ok = true;
    const bad = (id, t) => { $(id).textContent = t; ok = false; };
    if (!body.name) bad("fe-name", "Name is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) bad("fe-email", "Enter a valid email");
    if (!state.editId) {
      body.password = $("fPassword").value;
      if (body.password.length < 6) bad("fe-password", "Password must be at least 6 characters");
    }
    if (!ok) return;

    $("saveBtn").disabled = true;
    const r = state.editId
      ? await api("PUT", "/api/users/" + state.editId, body)       // PUT: poora update
      : await api("POST", "/api/users", body);                      // POST: naya user
    $("saveBtn").disabled = false;

    if (r.ok) {
      if (state.editId === me.id) {
        me.name = r.data.name; me.email = r.data.email; me.role = r.data.role;
        sessionStorage.setItem("user", JSON.stringify(me));
      }
      toast(state.editId ? "User updated successfully" : "User created successfully");
      closeModals();
      refresh();
    } else if (r.status === 400) {
      Object.keys(r.data).forEach((k) => { if ($("fe-" + k)) $("fe-" + k).textContent = r.data[k]; });
      if (r.data.message) toast(r.data.message, "error");
    } else if (r.status === 409) {
      $("fe-email").textContent = r.data.message;
    } else {
      toast(r.data.message || "Something went wrong", "error");
    }
  });

  /* ---------- Delete ---------- */
  function openDelete(user) {
    state.deleteId = user.id;
    $("deleteText").textContent = `Are you sure you want to delete ${user.name}? This action cannot be undone.`;
    openModal("deleteModal");
  }
  $("confirmDelete").addEventListener("click", async () => {
    const r = await api("DELETE", "/api/users/" + state.deleteId);   // DELETE
    closeModals();
    if (r.ok) { toast("User deleted"); refresh(); }
    else toast(r.data.message || "Delete failed", "error");
  });

  showView("overview");
  refresh();
})();
