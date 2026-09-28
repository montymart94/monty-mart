// ================================
// MONTY MART - MAIN SCRIPT
// ================================

const products = [
  {
    id: 1,
    name: "খাঁটি দেশি ঘি 1kg",
    category: "ঘি",
    price: 1200,
    image: "assets/ghee-1kg.png"
  },
  {
    id: 2,
    name: "Black Seed Honey 1kg",
    category: "মধু",
    price: 1600,
    image: "assets/black-seed-honey.jpg"
  },
  {
    id: 3,
    name: "Sundarban Honey 1kg",
    category: "মধু",
    price: 2500,
    image: "assets/sundarban-honey.jpg"
  },
  {
    id: 4,
    name: "জিরা 500g",
    category: "জিরা",
    price: 450,
    image: "assets/cumin.jpg"
  },
  {
    id: 5,
    name: "Honey Nuts 800gm",
    category: "বাদাম",
    price: 1700,
    image: "assets/honey-nuts.jpg"
  },
  {
    id: 6,
    name: "Cashew Nuts Medium Size 1kg",
    category: "বাদাম",
    price: 2000,
    image: "assets/cashew.jpg"
  },
  {
    id: 7,
    name: "Almond 1kg",
    category: "কাঠবাদাম",
    price: 1600,
    image: "assets/almond.jpg"
  },
  {
    id: 8,
    name: "Walnut 250gm",
    category: "বাদাম",
    price: 500,
    image: "assets/walnut.jpg"
  },
  {
    id: 9,
    name: "Shahi Masala Combo",
    category: "অন্যান্য",
    price: 1700,
    image: "assets/shahi-masala.jpg"
  },
  {
    id: 10,
    name: "Gura Masala Combo (Mini Pack)",
    category: "অন্যান্য",
    price: 985,
    image: "assets/gura-masala.jpg"
  },
  {
    id: 11,
    name: "Chili (Morich) Powder 500g",
    category: "অন্যান্য",
    price: 400,
    image: "assets/chili.jpg"
  },
  {
    id: 12,
    name: "Deshi Mustard Oil 5 Liter",
    category: "অন্যান্য",
    price: 1700,
    image: "assets/mustard-oil.jpg"
  },
  {
    id: 13,
    name: "Ajwa Premium Fresh Dates 1kg",
    category: "অন্যান্য",
    price: 2500,
    image: "assets/ajwa-1kg.jpg"
  },
  {
    id: 14,
    name: "Ajwa Premium Fresh Dates 500g",
    category: "অন্যান্য",
    price: 1250,
    image: "assets/ajwa-500g.jpg"
  }
];

let cart = JSON.parse(localStorage.getItem("montyMartCart")) || [];
let selectedCategory = "সব";
let searchText = "";

// ================================
// ELEMENTS
// ================================

const grid = document.getElementById("grid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const itemsText = document.getElementById("itemsText");
const subtotalEl = document.getElementById("subtotal");
const deliveryEl = document.getElementById("delivery");
const totalEl = document.getElementById("total");
const areaEl = document.getElementById("area");
const toast = document.getElementById("toast");

// ================================
// MONEY
// ================================

function money(amount) {
  return "৳ " + Number(amount).toLocaleString("en-US");
}

// ================================
// SAVE CART
// ================================

function saveCart() {
  localStorage.setItem("montyMartCart", JSON.stringify(cart));
}

// ================================
// TOAST
// ================================

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// ================================
// PRODUCT FILTER
// ================================

function getFilteredProducts() {
  let result = [...products];

  if (selectedCategory !== "সব") {
    result = result.filter(
      product => product.category === selectedCategory
    );
  }

  if (searchText.trim()) {
    const text = searchText.toLowerCase();

    result = result.filter(product =>
      product.name.toLowerCase().includes(text) ||
      product.category.toLowerCase().includes(text)
    );
  }

  return result;
}

// ================================
// PRODUCT RENDER
// ================================

function renderProducts() {
  if (!grid) return;

  const list = getFilteredProducts();

  if (!list.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;background:#fff;padding:35px;text-align:center;border-radius:10px">
        <h3>😔 কোনো পণ্য পাওয়া যায়নি</h3>
        <p style="color:#777;margin-top:5px">অন্য কোনো পণ্য বা শব্দ দিয়ে খুঁজুন।</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(product => `
    <article class="product-card">

      <img
        src="${product.image}"
        alt="${product.name}"
        onerror="this.src='https://via.placeholder.com/400x300?text=Monty+Mart'"
      >

      <div class="product-info">

        <h3>${product.name}</h3>

        <div class="price">
          ${money(product.price)}
        </div>

        <div class="qty-control">
          <button onclick="changeProductQty(${product.id}, -1)">−</button>
          <span id="qty-${product.id}">1</span>
          <button onclick="changeProductQty(${product.id}, 1)">+</button>
        </div>

        <button
          class="add-cart"
          onclick="addToCart(${product.id})"
        >
          🛒 কার্টে যোগ করুন
        </button>

      </div>
    </article>
  `).join("");
}

// ================================
// PRODUCT QUANTITY
// ================================

const productQty = {};

function changeProductQty(id, amount) {
  if (!productQty[id]) {
    productQty[id] = 1;
  }

  productQty[id] += amount;

  if (productQty[id] < 1) {
    productQty[id] = 1;
  }

  const el = document.getElementById("qty-" + id);

  if (el) {
    el.textContent = productQty[id];
  }
}

// ================================
// ADD TO CART
// ================================

function addToCart(id) {
  const product = products.find(p => p.id === id);

  if (!product) return;

  const quantity = productQty[id] || 1;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: quantity
    });
  }

  productQty[id] = 1;

  saveCart();
  renderCart();

  showToast("✅ পণ্যটি কার্টে যোগ হয়েছে");
}

// ================================
// CART RENDER
// ================================

function renderCart() {
  if (!cartItems) return;

  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty">
        আপনার কার্ট এখনো খালি।<br>
        পণ্য যোগ করুন।
      </div>
    `;
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">

        <img
          src="${item.image}"
          alt="${item.name}"
          onerror="this.src='https://via.placeholder.com/100x100?text=Product'"
        >

        <div class="cart-item-info">

          <b>${item.name}</b>

          <div>
            ${money(item.price)} × ${item.qty}
          </div>

          <div class="cart-qty">
            <button onclick="changeCartQty(${item.id}, -1)">−</button>

            <span>${item.qty}</span>

            <button onclick="changeCartQty(${item.id}, 1)">+</button>

            <button
              onclick="removeFromCart(${item.id})"
              style="margin-left:auto;color:#d33"
            >
              ✕
            </button>
          </div>

        </div>

      </div>
    `).join("");
  }

  updateTotals();
}

// ================================
// CHANGE CART QUANTITY
// ================================

function changeCartQty(id, amount) {
  const item = cart.find(item => item.id === id);

  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    cart = cart.filter(item => item.id !== id);
  }

  saveCart();
  renderCart();
}

// ================================
// REMOVE CART ITEM
// ================================

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);

  saveCart();
  renderCart();

  showToast("পণ্যটি কার্ট থেকে সরানো হয়েছে");
}

// ================================
// TOTAL
// ================================

function updateTotals() {
  const itemCount = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const delivery = areaEl
    ? Number(areaEl.value || 70)
    : 70;

  const total = subtotal + delivery;

  if (cartCount) {
    cartCount.textContent = itemCount;
  }

  if (itemsText) {
    itemsText.textContent = itemCount + " পণ্য";
  }

  if (subtotalEl) {
    subtotalEl.textContent = money(subtotal);
  }

  if (deliveryEl) {
    deliveryEl.textContent = money(delivery);
  }

  if (totalEl) {
    totalEl.textContent = money(total);
  }
}

// ================================
// SEARCH
// ================================

const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");

if (searchInput) {
  searchInput.addEventListener("input", function () {
    searchText = this.value;
    renderProducts();
  });

  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      searchText = this.value;
      renderProducts();

      document
        .getElementById("products")
        ?.scrollIntoView({
          behavior: "smooth"
        });
    }
  });
}

if (searchBtn) {
  searchBtn.addEventListener("click", function () {
    searchText = searchInput ? searchInput.value : "";
    renderProducts();

    document
      .getElementById("products")
      ?.scrollIntoView({
        behavior: "smooth"
      });
  });
}

// ================================
// CATEGORY
// ================================

document.querySelectorAll("[data-cat]").forEach(link => {
  link.addEventListener("click", function () {

    selectedCategory = this.dataset.cat;

    renderProducts();

    document
      .getElementById("products")
      ?.scrollIntoView({
        behavior: "smooth"
      });
  });
});

// ================================
// SORT
// ================================

const sortEl = document.getElementById("sort");

if (sortEl) {
  sortEl.addEventListener("change", function () {

    let list = getFilteredProducts();

    if (this.value === "দাম: কম থেকে বেশি") {
      list.sort((a, b) => a.price - b.price);
    }

    if (this.value === "দাম: বেশি থেকে কম") {
      list.sort((a, b) => b.price - a.price);
    }

    grid.innerHTML = list.map(product => `
      <article class="product-card">

        <img
          src="${product.image}"
          alt="${product.name}"
          onerror="this.src='https://via.placeholder.com/400x300?text=Monty+Mart'"
        >

        <div class="product-info">

          <h3>${product.name}</h3>

          <div class="price">
            ${money(product.price)}
          </div>

          <div class="qty-control">
            <button onclick="changeProductQty(${product.id}, -1)">−</button>
            <span id="qty-${product.id}">1</span>
            <button onclick="changeProductQty(${product.id}, 1)">+</button>
          </div>

          <button
            class="add-cart"
            onclick="addToCart(${product.id})"
          >
            🛒 কার্টে যোগ করুন
          </button>

        </div>
      </article>
    `).join("");
  });
}

// ================================
// CART BUTTON
// ================================

const cartBtn = document.getElementById("cartBtn");

if (cartBtn) {
  cartBtn.addEventListener("click", function () {
    document
      .getElementById("order")
      ?.scrollIntoView({
        behavior: "smooth"
      });
  });
}

// ================================
// DELIVERY AREA
// ================================

if (areaEl) {
  areaEl.addEventListener("change", updateTotals);
}

// ================================
// MENU DRAWER
// ================================

const menuBtn = document.getElementById("menuBtn");
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const closeMenu = document.getElementById("closeMenu");

function openDrawer() {
  drawer?.classList.add("open");
  overlay?.classList.add("show");
}

function closeDrawer() {
  drawer?.classList.remove("open");
  overlay?.classList.remove("show");
}

if (menuBtn) {
  menuBtn.addEventListener("click", openDrawer);
}

if (closeMenu) {
  closeMenu.addEventListener("click", closeDrawer);
}

if (overlay) {
  overlay.addEventListener("click", closeDrawer);
}

document.querySelectorAll(".drawer a").forEach(link => {
  link.addEventListener("click", closeDrawer);
});

// ================================
// LOGIN MODAL
// ================================

const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const loginSubmit = document.getElementById("loginSubmit");
const loginPhone = document.getElementById("loginPhone");
const loginStatus = document.getElementById("loginStatus");

function openLogin() {
  loginModal?.classList.add("show");
}

function closeLogin() {
  loginModal?.classList.remove("show");
}

if (loginBtn) {
  loginBtn.addEventListener("click", openLogin);
}

document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", closeLogin);
});

if (loginModal) {
  loginModal.addEventListener("click", function (e) {
    if (e.target === loginModal) {
      closeLogin();
    }
  });
}

if (loginSubmit) {
  loginSubmit.addEventListener("click", function () {

    const phone = loginPhone.value.trim();

    if (!/^01[0-9]{9}$/.test(phone)) {
      loginStatus.textContent =
        "⚠️ সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।";
      loginStatus.style.color = "#d33";
      return;
    }

    localStorage.setItem("montyMartPhone", phone);

    loginStatus.textContent =
      "✅ লগইন তথ্য সংরক্ষণ হয়েছে।";
    loginStatus.style.color = "green";

    setTimeout(() => {
      closeLogin();
    }, 1000);
  });
}

// ================================
// CHAT BUTTON
// ================================

const chatBtn = document.getElementById("chatBtn");

if (chatBtn) {
  chatBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const phone = "8801XXXXXXXXX";

    window.open(
      "https://wa.me/" + phone,
      "_blank"
    );
  });
}

// ================================
// ORDER CONFIRM
// ================================

const confirmBtn = document.getElementById("confirm");

if (confirmBtn) {
  confirmBtn.addEventListener("click", function () {

    const name = document.getElementById("name")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const address = document.getElementById("address")?.value.trim();

    if (!cart.length) {
      showToast("⚠️ আগে কার্টে পণ্য যোগ করুন।");
      return;
    }

    if (!name) {
      showToast("⚠️ আপনার নাম লিখুন।");
      document.getElementById("name")?.focus();
      return;
    }

    if (!/^01[0-9]{9}$/.test(phone)) {
      showToast("⚠️ সঠিক মোবাইল নম্বর দিন।");
      document.getElementById("phone")?.focus();
      return;
    }

    if (!address) {
      showToast("⚠️ সম্পূর্ণ ঠিকানা লিখুন।");
      document.getElementById("address")?.focus();
      return;
    }

    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    const delivery = Number(areaEl?.value || 70);
    const total = subtotal + delivery;

    const orderId =
      "MM" +
      Date.now().toString().slice(-8);

    const order = {
      orderId,
      date: new Date().toLocaleString("bn-BD"),
      name,
      phone,
      address,
      products: cart.map(
        item => `${item.name} × ${item.qty}`
      ).join(", "),
      subtotal,
      delivery,
      total
    };

    console.log("NEW ORDER:", order);

    /*
      GOOGLE SHEET CONNECTION
      --------------------------------
      পরে এখানে Google Apps Script URL
      বসানো হবে।

      এখন order browser console-এ
      তৈরি হচ্ছে।
    */

    alert(
      "✅ অর্ডার সফলভাবে নেওয়া হয়েছে!\n\n" +
      "Order ID: " + orderId + "\n" +
      "মোট: " + money(total)
    );

    cart = [];

    saveCart();
    renderCart();

    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("address").value = "";

  });
}

// ================================
// INITIAL LOAD
// ================================

renderProducts();
renderCart();
updateTotals();

console.log("Monty Mart loaded successfully!");
