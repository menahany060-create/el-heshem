
let cart=[];

function add(name,price){
  let item=cart.find(i=>i.name===name);
  if(item) item.qty++;
  else cart.push({name,price,qty:1});
  render();
}

function changeQty(i,v){
  cart[i].qty+=v;
  if(cart[i].qty<=0) cart.splice(i,1);
  render();
}

function render(){
  let box=document.getElementById("box");
  let total=document.getElementById("total");

  box.innerHTML="";
  let sum=0;

  cart.forEach((c,i)=>{
    sum+=c.price*c.qty;

    box.innerHTML+=`
      <div class="item">
        <span>${c.name}</span>
        <div>
          <button onclick="changeQty(${i},1)">+</button>
          ${c.qty}
          <button onclick="changeQty(${i},-1)">-</button>
        </div>
      </div>
    `;
  });

  total.innerText=sum;
  document.getElementById("cartCount").innerText =
cart.reduce((sum, item) => sum + item.qty, 0);
}

/* POPUP */
function openStory(t,x){
  document.getElementById("title").innerText=t;
  document.getElementById("text").innerText=x;
  document.getElementById("popup").classList.add("active");
}

function openSpecs(t,x){
  document.getElementById("title").innerText="المواصفات: "+t;
  document.getElementById("text").innerText=x;
  document.getElementById("popup").classList.add("active");
}

function openCheckout(){
  document.getElementById("checkout").classList.add("active");
}

function closePopup(){
  document.querySelectorAll(".popup").forEach(p=>p.classList.remove("active"));
}

/* WHATSAPP */
function send(){

  let name = document.getElementById("name").value;
  let address = document.getElementById("address").value;

  if(!name || !address){
    alert("املأ البيانات");
    return;
  }

  let total = 0;

  cart.forEach(c=>{
    total += c.price * c.qty;
  });
  let msg = "🛒 طلب جديد\n\n";
  msg += "الاسم: " + name + "\nالعنوان: " + address + "\n\n";

  cart.forEach(c=>{
    let t = c.price * c.qty;
    msg += `${c.name} x${c.qty} = ${t} جنيه\n`;
  });

  msg += "\n💰 الإجمالي: " + total;

  window.open("https://wa.me/201223136302?text=" + encodeURIComponent(msg));
}
function openCart(){
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  });
}
let slider = document.getElementById("slider");

/* زرار يمين وشمال */
function moveSlider(dir){
  slider.scrollBy({
    left: dir * 150,
    behavior: "smooth"
  });
}

/* Auto Scroll */
setInterval(()=>{
  if(slider.scrollLeft + slider.clientWidth >= slider.scrollWidth){
    slider.scrollTo({left:0, behavior:"smooth"});
  }else{
    slider.scrollBy({left:120, behavior:"smooth"});
  }
}, 3000);
function quickAdd(name, price){
  add(name, price);
}
setInterval(()=>{
  let slider = document.getElementById("slider");

  if(slider.scrollLeft + slider.clientWidth >= slider.scrollWidth){
    slider.scrollTo({left:0, behavior:"smooth"});
  }else{
    slider.scrollBy({left:140, behavior:"smooth"});
  }
}, 2500);
document.querySelectorAll(".fill").forEach(bar=>{
  let value = bar.getAttribute("data-caffeine");
  let percentText = bar.querySelector(".percent");

  // تحديد اللون
  if(value < 60){
    bar.classList.add("low");
  }else if(value < 80){
    bar.classList.add("medium");
  }else if(value < 95){
    bar.classList.add("high");
  }else{
    bar.classList.add("extreme");
  }

  // أنيميشن العرض
  setTimeout(()=>{
    bar.style.width = value + "%";
  }, 300);

  // عداد الأرقام
  let count = 0;
  let interval = setInterval(()=>{
    if(count >= value){
      clearInterval(interval);
    }else{
      count++;
      percentText.innerText = count + "%";
    }
  }, 15);
});