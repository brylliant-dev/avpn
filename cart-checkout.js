(function () {
  const FORM_ID = "checkout-form";
  const MOUNT = "/app"; // update if your Webflow Cloud mount differs
  const API_BASE = `${window.location.origin}${MOUNT}`;
  const CART_KEY = "cart_v1";

  const fmt = (n) =>
    "₱" + Number(n).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  function normalizeItems(items) {
    return (Array.isArray(items) ? items : [])
      .map((it) => ({
        webflow_slug: it.webflow_slug || it.slug || "",
        qty: Math.max(1, Number(it.qty ?? it.quantity ?? it.count ?? 1)),
        meta: it.meta || { name: it.name, price: it.price, image: it.image, tag: it.tag, color: it.color }
      }))
      .filter((x) => x.webflow_slug);
  }

  function readLocalCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const data = raw ? JSON.parse(raw) : { items: [] };
      const arr = Array.isArray(data) ? data : Array.isArray(data.items) ? data.items : [];
      return normalizeItems(arr);
    } catch {
      return [];
    }
  }

  function writeLocalCart(items) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify({ items }));
    } catch {
      /* ignore */
    }
  }

  function getCartItems() {
    if (window.Cart?.getCart) {
      return normalizeItems(window.Cart.getCart().items || []);
    }
    return readLocalCart();
  }

  function setQty(slug, qty) {
    if (window.Cart?.setQty) {
      window.Cart.setQty({ webflow_slug: slug, qty });
      return;
    }
    const items = readLocalCart();
    const next = items.map((item) => (item.webflow_slug === slug ? { ...item, qty } : item));
    writeLocalCart(next);
  }

  function removeItem(slug) {
    if (window.Cart?.removeItem) {
      window.Cart.removeItem({ webflow_slug: slug });
      return;
    }
    const items = readLocalCart().filter((item) => item.webflow_slug !== slug);
    writeLocalCart(items);
  }

  async function validateZip(zip) {
    const res = await fetch(`${API_BASE}/api/zone-validate?zip=${encodeURIComponent(zip)}`);
    if (!res.ok) throw new Error("ZIP validation failed.");
    return res.json();
  }

  function ensureZipError(zipInput) {
    let el = document.getElementById("zip-error");
    if (!el) {
      el = document.createElement("div");
      el.id = "zip-error";
      el.style.display = "none";
      el.style.color = "#d00";
      el.style.marginTop = "6px";
      zipInput.insertAdjacentElement("afterend", el);
    }
    return el;
  }

  function showZipError(msg, zipInput) {
    const el = ensureZipError(zipInput);
    el.textContent = msg || "";
    el.style.display = msg ? "" : "none";
    if (msg) zipInput?.focus({ preventScroll: false });
  }

  document.addEventListener("DOMContentLoaded", () => {
    /* Cart rendering */
    const $list = document.querySelector("[data-cart-list]");
    const $tpl = document.querySelector("[data-cart-template]");
    const $total = document.querySelector("[data-cart-total]");
    const $subtotal = document.querySelector("[data-subtotal]");
    const $totalItem = document.querySelector("[data-total-item]");

    function updateCartItemCount(items) {
      if ($totalItem) {
        const count = items.reduce((sum, item) => sum + Math.max(1, Number(item.qty || 1)), 0);
        if (typeof $ === "function") {
          $($totalItem).text(count);
        } else {
          $totalItem.textContent = String(count);
        }
      }
    }

    function renderCart() {
      if (!$list || !$tpl) return;

      // Clear all rows except template
      [...$list.children].forEach((ch) => {
        if (ch !== $tpl) ch.remove();
      });

      const items = getCartItems();
      updateCartItemCount(items);

      if (!items.length) {
        const empty = document.createElement("div");
        empty.textContent = "Your cart is empty.";
        $list.appendChild(empty);

        if ($total) $total.textContent = fmt(0);
        if ($subtotal) $subtotal.textContent = fmt(0);
        return;
      }

      let est = 0;

      items.forEach((it) => {
        const name = it.meta?.name ?? it.webflow_slug;
        const price = Number(it.meta?.price ?? 0);
        const line = price * it.qty;
        const image = it.meta?.image ?? "";
        const tag = it.meta?.tag ?? "";
        const color = it.meta?.color ?? "";

        const row = $tpl.cloneNode(true);
        row.style.display = "";
        row.removeAttribute("data-cart-template");
        row.dataset.slug = it.webflow_slug;

        const $name = row.querySelector("[data-name]");
        const $price = row.querySelector("[data-price]");
        const $line = row.querySelector("[data-line]");
        const $qty = row.querySelector("[data-qty]");
        const $img = row.querySelector("[data-image]");
        const $tag = row.querySelector("[data-tag]");
        const $color = row.querySelector("[data-color]");

        if ($name) $name.textContent = name;
        if ($price) $price.textContent = fmt(price);
        if ($line) $line.textContent = fmt(line);
        if ($qty) $qty.value = it.qty;
        if ($img) $img.src = image;
        if ($tag) $tag.textContent = tag;
        if ($color) $color.textContent = color;

        const $colorContainer = row.querySelector("[data-color-container]");
        if ($colorContainer) {
          const colorValue = (color || "").trim();
          $colorContainer.style.display = colorValue === "" ? "none" : "";
        }

        const minus = row.querySelector("[data-minus]");
        const plus = row.querySelector("[data-plus]");
        const rm = row.querySelector("[data-remove]");

        const updateQty = (next) => {
          const qty = Math.max(1, next);
          setQty(it.webflow_slug, qty);
          renderCart();
        };

        minus?.addEventListener("click", () => updateQty(parseInt($qty?.value || "1", 10) - 1));
        plus?.addEventListener("click", () => updateQty(parseInt($qty?.value || "1", 10) + 1));

        rm?.addEventListener("click", () => {
          removeItem(it.webflow_slug);
          renderCart();
        });

        $qty?.addEventListener("change", () => {
          const next = Math.max(1, parseInt($qty.value || "1", 10));
          setQty(it.webflow_slug, next);
          renderCart();
        });

        $list.appendChild(row);
        est += line;
      });

      const rows = [...$list.children].filter((ch) => ch !== $tpl && ch.nodeType === 1);
      if (rows.length) {
        rows.forEach((r) => {
          r.style.borderBottom = "";
        });
        const lastRow = rows[rows.length - 1];
        lastRow.style.borderBottom = "0px";
      }

      if ($total) $total.textContent = fmt(est);
      if ($subtotal) $subtotal.textContent = fmt(est);
    }

    renderCart();

    /* Checkout form */
    const form = document.getElementById(FORM_ID);
    if (!form) return;

    const zipInput = form.querySelector("[name='zip']");
    zipInput?.addEventListener("input", () => showZipError("", zipInput));

    form.setAttribute("action", "");
    let submitting = false;

    form.addEventListener(
      "submit",
      async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
        if (submitting) return;
        submitting = true;

        try {
          const items = getCartItems();
          if (!items.length) {
            alert("Your cart is empty.");
            return;
          }

          const zip = (zipInput?.value || "").trim();
          if (!zip) {
            showZipError("ZIP code is required.", zipInput);
            return;
          }

          showZipError("", zipInput);
          const zone = await validateZip(zip);
          if (!zone.ok) {
            showZipError("Sorry, we currently don’t deliver to this area.", zipInput);
            return;
          }

          const payload = {
            items, // [{ webflow_slug, qty, meta? }]
            zip,
            notes: form.notes?.value || "",
            deliveryDate: form.delivery_date?.value || "",
            deliveryWindow: form.delivery_window?.value || "",
            recipient: {
              name: form.customer_name?.value || "",
              phone: form.customer_phone?.value || ""
            },
            address: {
              line1: form.address_line?.value || "",
              city: form.city?.value || "",
              zip
            },
            returnUrl: window.location.origin + "/checkout/success"
          };

          const res = await fetch(`${API_BASE}/api/checkout-create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Idempotency-Key": self.crypto?.randomUUID?.() || String(Date.now())
            },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (!res.ok || !data.checkoutUrl) {
            alert(data?.error || "Checkout failed. Please try again.");
            return;
          }

          window.location.href = data.checkoutUrl;
        } catch (err) {
          showZipError("", zipInput);
          alert(err?.message || "Something went wrong. Please try again.");
        } finally {
          submitting = false;
        }
      },
      true
    );
  });
})();
