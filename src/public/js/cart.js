// Cart page: renders the cart stored in localStorage and lets the user
// change quantities, remove items or empty the cart. Uses ui.js helpers.

const cartRoot = document.getElementById("cart-root");

function money(value) {
  return `$${Number(value).toFixed(2)}`;
}

function renderEmpty() {
  cartRoot.innerHTML = `
    <div class="empty-cart">
      <p class="empty-cart-msg">Tu carrito está vacío 🛒</p>
      <a class="btn btn-primary" href="/products">Ver productos</a>
    </div>`;
}

function renderItems(cid, items) {
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const rows = items
    .map(
      (i) => `
      <tr data-pid="${i.product._id}">
        <td>${i.product.title}</td>
        <td>${money(i.product.price)}</td>
        <td>
          <div class="qty-controls">
            <button class="qty-btn" data-action="dec" aria-label="Disminuir">−</button>
            <span class="qty">${i.quantity}</span>
            <button class="qty-btn" data-action="inc" aria-label="Aumentar">+</button>
          </div>
        </td>
        <td>${money(i.product.price * i.quantity)}</td>
        <td><button class="btn btn-danger btn-sm" data-action="remove">Eliminar</button></td>
      </tr>`
    )
    .join("");

  cartRoot.innerHTML = `
    <table class="cart-table">
      <thead>
        <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="3" class="total-label">Total</td>
          <td class="total">${money(total)}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
    <div class="cart-actions">
      <a class="btn btn-ghost" href="/products">← Seguir comprando</a>
      <button class="btn btn-danger" id="empty-cart">Vaciar carrito</button>
    </div>`;

  attachHandlers(cid);
}

function attachHandlers(cid) {
  cartRoot.querySelectorAll("tr[data-pid]").forEach((row) => {
    const pid = row.dataset.pid;

    row.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const current = parseInt(row.querySelector(".qty").textContent, 10);
        const next = btn.dataset.action === "inc" ? current + 1 : current - 1;
        try {
          if (next <= 0) {
            await fetch(`/api/carts/${cid}/products/${pid}`, { method: "DELETE" });
            showToast("Producto eliminado", "success");
          } else {
            await fetch(`/api/carts/${cid}/products/${pid}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ quantity: next }),
            });
          }
          await loadCart();
        } catch {
          showToast("⚠️ No se pudo actualizar la cantidad", "error");
        }
      });
    });

    row.querySelector('[data-action="remove"]').addEventListener("click", async () => {
      try {
        await fetch(`/api/carts/${cid}/products/${pid}`, { method: "DELETE" });
        showToast("Producto eliminado", "success");
        await loadCart();
      } catch {
        showToast("⚠️ No se pudo eliminar el producto", "error");
      }
    });
  });

  const emptyBtn = document.getElementById("empty-cart");
  if (emptyBtn) {
    emptyBtn.addEventListener("click", async () => {
      try {
        await fetch(`/api/carts/${cid}`, { method: "DELETE" });
        showToast("Carrito vaciado", "success");
        await loadCart();
      } catch {
        showToast("⚠️ No se pudo vaciar el carrito", "error");
      }
    });
  }
}

async function loadCart() {
  const cid = getCartId();
  if (!cid) {
    renderEmpty();
    updateCartBadge();
    return;
  }

  try {
    const res = await fetch(`/api/carts/${cid}`);
    if (!res.ok) {
      renderEmpty();
      updateCartBadge();
      return;
    }
    const { payload } = await res.json();
    const items = (payload?.products || []).filter((i) => i.product);
    if (!items.length) {
      renderEmpty();
    } else {
      renderItems(cid, items);
    }
    updateCartBadge();
  } catch {
    cartRoot.innerHTML = `<div class="empty-cart"><p class="empty-cart-msg">⚠️ No se pudo cargar el carrito</p></div>`;
  }
}

document.addEventListener("DOMContentLoaded", loadCart);
