function addProduct(btn, name){

  let card = btn.parentElement;
  let select = card.querySelector("select");

  let [weight, price] = select.value.split("-");

  add(name + " (" + weight + "g)", Number(price));
}
function updatePrice(select){

  let card = select.parentElement;
  let priceText = card.querySelector("p");

  let price = select.value.split("-")[1];

  priceText.innerText = price + " جنيه";
}
// ===== CART (محفوظ في localStorage) =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== ADD ITEM =====
function add(name, price){
  let item = cart.find(i => i.name === name);
  if(item){
    item.qty++;
  } else {
    cart.push({name, price, qty:1});
  }
  render();
  showToast("تمت الإضافة للسلة ✅");
}

// ===== CHANGE QTY =====
function changeQty(i, v){
  cart[i].qty += v;
  if(cart[i].qty <= 0){
    cart.splice(i, 1);
  }
  render();
}

// ===== RENDER CART =====
function render(){
  let box = document.getElementById("box");
  let total = document.getElementById("total");

  if(!box || !total) return;

  box.innerHTML = "";
  let sum = 0;

  cart.forEach((c, i)=>{
    sum += c.price * c.qty;

   box.innerHTML+=`
  <div class="item">
    
    <div class="left">
      <span>${c.name}</span>
    </div>

    <div class="right">
      <span>${c.price * c.qty} جنيه</span>
    </div>

    <div class="qty">
      <button onclick="changeQty(${i},1)">+</button>
      ${c.qty}
      <button onclick="changeQty(${i},-1)">-</button>
    </div>

  </div>
`;
  });

  total.innerText = sum;

  document.getElementById("cartCount").innerText =
    cart.reduce((sum, item) => sum + item.qty, 0);

  // 💾 حفظ السلة
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ===== POPUPS =====
function openStory(t, x){
  document.getElementById("title").innerText = t;
  document.getElementById("text").innerText = x;
  document.getElementById("popup").classList.add("active");
}

function openSpecs(t, x){
  document.getElementById("title").innerText = "المواصفات: " + t;
  document.getElementById("text").innerText = x;
  document.getElementById("popup").classList.add("active");
}

function openCheckout(){
  document.getElementById("checkout").classList.add("active");
}

function closePopup(){
  document.querySelectorAll(".popup").forEach(p =>
    p.classList.remove("active")
  );
}

// ===== WHATSAPP ORDER =====
function send(){
 if(cart.length === 0){
    showToast("🛒 السلة فارغة!");
    return; // نوقف الطلب
  }
  let name = document.getElementById("name").value;
  let address = document.getElementById("address").value;

  if(!name || !address){
    showToast("املأ البيانات");
    return;
  }

  let total = 0;
  let msg = "🛒 طلب جديد\n\n";

  msg += "الاسم: " + name + "\nالعنوان: " + address + "\n\n";

  cart.forEach(c=>{
    let t = c.price * c.qty;
    total += t;
    msg += `${c.name} x${c.qty} = ${t} جنيه\n`;
  });

  msg += "\n💰 الإجمالي: " + total;

  window.open(
    "https://wa.me/201223136302?text=" + encodeURIComponent(msg)
  );

  // 🧹 تفريغ السلة بعد الطلب (اختياري)
  cart = [];
  localStorage.removeItem("cart");
  render();
}

// ===== CART BUTTON =====
function openCart(){
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  });
}

// ===== SLIDER =====
let slider;

function moveSlider(dir){
  slider.scrollBy({
    left: dir * 150,
    behavior: "smooth"
  });
}

// ===== INIT =====
window.onload = function(){

  render();

  slider = document.getElementById("slider");

  // auto slider (مرة واحدة بس)
  setInterval(()=>{
    if(!slider) return;

    if(slider.scrollLeft + slider.clientWidth >= slider.scrollWidth){
      slider.scrollTo({left:0, behavior:"smooth"});
    } else {
      slider.scrollBy({left:120, behavior:"smooth"});
    }
  }, 3000);

  // caffeine bars animation
  document.querySelectorAll(".fill").forEach(bar=>{
    let value = Number(bar.getAttribute("data-caffeine"));
    let percentText = bar.querySelector(".percent");

    if(value < 60){
      bar.classList.add("low");
    } else if(value < 80){
      bar.classList.add("medium");
    } else if(value < 95){
      bar.classList.add("high");
    } else {
      bar.classList.add("extreme");
    }

    setTimeout(()=>{
      bar.style.width = value + "%";
    }, 300);

    let count = 0;
    let interval = setInterval(()=>{
      if(count >= value){
        clearInterval(interval);
      } else {
        count++;
        percentText.innerText = count + "%";
      }
    }, 15);
  });
};
function showToast(msg){
  let t = document.createElement("div");

  t.innerText = msg;

  t.style.position = "fixed";
  t.style.top = "50%";
  t.style.left = "50%";
  t.style.transform = "translate(-50%, -50%)";

  t.style.background = "rgba(0,240,255,0.95)";
  t.style.color = "#000";
  t.style.padding = "15px 25px";
  t.style.borderRadius = "12px";
  t.style.fontWeight = "bold";
  t.style.fontSize = "16px";
  t.style.boxShadow = "0 0 20px #00f0ff";
  t.style.zIndex = "99999";

  // دخول ناعم
  t.style.opacity = "0";
  t.style.transition = "0.3s";

  document.body.appendChild(t);

  setTimeout(()=>{
    t.style.opacity = "1";
  }, 50);

  // خروج بعد شوية
  setTimeout(()=>{
    t.style.opacity = "0";
    setTimeout(()=>t.remove(), 300);
  }, 1200);
}
