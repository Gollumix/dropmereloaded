/**
 * DROPME.CLOTHING — Product Detail Page (PDP) Logic
 * Balenciaga Dark Aesthetic
 */

(function () {
  'use strict';

  // --- Product Catalog Database ---
  const PRODUCTS = {
    cypher: {
      id: 'cypher',
      name: 'C Y P H E R T-SHIRT OVERSIZED',
      brand: 'DROPMEBUCH ARTIST EDITION • 280 GSM',
      price: 100,
      badge: 'EXCLUSIVE ARTIST DROP',
      images: [
        { url: 'img/cypherfront.png', label: 'FRONT VIEW' },
        { url: 'img/cypherback.png', label: 'BACK VIEW' }
      ],
      desc: 'Exclusive collaborative garment crafted in independent underground ateliers. Heavyweight custom blank with double-needle construction and hand-pulled silk screenprints on chest and back.',
      specs: [
        '280 GSM Heavyweight 100% Organic French Terry Cotton',
        'Dual-sided artisan screenprint (Chest & Back mural)',
        'Custom garment-dye vintage wash finish',
        'Drop-shoulder boxy silhouette with reinforced rib collar',
        'Individually numbered certification card included'
      ]
    },
    porntee: {
      id: 'porntee',
      name: 'CLASSIC P*RN T-SHIRT',
      brand: 'DROPMEBUCH CORE • HEAVY JERSEY',
      price: 100,
      badge: 'COLLECTOR PIECE',
      images: [
        { url: 'img/porntee.png', label: 'FRONT VIEW' }
      ],
      desc: 'The iconic provocative graphic that launched the label. High-density artisan screenprint on heavyweight jet-black custom blank with pre-shrunk vintage treatment.',
      specs: [
        '280 GSM Heavyweight Combed Cotton',
        'High-density signature screenprint',
        'Relaxed boxy streetwear fit',
        'Pre-shrunk vintage wash finish',
        'Reinforced ribbed crewneck collar'
      ]
    },
    skele: {
      id: 'skele',
      name: 'CLASSIC SKELE T-SHIRT',
      brand: 'DROPMEBUCH ARCHIVE • DISCHARGE PRINT',
      price: 100,
      badge: 'ARCHIVE VAULT DROP',
      images: [
        { url: 'img/skele.png', label: 'FRONT VIEW' }
      ],
      desc: 'Archival skeleton illustration crafted with high-precision discharge printing techniques for an ultra-soft hand feel that ages with distinct character.',
      specs: [
        '280 GSM Heavyweight Combed Cotton',
        'Discharge archival screenprint graphic',
        'Distressed collar & hemline detailing',
        'Classic Buch woven neck label',
        'Oversized drop-shoulder silhouette'
      ]
    }
  };

  // Determine product ID from URL parameter (default: cypher)
  const urlParams = new URLSearchParams(window.location.search);
  const currentProductId = (urlParams.get('id') && PRODUCTS[urlParams.get('id')]) ? urlParams.get('id') : 'cypher';
  const currentProduct = PRODUCTS[currentProductId];

  // --- Cart State synced via localStorage ---
  const state = {
    cart: JSON.parse(localStorage.getItem('dropme_cart') || '[]'),
    selectedSize: 'M',
    quantity: 1
  };

  // --- DOM Elements ---
  const pdpPageTitle = document.getElementById('pdpPageTitle');
  const pdpBreadcrumbTitle = document.getElementById('pdpBreadcrumbTitle');
  const pdpTitle = document.getElementById('pdpTitle');
  const pdpBrand = document.getElementById('pdpBrand');
  const pdpPrice = document.getElementById('pdpPrice');
  const pdpDesc = document.getElementById('pdpDesc');
  const pdpSpecsList = document.getElementById('pdpSpecsList');
  const pdpMainImg = document.getElementById('pdpMainImg');
  const pdpMainImgWrap = document.getElementById('pdpMainImgWrap');
  const pdpLens = document.getElementById('pdpLens');
  const pdpZoomHint = document.getElementById('pdpZoomHint');
  const pdpViewBadge = document.getElementById('pdpViewBadge');
  const pdpThumbsContainer = document.getElementById('pdpThumbsContainer');
  const pdpRelatedGrid = document.getElementById('pdpRelatedGrid');

  // Navigation & Drawer
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const closeMobileDrawer = document.getElementById('closeMobileDrawer');
  const mobileDrawer = document.getElementById('mobileDrawer');

  // Quantity & Add
  const qtyMinusBtn = document.getElementById('qtyMinusBtn');
  const qtyPlusBtn = document.getElementById('qtyPlusBtn');
  const qtyDisplay = document.getElementById('qtyDisplay');
  const pdpAddBtn = document.getElementById('pdpAddBtn');

  // Bag Drawer
  const bagBtn = document.getElementById('bagBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const headerBagCount = document.getElementById('headerBagCount');
  const drawerCartCount = document.getElementById('drawerCartCount');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const shippingText = document.getElementById('shippingText');
  const shippingBarFill = document.getElementById('shippingBarFill');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const toastContainer = document.getElementById('toastContainer');

  // Size Guide Modal
  const sizeModalBackdrop = document.getElementById('sizeModalBackdrop');
  const openSizeGuide = document.getElementById('openSizeGuide');
  const closeSizeGuide = document.getElementById('closeSizeGuide');

  // Mobile Drawer Controls
  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('active');
    });
  }

  if (closeMobileDrawer && mobileDrawer) {
    closeMobileDrawer.addEventListener('click', () => {
      mobileDrawer.classList.remove('active');
    });
  }

  // --- Populate Product Details ---
  function renderProductDetails() {
    if (pdpPageTitle) pdpPageTitle.textContent = `${currentProduct.name} — DROPMEBUCH`;
    if (pdpBreadcrumbTitle) pdpBreadcrumbTitle.textContent = currentProduct.name;
    if (pdpTitle) pdpTitle.textContent = currentProduct.name;
    if (pdpBrand) pdpBrand.textContent = currentProduct.brand;
    if (pdpPrice) pdpPrice.textContent = `${currentProduct.price} EUR`;
    if (pdpDesc) pdpDesc.textContent = currentProduct.desc;

    // Specs
    if (pdpSpecsList && currentProduct.specs) {
      pdpSpecsList.innerHTML = currentProduct.specs.map(spec => `<li>${spec}</li>`).join('');
    }

    // Images & Thumbnails
    if (currentProduct.images && currentProduct.images.length > 0) {
      pdpMainImg.src = currentProduct.images[0].url;
      pdpMainImg.alt = currentProduct.name;
      if (pdpViewBadge) pdpViewBadge.textContent = currentProduct.images[0].label;

      if (pdpThumbsContainer) {
        if (currentProduct.images.length > 1) {
          pdpThumbsContainer.style.display = 'flex';
          pdpThumbsContainer.innerHTML = currentProduct.images.map((img, idx) => `
            <div class="pdp-thumb ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
              <img src="${img.url}" alt="${img.label}">
            </div>
          `).join('');

          pdpThumbsContainer.querySelectorAll('.pdp-thumb').forEach(thumb => {
            thumb.addEventListener('click', () => {
              const idx = parseInt(thumb.dataset.idx, 10);
              pdpThumbsContainer.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('active'));
              thumb.classList.add('active');

              pdpMainImg.style.opacity = '0';
              setTimeout(() => {
                pdpMainImg.src = currentProduct.images[idx].url;
                if (pdpViewBadge) pdpViewBadge.textContent = currentProduct.images[idx].label;
                pdpMainImg.style.transformOrigin = 'center center';
                pdpMainImg.style.transform = 'scale(1)';
                if (pdpMainImgWrap) pdpMainImgWrap.classList.remove('is-zoomed');
                pdpMainImg.style.opacity = '1';
              }, 150);
            });
          });
        } else {
          pdpThumbsContainer.style.display = 'none';
        }
      }
    }

    // Curated Companion Pieces
    if (pdpRelatedGrid) {
      const otherKeys = Object.keys(PRODUCTS).filter(key => key !== currentProductId);
      pdpRelatedGrid.innerHTML = otherKeys.map(key => {
        const prod = PRODUCTS[key];
        return `
          <article class="balenciaga-product-card" data-id="${prod.id}">
            <span class="card-badge-tag">${prod.badge}</span>
            <a href="product.html?id=${prod.id}" class="product-card-link" aria-label="View ${prod.name}">
              <div class="balenciaga-image-wrap">
                <img class="img-front" src="${prod.images[0].url}" alt="${prod.name}" loading="lazy">
              </div>
              <div class="balenciaga-product-info">
                <div class="product-item-meta">${prod.brand}</div>
                <h2 class="product-item-title">${prod.name}</h2>
                <div class="product-item-price">${prod.price} EUR</div>
              </div>
            </a>
            <div class="product-card-actions">
              <a href="product.html?id=${prod.id}" class="btn-card-direct">
                VIEW PIECE &rarr;
              </a>
              <button type="button" class="btn-card-direct btn-quick-add" 
                      data-id="${prod.id}" 
                      data-name="${prod.name}" 
                      data-price="${prod.price}" 
                      data-img="${prod.images[0].url}">
                <i class="fa-solid fa-plus"></i> ADD TO BAG
              </button>
            </div>
          </article>
        `;
      }).join('');

      // Enable clicking anywhere on companion cards to navigate
      pdpRelatedGrid.querySelectorAll('.balenciaga-product-card').forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('.btn-quick-add') || e.target.closest('button')) return;
          const id = card.dataset.id;
          if (id) {
            window.location.href = `product.html?id=${id}`;
          }
        });
      });

      // Wire quick-add for companion pieces
      pdpRelatedGrid.querySelectorAll('.btn-quick-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const id = btn.dataset.id;
          const name = btn.dataset.name;
          const price = parseFloat(btn.dataset.price);
          const img = btn.dataset.img;
          const size = 'M';

          const existing = state.cart.find(item => item.id === id && item.size === size);
          if (existing) {
            existing.qty += 1;
          } else {
            state.cart.push({ id, name, price, img, size, qty: 1 });
          }

          saveCart();
          showToast(`Added ${name} [${size}] to bag`);
          openCart();
        });
      });
    }
  }

  // --- Interactive Magnifier Lens Zoom Logic (2.5x Zoom) ---
  if (pdpMainImgWrap && pdpMainImg && pdpLens) {
    let isZoomActive = false;

    pdpMainImgWrap.addEventListener('mouseenter', () => {
      isZoomActive = true;
      pdpMainImgWrap.classList.add('is-zoomed');
    });

    pdpMainImgWrap.addEventListener('mousemove', (e) => {
      if (!isZoomActive) return;
      const rect = pdpMainImgWrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Position circular lens around cursor
      pdpLens.style.left = `${x}px`;
      pdpLens.style.top = `${y}px`;

      // Percentage calculation for transform-origin
      const xPct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const yPct = Math.max(0, Math.min(100, (y / rect.height) * 100));

      pdpMainImg.style.transformOrigin = `${xPct}% ${yPct}%`;
      pdpMainImg.style.transform = 'scale(2.3)';
    });

    pdpMainImgWrap.addEventListener('mouseleave', () => {
      isZoomActive = false;
      pdpMainImgWrap.classList.remove('is-zoomed');
      pdpMainImg.style.transformOrigin = 'center center';
      pdpMainImg.style.transform = 'scale(1)';
    });
  }

  // --- Size Selection Handling ---
  document.querySelectorAll('#pdpSizePills .pdp-size-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#pdpSizePills .pdp-size-pill').forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      state.selectedSize = pill.dataset.size;
    });
  });

  // --- Quantity Selector ---
  if (qtyMinusBtn && qtyPlusBtn && qtyDisplay) {
    qtyMinusBtn.addEventListener('click', () => {
      if (state.quantity > 1) {
        state.quantity -= 1;
        qtyDisplay.textContent = state.quantity;
      }
    });

    qtyPlusBtn.addEventListener('click', () => {
      if (state.quantity < 10) {
        state.quantity += 1;
        qtyDisplay.textContent = state.quantity;
      }
    });
  }

  // --- Accordions ---
  document.querySelectorAll('.pdp-accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.pdp-accordion-item');
      item.classList.toggle('active');
    });
  });

  // --- Size Guide Modal ---
  if (openSizeGuide && sizeModalBackdrop && closeSizeGuide) {
    openSizeGuide.addEventListener('click', () => {
      sizeModalBackdrop.classList.add('active');
    });

    closeSizeGuide.addEventListener('click', () => {
      sizeModalBackdrop.classList.remove('active');
    });

    sizeModalBackdrop.addEventListener('click', (e) => {
      if (e.target === sizeModalBackdrop) {
        sizeModalBackdrop.classList.remove('active');
      }
    });
  }

  // --- Toast Notifications ---
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">✓</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3200);
  }

  // --- Bag / Cart Management Logic (Shared via localStorage) ---
  function saveCart() {
    localStorage.setItem('dropme_cart', JSON.stringify(state.cart));
    updateCartUI();
  }

  function updateCartUI() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (headerBagCount) headerBagCount.textContent = totalItems;
    if (drawerCartCount) drawerCartCount.textContent = `${totalItems} ${totalItems === 1 ? 'ITEM' : 'ITEMS'}`;

    if (cartSubtotal) {
      cartSubtotal.textContent = `${subtotal} EUR`;
    }

    if (shippingBarFill && shippingText) {
      const threshold = 100;
      const pct = Math.min(100, (subtotal / threshold) * 100);
      shippingBarFill.style.width = `${pct}%`;

      if (subtotal >= threshold) {
        shippingText.innerHTML = `<span>COMPLIMENTARY SHIPPING UNLOCKED</span> <span>APPLIED</span>`;
      } else {
        const remaining = threshold - subtotal;
        shippingText.innerHTML = `<span>Complimentary Shipping over 100€</span> <span>Add ${remaining}€ to unlock</span>`;
      }
    }

    if (!cartItemsContainer) return;

    if (state.cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <i class="fa-solid fa-bag-shopping cart-empty-icon"></i>
          <p>YOUR BAG IS CURRENTLY EMPTY</p>
        </div>
      `;
      return;
    }

    cartItemsContainer.innerHTML = state.cart.map((item, index) => `
      <div class="cart-item" data-index="${index}">
        <div class="cart-item-thumb">
          <img src="${item.img}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">SIZE: ${item.size}</div>
          <div class="cart-item-price">${item.price * item.qty} EUR</div>
          <div class="cart-item-actions">
            <div class="qty-control">
              <button type="button" class="qty-btn btn-qty-minus" data-index="${index}">-</button>
              <span class="qty-display">${item.qty}</span>
              <button type="button" class="qty-btn btn-qty-plus" data-index="${index}">+</button>
            </div>
            <button type="button" class="cart-item-remove" data-index="${index}">Remove</button>
          </div>
        </div>
      </div>
    `).join('');

    cartItemsContainer.querySelectorAll('.btn-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        if (state.cart[idx].qty > 1) {
          state.cart[idx].qty -= 1;
        } else {
          state.cart.splice(idx, 1);
        }
        saveCart();
      });
    });

    cartItemsContainer.querySelectorAll('.btn-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        state.cart[idx].qty += 1;
        saveCart();
      });
    });

    cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        const removed = state.cart.splice(idx, 1);
        saveCart();
        if (removed.length > 0) {
          showToast(`Removed ${removed[0].name} from bag`);
        }
      });
    });
  }

  function openCart() {
    if (cartDrawer && cartBackdrop) {
      cartDrawer.classList.add('active');
      cartBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCart() {
    if (cartDrawer && cartBackdrop) {
      cartDrawer.classList.remove('active');
      cartBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (bagBtn) bagBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      if (sizeModalBackdrop) sizeModalBackdrop.classList.remove('active');
      if (mobileDrawer) mobileDrawer.classList.remove('active');
    }
  });

  // --- Add to Bag Handler on PDP ---
  if (pdpAddBtn) {
    pdpAddBtn.addEventListener('click', () => {
      const existing = state.cart.find(item => item.id === currentProduct.id && item.size === state.selectedSize);
      if (existing) {
        existing.qty += state.quantity;
      } else {
        state.cart.push({
          id: currentProduct.id,
          name: currentProduct.name,
          price: currentProduct.price,
          img: currentProduct.images[0].url,
          size: state.selectedSize,
          qty: state.quantity
        });
      }

      saveCart();
      showToast(`Added ${currentProduct.name} [${state.selectedSize} × ${state.quantity}] to bag`);
      openCart();
    });
  }

  // --- Checkout Action ---
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (state.cart.length === 0) {
        showToast('Your bag is empty!');
        return;
      }
      checkoutBtn.textContent = 'REDIRECTING TO CHECKOUT...';
      checkoutBtn.style.opacity = '0.7';
      setTimeout(() => {
        window.location.href = 'checkout.html';
      }, 300);
    });
  }

  // --- Initialize Page ---
  renderProductDetails();
  updateCartUI();

})();
