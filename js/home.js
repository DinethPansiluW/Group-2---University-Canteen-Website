/* ====== EDIT THIS BLOCK FOR YOUR CANTEENS ======
   Canteen names below are placeholders: replace them with the real ones. */
const CONFIG = {
  brand: { name: "Ruhuna", accent: "Eats", mark: "R" },
  tagline: "University of Ruhuna · Matara, Southern Province · Unofficial student project",
  currency: "Rs.",
  ownerPin: "1234",                                          // demo only, not real security
  canteens: [
    { name: "Main Canteen",       campus: "Wellamadama, Matara",     icon: "🏛️" },
    { name: "Library Canteen",    campus: "Wellamadama, Matara",     icon: "📚" },
    { name: "Agriculture Canteen",campus: "Mapalana, Kamburupitiya", icon: "🌱" },
    { name: "Engineering Canteen",campus: "Hapugala, Galle",         icon: "⚙️" },
    { name: "Technology Canteen", campus: "Kamburupitiya",           icon: "💡" },
    { name: "Medical Canteen",    campus: "Karapitiya, Galle",       icon: "🩺" }
  ]
};
const CATEGORIES = { "Rice & Curry":"🍛","Kottu":"🍜","Roti & Paratha":"🫓","String Hoppers":"🍝","Hoppers":"🥞","Short Eats":"🥟","Rolls":"🌯","Buns":"🍞","Pastries":"🥐","Desserts":"🍮","Juices":"🧃","Drinks":"🥥","Other":"🍽️" };
const STORAGE = { foods: "ruhuna_foods_v1", orders: "ruhuna_orders_v1" };
const ORDER_STATUSES = ["Pending","Accepted","Preparing","Ready for Pickup","Completed","Rejected"];

const C = CONFIG.canteens.map(c => c.name);
const s = (name, canteen, category, meal, price, quantity, description) =>
  ({ id: "f" + Math.random().toString(36).slice(2, 9), name, canteen: C[canteen % C.length], category, meal, price, quantity, description });
const starterFoods = [
  s("Kiribath & Lunu Miris",0,"Rice & Curry","Breakfast",180,20,"Milk rice with spicy onion sambol."),
  s("Pol Roti & Sambol",1,"Roti & Paratha","Breakfast",120,24,"Coconut roti with katta sambol."),
  s("Egg Hoppers",3,"Hoppers","Breakfast",130,15,"Crispy hopper with a soft egg."),
  s("String Hoppers",2,"String Hoppers","Breakfast",100,18,"With dhal and pol sambol."),
  s("Plain Tea",4,"Drinks","Breakfast",60,40,"Hot Ceylon tea."),
  s("Rice & Curry",0,"Rice & Curry","Lunch",280,25,"Rice with today's vegetable curries."),
  s("Ambul Thiyal Rice",3,"Rice & Curry","Lunch",420,8,"Southern sour fish curry with rice."),
  s("Jackfruit (Polos) Rice",2,"Rice & Curry","Lunch",300,0,"Young jackfruit curry with rice."),
  s("Chicken Kottu",5,"Kottu","Lunch",450,9,"Classic chicken kottu."),
  s("Vegetable Kottu",1,"Kottu","Lunch",320,14,"Kottu with fresh vegetables."),
  s("Isso Vade",0,"Short Eats","All",90,16,"Crispy prawn vade."),
  s("Fish Bun",4,"Buns","All",120,3,"Soft bun with spicy fish filling."),
  s("Wattalappam",1,"Desserts","All",180,10,"Coconut milk, jaggery and cardamom pudding."),
  s("Thambili (King Coconut)",5,"Drinks","All",150,20,"Served chilled."),
  s("Wood Apple Juice",2,"Juices","All",160,12,"Tangy divul juice.")
];

const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money = v => `${CONFIG.currency} ${Number(v).toLocaleString("en-LK")}`;
const find = id => foods.find(f => f.id === id);
const inStock = f => Number(f.quantity) > 0;
const stockState = f => !inStock(f) ? "Sold Out" : f.quantity <= 5 ? "Limited" : "Available";
const emoji = f => CATEGORIES[f.category] || CATEGORIES.Other;

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : structuredClone(fallback); }
  catch { return structuredClone(fallback); }
}
function save() {
  try { localStorage.setItem(STORAGE.foods, JSON.stringify(foods)); localStorage.setItem(STORAGE.orders, JSON.stringify(orders)); }
  catch { toast("Could not save: browser storage is full or blocked"); }
}
function toast(msg) {
  const el = $("toast"); el.textContent = msg; el.classList.add("show");
  clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("show"), 2400);
}

let foods = load(STORAGE.foods, starterFoods);
let orders = load(STORAGE.orders, []);
let cart = [];
let activeMeal = "All";
let ownerUnlocked = false;

/* ---------- rendering ---------- */
function foodCard(f) {
  const st = stockState(f), cls = st === "Sold Out" ? "sold" : st === "Limited" ? "limited" : "";
  return `<article class="food-card ${inStock(f) ? "" : "out"}">
    <div class="food-photo"><span aria-hidden="true">${emoji(f)}</span><span class="status-badge ${cls}">${st}</span></div>
    <div class="food-content">
      <div class="food-topline"><span>${esc(f.canteen)}</span><span>${esc(f.meal)}</span></div>
      <h3>${esc(f.name)}</h3><div class="food-desc">${esc(f.description || f.category)}</div>
      <div class="food-bottom"><span class="price">${money(f.price)}</span>
        <button class="add-button" data-add="${esc(f.id)}" ${inStock(f) ? "" : "disabled"}>${inStock(f) ? "+ Add" : "Unavailable"}</button></div>
    </div>
  </article>`;
}
function matchesMeal(f, meal) { return meal === "All" || f.meal === meal || f.meal === "All"; }

function renderHome() {
  $("featured-title").textContent = activeMeal === "All" ? "Popular today" : `${activeMeal} menu`;
  const list = foods.filter(f => matchesMeal(f, activeMeal)).slice(0, 8);
  $("home-food-grid").innerHTML = list.map(foodCard).join("") || '<div class="empty-grid">No food listed for this meal time yet.</div>';
  $$(".meal-tab").forEach(b => b.classList.toggle("active", b.dataset.meal === activeMeal));
}
function renderFoods() {
  const q = $("search-input").value.trim().toLowerCase();
  const canteen = $("canteen-filter").value, category = $("category-filter").value, meal = $("meal-filter").value, only = $("available-filter").checked;
  const list = foods.filter(f =>
    (!q || `${f.name} ${f.canteen} ${f.category} ${f.description}`.toLowerCase().includes(q)) &&
    (canteen === "All" || f.canteen === canteen) && (category === "All" || f.category === category) &&
    matchesMeal(f, meal) && (!only || inStock(f)));
  $("all-food-grid").innerHTML = list.length ? list.map(foodCard).join("") : '<div class="empty-grid">No matching food found. Try changing your filters.</div>';
  $("results-count").textContent = `${list.length} food item${list.length === 1 ? "" : "s"} found`;
}
function renderCanteens() {
  $("canteen-grid").innerHTML = CONFIG.canteens.map((c, i) => {
    const n = foods.filter(f => f.canteen === c.name && inStock(f)).length;
    return `<button class="canteen-card" data-canteen="${i}"><div class="canteen-icon">${c.icon}</div><h3>${esc(c.name)}</h3>
      <div class="canteen-campus">${esc(c.campus)}</div><p>${n} available item${n === 1 ? "" : "s"} today</p><span class="canteen-status ${n ? "" : "none"}">${n ? "● Menu available" : "● Nothing available"}</span></button>`;
  }).join("");
}
function cleanCart() { // keep cart valid if the owner changed stock or deleted items
  cart = cart.filter(i => find(i.id) && inStock(find(i.id)));
  cart.forEach(i => { i.qty = Math.min(i.qty, find(i.id).quantity); });
}
function cartTotal() { return cart.reduce((n, i) => n + find(i.id).price * i.qty, 0); }
function renderCart() {
  cleanCart();
  $("cart-count").textContent = cart.reduce((n, i) => n + i.qty, 0);
  $("cart-items").innerHTML = cart.map(i => { const f = find(i.id); return `<div class="cart-row"><div class="cart-emoji">${emoji(f)}</div>
    <div class="cart-row-info"><b>${esc(f.name)}</b><small>${esc(f.canteen)} · ${money(f.price)}</small>
    <div class="qty-controls"><button data-qty="${esc(f.id)}" data-d="-1" aria-label="Decrease">−</button><span>${i.qty}</span><button data-qty="${esc(f.id)}" data-d="1" aria-label="Increase">+</button></div></div>
    <strong>${money(f.price * i.qty)}</strong></div>`; }).join("") || '<div class="empty-state">🛍️<br><br>Your cart is empty.<br>Add something tasty from the menu.</div>';
  $("cart-total").textContent = $("checkout-total").textContent = money(cartTotal());
}
const itemsText = o => o.items.map(i => `${esc(i.name)} × ${i.qty}`).join(", ");
function renderOrders() {
  $("orders-list").innerHTML = orders.length ? orders.map(o => `<div class="order-history-card"><div class="owner-order-head">
    <div><h3>${esc(o.canteen)}</h3><p class="order-id">${esc(o.id)}</p></div><span class="status-badge order-badge">${esc(o.status)}</span></div>
    <p>${esc(o.created)} · ${esc(o.payment)}</p><p>${itemsText(o)}</p><strong>${money(o.total)}</strong></div>`).join("")
    : '<div class="empty-state">You have not placed any orders yet.</div>';
}
function renderOwnerFoods() {
  $("owner-food-items").innerHTML = foods.map(f => `<div class="manage-row"><div><strong>${esc(f.name)}</strong>
    <small>${esc(f.canteen)} · ${money(f.price)} · Qty: ${f.quantity}</small></div><div class="manage-actions">
    <button class="mini-button" data-edit="${esc(f.id)}">Edit</button>
    <button class="mini-button" data-toggle="${esc(f.id)}">${inStock(f) ? "Mark sold out" : "Restock (10)"}</button>
    <button class="mini-button danger" data-delete="${esc(f.id)}">Delete</button></div></div>`).join("") || '<div class="empty-state">No food items yet.</div>';
}
function renderOwnerOrders() {
  $("owner-order-list").innerHTML = orders.length ? orders.map(o => `<div class="owner-order"><div class="owner-order-head"><div>
    <b class="order-id">${esc(o.id)}</b><p class="muted">${esc(o.student)} (${esc(o.studentId)}) · ${esc(o.canteen)} · ${money(o.total)}</p><p class="muted">${itemsText(o)}</p></div>
    <select data-status="${esc(o.id)}" aria-label="Order status">${ORDER_STATUSES.map(st => `<option ${o.status === st ? "selected" : ""}>${st}</option>`).join("")}</select></div></div>`).join("")
    : '<div class="empty-state">No orders received yet.</div>';
}
function renderAll() { renderHome(); renderFoods(); renderCanteens(); renderCart(); renderOwnerFoods(); renderOwnerOrders(); }

/* ---------- cart & checkout ---------- */
function addToCart(id) {
  const f = find(id); if (!f || !inStock(f)) return;
  const ex = cart.find(i => i.id === id);
  if (ex) { if (ex.qty >= f.quantity) return toast("No more quantity available"); ex.qty++; } else cart.push({ id, qty: 1 });
  renderCart(); toast("Added to cart");
}
function changeQty(id, d) {
  const i = cart.find(x => x.id === id), f = find(id); if (!i || !f) return;
  i.qty += d;
  if (i.qty <= 0) cart = cart.filter(x => x.id !== id);
  else if (i.qty > f.quantity) { i.qty = f.quantity; toast("Maximum available quantity reached"); }
  renderCart();
}
const showDrawer = on => { $("cart-drawer").classList.toggle("show", on); $("cart-overlay").classList.toggle("show", on); };
const showModal = (id, on = true) => $(id).classList.toggle("show", on);

function checkout() {
  cleanCart(); renderCart();
  if (!cart.length) return toast("Your cart is empty");
  const canteens = [...new Set(cart.map(i => find(i.id).canteen))];
  if (canteens.length > 1) return toast("Please order from one canteen at a time");
  $("pickup-canteen").innerHTML = `<option>${esc(canteens[0])}</option>`;
  showDrawer(false); showModal("checkout-modal");
}
$("checkout-form").addEventListener("submit", e => {
  e.preventDefault(); cleanCart();
  if (!cart.length) return toast("Your cart changed. Please review it.");
  const order = {
    id: "RU" + Date.now().toString(36).toUpperCase().slice(-5) + Math.random().toString(36).toUpperCase().slice(2, 5),
    student: $("student-name").value.trim(), studentId: $("student-id").value.trim(),
    canteen: find(cart[0].id).canteen, payment: $("payment-method").value,
    items: cart.map(i => { const f = find(i.id); f.quantity -= i.qty; return { id: f.id, name: f.name, price: f.price, qty: i.qty }; }),
    total: cartTotal(), status: "Pending", created: new Date().toLocaleString()
  };
  orders.unshift(order); cart = []; save(); renderAll();
  showModal("checkout-modal", false); renderOrders(); showModal("orders-modal");
  $("checkout-form").reset(); toast("Order placed. Keep your Order ID!");
});

/* ---------- owner ---------- */
function openOwner() {
  if (!ownerUnlocked) {
    const pin = prompt("Enter owner PIN");
    if (pin === null) return;
    if (pin !== CONFIG.ownerPin) return toast("Incorrect PIN");
    ownerUnlocked = true;
  }
  renderOwnerFoods(); renderOwnerOrders(); showModal("owner-modal");
}
function resetFoodForm() {
  $("food-form").reset(); $("edit-food-id").value = ""; $("save-food").textContent = "Add food item"; $("cancel-edit").classList.add("hidden");
}
$("food-form").addEventListener("submit", e => {
  e.preventDefault();
  const id = $("edit-food-id").value, old = id && find(id);
  const data = { id: id || "f" + Date.now().toString(36), canteen: $("owner-canteen").value, name: $("food-name").value.trim(),
    category: $("food-category").value, meal: $("food-meal").value, price: Math.max(0, Number($("food-price").value)),
    quantity: Math.max(0, Math.floor(Number($("food-quantity").value))), description: $("food-desc").value.trim() };
  if (old) { foods = foods.map(f => f.id === id ? { ...f, ...data } : f); toast("Food item updated"); }
  else { foods.unshift(data); toast("New food item added"); }
  save(); resetFoodForm(); renderAll();
});
function setOrderStatus(id, status) {
  const o = orders.find(x => x.id === id); if (!o) return;
  if (status === "Rejected" && !o.restocked) { // give stock back
    o.items.forEach(i => { const f = find(i.id); if (f) f.quantity += i.qty; }); o.restocked = true;
  } else if (status !== "Rejected" && o.restocked) { // un-reject: take stock again if possible
    if (o.items.some(i => !find(i.id) || find(i.id).quantity < i.qty)) { toast("Not enough stock to reopen this order"); return renderOwnerOrders(); }
    o.items.forEach(i => { find(i.id).quantity -= i.qty; }); o.restocked = false;
  }
  o.status = status; save(); renderAll(); renderOrders(); toast("Order status updated");
}

/* ---------- events (delegated, no inline handlers) ---------- */
document.addEventListener("click", e => {
  const t = e.target.closest("[data-add],[data-qty],[data-canteen],[data-edit],[data-toggle],[data-delete]"); if (!t) return;
  const d = t.dataset;
  if (d.add) addToCart(d.add);
  else if (d.qty) changeQty(d.qty, Number(d.d));
  else if (d.canteen !== undefined) { $("canteen-filter").value = CONFIG.canteens[d.canteen].name; renderFoods(); $("menu").scrollIntoView(); toast(`${CONFIG.canteens[d.canteen].name} menu selected`); }
  else if (d.edit) {
    const f = find(d.edit); if (!f) return;
    $("edit-food-id").value = f.id; $("owner-canteen").value = f.canteen; $("food-name").value = f.name; $("food-category").value = f.category;
    $("food-meal").value = f.meal; $("food-price").value = f.price; $("food-quantity").value = f.quantity; $("food-desc").value = f.description || "";
    $("save-food").textContent = "Save changes"; $("cancel-edit").classList.remove("hidden"); $("food-form").scrollIntoView({ block: "start" });
  } else if (d.toggle) { const f = find(d.toggle); f.quantity = inStock(f) ? 0 : 10; save(); renderAll(); toast("Availability updated"); }
  else if (d.delete) {
    if (!confirm("Delete this food item from the menu?")) return;
    foods = foods.filter(f => f.id !== d.delete); save(); renderAll(); toast("Food item deleted");
  }
});
document.addEventListener("change", e => { if (e.target.dataset.status) setOrderStatus(e.target.dataset.status, e.target.value); });
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  $$(".modal-backdrop.show").forEach(m => m.classList.remove("show")); showDrawer(false);
});
$$(".meal-tab").forEach(b => b.addEventListener("click", () => { activeMeal = b.dataset.meal; renderHome(); }));
["canteen-filter","category-filter","meal-filter","available-filter"].forEach(id => $(id).addEventListener("change", renderFoods));
$("search-input").addEventListener("input", renderFoods); // live filter, no scrolling while typing
$("hero-search").addEventListener("submit", e => { e.preventDefault(); renderFoods(); $("menu").scrollIntoView(); });
$("clear-filters").addEventListener("click", () => {
  ["canteen-filter","category-filter"].forEach(id => $(id).value = "All"); $("meal-filter").value = "All";
  $("available-filter").checked = false; $("search-input").value = ""; renderFoods();
});
$("cart-open").addEventListener("click", () => showDrawer(true));
$("cart-close").addEventListener("click", () => showDrawer(false));
$("cart-overlay").addEventListener("click", () => showDrawer(false));
$("checkout-button").addEventListener("click", checkout);
$("owner-open").addEventListener("click", openOwner);
$("view-orders").addEventListener("click", () => { renderOrders(); showModal("orders-modal"); });
$("cancel-edit").addEventListener("click", resetFoodForm);
$$("[data-close]").forEach(b => b.addEventListener("click", () => showModal(b.dataset.close, false)));
$$(".modal-backdrop").forEach(back => back.addEventListener("click", e => { if (e.target === back) back.classList.remove("show"); }));
$$(".owner-tab").forEach(b => b.addEventListener("click", () => {
  $$(".owner-tab").forEach(x => x.classList.toggle("active", x === b));
  $("owner-manage").classList.toggle("hidden", b.dataset.ownerTab !== "manage");
  $("owner-orders").classList.toggle("hidden", b.dataset.ownerTab !== "orders");
}));

/* ---------- init ---------- */
function init() {
  const { brand } = CONFIG;
  document.title = `${brand.name}${brand.accent} | University of Ruhuna Canteens`;
  $$("[data-brand-mark]").forEach(el => el.textContent = brand.mark);
  $$("[data-brand-name]").forEach(el => el.innerHTML = `${esc(brand.name)}<span class="brand-green">${esc(brand.accent)}</span>`);
  $("footer-tagline").textContent = CONFIG.tagline;
  $("hero-count").textContent = `${C.length} canteens, 5 campuses`;
  const opts = C.map(c => `<option>${esc(c)}</option>`).join(""), cats = Object.keys(CATEGORIES).map(c => `<option>${c}</option>`).join("");
  $("canteen-filter").innerHTML = '<option value="All">All canteens</option>' + opts;
  $("category-filter").innerHTML = '<option value="All">All categories</option>' + cats;
  $("owner-canteen").innerHTML = opts; $("food-category").innerHTML = cats;
  $("today-date").textContent = new Date().toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const h = new Date().getHours(); activeMeal = h < 11 ? "Breakfast" : h < 15 ? "Lunch" : "Dinner";
  renderAll();
  const links = [...$$(".nav-link")];
  const spy = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting)
    links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id)); }), { rootMargin: "-40% 0px -55% 0px" });
  links.forEach(l => { const sec = document.querySelector(l.getAttribute("href")); if (sec) spy.observe(sec); });
}
init();