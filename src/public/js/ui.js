// Shared UI helpers (loaded on every page via the layout).
// Owns the localStorage cart id, toast notifications and the navbar cart badge.

const CART_KEY = "cartId";

function getCartId() {
  return localStorage.getItem(CART_KEY);
}

function setCartId(id) {
  localStorage.setItem(CART_KEY, id);
}

function clearCartId() {
  localStorage.removeItem(CART_KEY);
}

function showToast(message, type = "success") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

async function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;

  const cid = getCartId();
  if (!cid) {
    badge.textContent = "0";
    badge.classList.remove("has-items");
    return;
  }

  try {
    const res = await fetch(`/api/carts/${cid}`);
    if (!res.ok) {
      badge.textContent = "0";
      badge.classList.remove("has-items");
      return;
    }
    const { payload } = await res.json();
    const count = (payload?.products || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
    badge.textContent = String(count);
    badge.classList.toggle("has-items", count > 0);
  } catch {
    badge.textContent = "0";
    badge.classList.remove("has-items");
  }
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
