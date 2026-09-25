/**
 * DROPMEBUCH — Balenciaga Dark Core Logic
 */

(function () {
  'use strict';

  // --- Cart State ---
  const state = {
    cart: JSON.parse(localStorage.getItem('dropme_cart') || '[]'),
    activeFilter: 'all'
  };

  // --- DOM References ---
  // Navigation & Search
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const closeMobileDrawer = document.getElementById('closeMobileDrawer');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const openSearchBtn = document.getElementById('openSearchBtn');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const searchBar = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');

  // Cart & Drawers
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

  // Filter & Search Elements
  const productCards = Array.from(document.querySelectorAll('.balenciaga-product-card'));
  const filterBtns = document.querySelectorAll('.editorial-tab-btn');
  const editorialCount = document.getElementById('editorialCount');
  const searchNoResults = document.getElementById('searchNoResults');
  const searchQueryText = document.getElementById('searchQueryText');
  const resetSearchBtn = document.getElementById('resetSearchBtn');

  // Newsletter
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');

  // --- Mobile Drawer Controls ---
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

  // --- Slide-down Search Bar Controls ---
  function openSearch() {
    if (searchBar && searchInput) {
      searchBar.classList.add('active');
      searchInput.focus();
    }
  }

  function closeSearch() {
    if (searchBar && searchInput) {
      searchBar.classList.remove('active');
      searchInput.value = '';
      applyFilterAndSearch();
    }
  }

  if (openSearchBtn) openSearchBtn.addEventListener('click', openSearch);
  if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearch);

  // Pressing '/' opens search, 'ESC' closes search and cart
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openSearch();
    } else if (e.key === 'Escape') {
      closeSearch();
      closeCart();
      if (mobileDrawer) mobileDrawer.classList.remove('active');
    }
  });

  // --- Search & Filtering Engine ---
  function applyFilterAndSearch() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    let visibleCount = 0;

    productCards.forEach(card => {
      const name = (card.querySelector('.product-item-title')?.textContent || '').toLowerCase();
      const meta = (card.querySelector('.product-item-meta')?.textContent || '').toLowerCase();
      const keywords = (card.dataset.keywords || '').toLowerCase();
      const categories = (card.dataset.category || '').toLowerCase().split(' ');

      const matchesCategory = (state.activeFilter === 'all') || categories.includes(state.activeFilter);
      const matchesQuery = !query || name.includes(query) || meta.includes(query) || keywords.includes(query);

      const isVisible = matchesCategory && matchesQuery;
      card.style.display = isVisible ? 'flex' : 'none';

      if (isVisible) visibleCount++;
    });

    // Empty state
    if (searchNoResults) {
      if (visibleCount === 0) {
        searchNoResults.style.display = 'flex';
        if (searchQueryText) searchQueryText.textContent = query || state.activeFilter.toUpperCase();
      } else {
        searchNoResults.style.display = 'none';
      }
    }

    // Counter
    if (editorialCount) {
      if (query) {
        editorialCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'ITEM FOUND' : 'ITEMS FOUND'}`;
      } else {
        editorialCount.textContent = `SHOWING ${visibleCount} ${visibleCount === 1 ? 'ITEM' : 'ITEMS'}`;
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilterAndSearch);
  }

  if (resetSearchBtn) {
    resetSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      state.activeFilter = 'all';
      filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
      applyFilterAndSearch();
    });
  }

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFilter = btn.dataset.filter || 'all';
      applyFilterAndSearch();
    });
  });

  // Header Nav & Mobile Drawer Links with filter
  document.querySelectorAll('[data-nav-filter]').forEach(link => {
    link.addEventListener('click', () => {
      const filter = link.dataset.navFilter;
      document.querySelectorAll('.header-nav-link').forEach(l => l.classList.remove('active'));
      const matchingHeaderLink = document.querySelector(`.header-nav-link[data-nav-filter="${filter}"]`);
      if (matchingHeaderLink) matchingHeaderLink.classList.add('active');
      filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
      state.activeFilter = filter;
      applyFilterAndSearch();
      if (mobileDrawer) mobileDrawer.classList.remove('active');
    });
  });

  // --- Toast Notification ---
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

  // --- Cart Drawer Controls ---
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

  // --- Cart Logic & Persistence ---
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

    // Free Shipping Progress (100€ threshold)
    if (shippingBarFill && shippingText) {
      const threshold = 100;
      const pct = Math.min(100, (subtotal / threshold) * 100);
      shippingBarFill.style.width = `${pct}%`;

      if (subtotal >= threshold) {
        shippingText.innerHTML = `<span>FREE WORLDWIDE SHIPPING UNLOCKED</span> <span>APPLIED</span>`;
      } else {
        const remaining = threshold - subtotal;
        shippingText.innerHTML = `<span>Free Worldwide Shipping over 100€</span> <span>Add ${remaining}€ for FREE SHIPPING</span>`;
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
              <button class="qty-btn btn-qty-minus" data-index="${index}">-</button>
              <span class="qty-display">${item.qty}</span>
              <button class="qty-btn btn-qty-plus" data-index="${index}">+</button>
            </div>
            <button class="cart-item-remove" data-index="${index}">Remove</button>
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

  // --- Product Card Direct Navigation ---
  productCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Do not navigate if user clicked on button or quick-add action
      if (e.target.closest('button') || e.target.closest('.btn-quick-add')) {
        return;
      }
      const id = card.dataset.id;
      if (id) {
        window.location.href = `product.html?id=${id}`;
      }
    });
  });

  // --- Quick Add To Bag from Cards ---
  document.querySelectorAll('.btn-quick-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const img = btn.dataset.img;
      const size = 'M'; // Default size for quick-add

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

  // --- Checkout Button Handler ---
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

  // --- Newsletter ---
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (newsletterEmail && newsletterEmail.value.trim()) {
        showToast('Subscribed to DROPMEBUCH drop alerts');
        newsletterEmail.value = '';
      }
    });
  }

  // --- Initialize ---
  updateCartUI();
  applyFilterAndSearch();

})();