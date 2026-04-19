// ===== CART (localStorage) =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== ADD PRODUCT FROM CARD =====
function addProduct(btn, name) {
  let card = btn.parentElement;
  let select = card.querySelector("select");
  let [weight, price] = select.value.split("-");
  add(name + " (" + weight + "g)", Number(price));
}

function updatePrice(select) {
  let card = select.parentElement;
  let priceText = card.querySelector("p");
  if (priceText) {
    let price = select.value.split("-")[1];
    priceText.innerText = price + " جنيه";
  }
}

// ===== ADD ITEM =====
function add(name, price) {
  let item = cart.find(i => i.name === name);
  if (item) {
    item.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  render();
  showToast("✅ تمت الإضافة للسلة");
}

// ===== CHANGE QTY =====
function changeQty(i, v) {
  cart[i].qty += v;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  render();
}

// ===== RENDER CART =====
function render() {
  let box = document.getElementById("box");
  let total = document.getElementById("total");
  if (!box || !total) return;

  box.innerHTML = "";
  let sum = 0;

  cart.forEach((c, i) => {
    sum += c.price * c.qty;
    box.innerHTML += `
      <div class="item">
        <div class="left"><span>${c.name}</span></div>
        <div class="right"><span>${c.price * c.qty} جنيه</span></div>
        <div class="qty">
          <button onclick="changeQty(${i}, 1)">+</button>
          <span>${c.qty}</span>
          <button onclick="changeQty(${i}, -1)">−</button>
        </div>
      </div>`;
  });

  total.innerText = sum;
  document.getElementById("cartCount").innerText =
    cart.reduce((s, item) => s + item.qty, 0);

  localStorage.setItem("cart", JSON.stringify(cart));
}

// ===== POPUPS =====
function openStory(t, x) {
  document.getElementById("title").innerText = t;
  document.getElementById("text").innerText = x;
  document.getElementById("popup").classList.add("active");
}

function openSpecs(t, x) {
  document.getElementById("title").innerText = "المواصفات: " + t;
  document.getElementById("text").innerText = x;
  document.getElementById("popup").classList.add("active");
}

function openCheckout() {
  document.getElementById("checkout").classList.add("active");
}

function closePopup() {
  document.querySelectorAll(".popup").forEach(p => p.classList.remove("active"));
}

// ===== WHATSAPP ORDER =====
function send() {
  if (cart.length === 0) { showToast("🛒 السلة فارغة!"); return; }

  let name    = document.getElementById("name").value.trim();
  let phone   = document.getElementById("phone") ? document.getElementById("phone").value.trim() : "";
  let address = document.getElementById("address").value.trim();

  if (!name || !address) { showToast("⚠️ من فضلك املأ بياناتك"); return; }

  let total = 0;
  let msg = "🛒 *طلب جديد - بن الحشم*\n\n";
  msg += "👤 الاسم: " + name + "\n";
  if (phone) msg += "📞 الهاتف: " + phone + "\n";
  msg += "📍 العنوان: " + address + "\n\n";
  msg += "─────────────\n";

  cart.forEach(c => {
    let t = c.price * c.qty;
    total += t;
    msg += `☕ ${c.name} × ${c.qty} = ${t} جنيه\n`;
  });

  msg += "─────────────\n";
  msg += "💰 *الإجمالي: " + total + " جنيه*";

  window.open("https://wa.me/201223136302?text=" + encodeURIComponent(msg));

  cart = [];
  localStorage.removeItem("cart");
  render();
  closePopup();
  showToast("✅ تم إرسال طلبك!");
}

// ===== OPEN CART =====
function openCart() {
  let cartEl = document.querySelector(".cart");
  if (cartEl) cartEl.scrollIntoView({ behavior: "smooth", block: "center" });
}

// ===== MENU =====
function toggleMenu() {
  document.getElementById("navMenu").classList.toggle("open");
  document.getElementById("menuBtn").classList.toggle("open");
}

function closeMenu() {
  document.getElementById("navMenu").classList.remove("open");
  document.getElementById("menuBtn").classList.remove("open");
}

document.addEventListener("click", function (e) {
  let menu = document.getElementById("navMenu");
  let btn  = document.getElementById("menuBtn");
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
    closeMenu();
  }
});

// ===== TOAST =====
function showToast(msg) {
  let existing = document.querySelector(".toast");
  if (existing) existing.remove();

  let t = document.createElement("div");
  t.className = "toast";
  t.innerText = msg;
  Object.assign(t.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(0,240,255,0.95)",
    color: "#000",
    padding: "14px 24px",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "15px",
    boxShadow: "0 0 20px #00f0ff",
    zIndex: "999999",
    opacity: "0",
    transition: "opacity 0.3s",
    fontFamily: "'Tajawal', sans-serif",
    textAlign: "center",
    maxWidth: "280px",
    lineHeight: "1.5"
  });

  document.body.appendChild(t);
  setTimeout(() => t.style.opacity = "1", 50);
  setTimeout(() => {
    t.style.opacity = "0";
    setTimeout(() => t.remove(), 300);
  }, 1800);
}

// ===== INFINITE SLIDER =====
let slider;
let sliderInterval;
let isTransitioning = false;

function initInfiniteSlider() {
  slider = document.getElementById("slider");
  if (!slider) return;

  // Clone all cards and append at end + prepend at start
  let cards = Array.from(slider.children);
  let cardCount = cards.length;

  // Clone at end
  cards.forEach(card => {
    let clone = card.cloneNode(true);
    clone.setAttribute("data-clone", "end");
    slider.appendChild(clone);
  });

  // Clone at start
  cards.forEach(card => {
    let clone = card.cloneNode(true);
    clone.setAttribute("data-clone", "start");
    slider.insertBefore(clone, slider.firstChild);
  });

  // Start after the first set of clones
  let cardWidth = cards[0].offsetWidth + 10; // 10 = gap
  slider.style.scrollBehavior = "auto";
  slider.scrollLeft = cardWidth * cardCount;
  slider.style.scrollBehavior = "smooth";

  // Auto scroll
  sliderInterval = setInterval(() => {
    if (isTransitioning) return;
    scrollNext();
  }, 2500);
}

function scrollNext() {
  if (!slider) return;
  isTransitioning = true;

  let cards = slider.querySelectorAll(".slide-card:not([data-clone])");
  let cardWidth = cards[0] ? cards[0].offsetWidth + 10 : 150;
  let totalOriginal = cards.length * cardWidth;

  slider.style.scrollBehavior = "smooth";
  slider.scrollBy({ left: cardWidth, behavior: "smooth" });

  setTimeout(() => {
    // If we scrolled into the end clones, jump back silently
    let endClones = slider.querySelectorAll("[data-clone='end']");
    if (endClones.length > 0) {
      let firstEndClone = endClones[0];
      let firstEndPos = firstEndClone.offsetLeft;
      if (slider.scrollLeft >= firstEndPos - cardWidth) {
        slider.style.scrollBehavior = "auto";
        slider.scrollLeft -= totalOriginal;
        setTimeout(() => {
          slider.style.scrollBehavior = "smooth";
        }, 50);
      }
    }
    isTransitioning = false;
  }, 500);
}

function scrollPrev() {
  if (!slider) return;
  isTransitioning = true;

  let cards = slider.querySelectorAll(".slide-card:not([data-clone])");
  let cardWidth = cards[0] ? cards[0].offsetWidth + 10 : 150;
  let totalOriginal = cards.length * cardWidth;

  slider.style.scrollBehavior = "smooth";
  slider.scrollBy({ left: -cardWidth, behavior: "smooth" });

  setTimeout(() => {
    let startClones = slider.querySelectorAll("[data-clone='start']");
    if (startClones.length > 0) {
      let lastStartClone = startClones[startClones.length - 1];
      let lastStartPos = lastStartClone.offsetLeft + lastStartClone.offsetWidth;
      if (slider.scrollLeft <= lastStartPos - cardWidth) {
        slider.style.scrollBehavior = "auto";
        slider.scrollLeft += totalOriginal;
        setTimeout(() => {
          slider.style.scrollBehavior = "smooth";
        }, 50);
      }
    }
    isTransitioning = false;
  }, 500);
}

function moveSlider(dir) {
  if (dir === 1) scrollNext();
  else scrollPrev();
}

// ===== INIT =====
window.onload = function () {
  render();
  initInfiniteSlider();

  // Caffeine bars
  document.querySelectorAll(".fill").forEach(bar => {
    let value = Number(bar.getAttribute("data-caffeine"));
    let percentText = bar.querySelector(".percent");

    if (value < 60)       bar.classList.add("low");
    else if (value < 80)  bar.classList.add("medium");
    else if (value < 95)  bar.classList.add("high");
    else                  bar.classList.add("extreme");

    setTimeout(() => { bar.style.width = value + "%"; }, 300);

    let count = 0;
    let interval = setInterval(() => {
      if (count >= value) { clearInterval(interval); return; }
      count++;
      if (percentText) percentText.innerText = count + "%";
    }, 15);
  });
};
