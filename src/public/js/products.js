// Products page: wires each "Agregar al carrito" button to the cart API.
// Relies on helpers defined in ui.js (getCartId / setCartId / showToast / updateCartBadge).

async function ensureCart() {
  const existing = getCartId();
  if (existing) return existing;

  const res = await fetch("/api/carts", { method: "POST" });
  if (!res.ok) throw new Error("No se pudo crear el carrito");
  const data = await res.json();
  const id = data.payload.newCart._id;
  setCartId(id);
  return id;
}

async function addToCart(pid, quantity) {
  const cid = await ensureCart();
  const res = await fetch(`/api/carts/${cid}/products/${pid}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "No se pudo agregar el producto");
  }
  return res.json();
}

document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const pid = btn.dataset.id;
    const card = btn.closest(".product-card");
    const qtyInput = card.querySelector(".qty-input");
    const quantity = Math.max(1, parseInt(qtyInput?.value, 10) || 1);

    btn.disabled = true;
    try {
      await addToCart(pid, quantity);
      showToast("✅ Producto agregado al carrito", "success");
      updateCartBadge();
    } catch (err) {
      showToast(`⚠️ ${err.message}`, "error");
    } finally {
      btn.disabled = false;
    }
  });
});
