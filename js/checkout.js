/**
 * DROPME.CLOTHING — Checkout Engine Logic
 */

(function () {
  'use strict';

  // --- Cart & Checkout State ---
  const state = {
    cart: JSON.parse(localStorage.getItem('dropme_cart') || '[]'),
    shippingCost: 0,
    discountRate: 0,
    discountAmount: 0,
    appliedCode: ''
  };

  // --- DOM References ---
  const checkoutItemsList = document.getElementById('checkoutItemsList');
  const checkoutItemCount = document.getElementById('checkoutItemCount');
  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryShipping = document.getElementById('summaryShipping');
  const summaryDiscount = document.getElementById('summaryDiscount');
  const discountRow = document.getElementById('discountRow');
  const summaryTotal = document.getElementById('summaryTotal');
  const payBtnLabel = document.getElementById('payBtnLabel');
  const checkoutPayBtn = document.getElementById('checkoutPayBtn');
  const checkoutForm = document.getElementById('checkoutForm');

  // Promo Code
  const promoInput = document.getElementById('promoInput');
  const promoApplyBtn = document.getElementById('promoApplyBtn');
  const promoMsg = document.getElementById('promoMsg');

  // Shipping & Payment Options
  const shippingRadios = document.querySelectorAll('input[name="shippingMethod"]');
  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  const blikBox = document.getElementById('blikBox');
  const cardBox = document.getElementById('cardBox');

  // Success Modal
  const orderSuccessModal = document.getElementById('orderSuccessModal');
  const successOrderNumber = document.getElementById('successOrderNumber');

  // --- Promo Code Dictionary ---
  const PROMO_CODES = {
    'BUCH10': { rate: 0.10, desc: '10% DROP DISCOUNT' },
    'SECRET20': { rate: 0.20, desc: '20% VIP INNER CIRCLE DISCOUNT' },
    'FREESHIP': { rate: 0.00, freeShip: true, desc: 'FREE SHIPPING OVERRIDE' }
  };

  // --- Calculate Totals ---
  function calculateTotals() {
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    // Determine shipping price
    const selectedShipping = document.querySelector('input[name="shippingMethod"]:checked')?.value || 'courier';
    let shipping = 0;

    if (selectedShipping === 'discrete') {
      shipping = 10;
    } else {
      if (subtotal >= 100 || (state.appliedCode === 'FREESHIP')) {
        shipping = 0;
      } else {
        shipping = selectedShipping === 'paczkomat' ? 4 : 6;
      }
    }

    state.shippingCost = shipping;

    // Calculate discount
    state.discountAmount = Math.round(subtotal * state.discountRate);

    // Final total
    const total = Math.max(0, subtotal - state.discountAmount + state.shippingCost);

    // Update UI
    if (summarySubtotal) summarySubtotal.textContent = `${subtotal} EUR`;
    if (summaryShipping) {
      summaryShipping.textContent = state.shippingCost === 0 ? 'FREE' : `${state.shippingCost} EUR`;
    }

    if (discountRow && summaryDiscount) {
      if (state.discountAmount > 0) {
        discountRow.style.display = 'flex';
        summaryDiscount.textContent = `-${state.discountAmount} EUR (${Math.round(state.discountRate * 100)}%)`;
      } else {
        discountRow.style.display = 'none';
      }
    }

    if (summaryTotal) summaryTotal.textContent = `${total} EUR`;
    if (payBtnLabel) payBtnLabel.textContent = `PAY & COMPLETE ORDER • ${total} EUR`;
  }

  // --- Render Cart Items in Summary ---
  function renderOrderItems() {
    if (!checkoutItemsList) return;

    if (state.cart.length === 0) {
      checkoutItemsList.innerHTML = `
        <div style="padding: 30px 10px; text-align: center; color: var(--text-muted); font-family: var(--font-mono); font-size: 12px;">
          YOUR BAG IS CURRENTLY EMPTY.<br><br>
          <a href="index.html" style="color: var(--text-primary); text-decoration: underline;">GO TO ARCHIVE TO SELECT PIECES &rarr;</a>
        </div>
      `;
      if (checkoutPayBtn) {
        checkoutPayBtn.disabled = true;
        checkoutPayBtn.style.opacity = '0.5';
        checkoutPayBtn.style.cursor = 'not-allowed';
      }
      if (checkoutItemCount) checkoutItemCount.textContent = '0 ITEMS';
      calculateTotals();
      return;
    }

    const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);
    if (checkoutItemCount) checkoutItemCount.textContent = `${totalQty} ${totalQty === 1 ? 'ITEM' : 'ITEMS'}`;

    checkoutItemsList.innerHTML = state.cart.map(item => `
      <div class="checkout-item-row">
        <div class="checkout-item-thumb">
          <img src="${item.img}" alt="${item.name}">
          <span class="checkout-item-qty-badge">${item.qty}</span>
        </div>
        <div class="checkout-item-info">
          <div class="checkout-item-title">${item.name}</div>
          <div class="checkout-item-size">SIZE: ${item.size}</div>
        </div>
        <div class="checkout-item-price">${item.price * item.qty} EUR</div>
      </div>
    `).join('');

    calculateTotals();
  }

  // --- Shipping Method Radios ---
  shippingRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('input[name="shippingMethod"]').forEach(r => {
        const optionLabel = r.closest('.selectable-option');
        if (optionLabel) optionLabel.classList.toggle('selected', r.checked);
      });
      calculateTotals();
    });
  });

  // --- Payment Method Selection ---
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('input[name="paymentMethod"]').forEach(r => {
        const optionLabel = r.closest('.selectable-option');
        if (optionLabel) optionLabel.classList.toggle('selected', r.checked);
      });

      // Toggle conditional fields
      if (blikBox) blikBox.classList.toggle('active', radio.value === 'blik');
      if (cardBox) cardBox.classList.toggle('active', radio.value === 'card');
    });
  });

  // --- Promo Code Application ---
  if (promoApplyBtn && promoInput && promoMsg) {
    promoApplyBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();

      if (!code) {
        promoMsg.className = 'promo-message error';
        promoMsg.textContent = 'Please enter a coupon code';
        return;
      }

      if (PROMO_CODES[code]) {
        const promo = PROMO_CODES[code];
        state.discountRate = promo.rate;
        state.appliedCode = code;
        promoMsg.className = 'promo-message success';
        promoMsg.textContent = `✓ CODE ${code} APPLIED: ${promo.desc}`;
        calculateTotals();
      } else {
        promoMsg.className = 'promo-message error';
        promoMsg.textContent = '✕ INVALID OR EXPIRED PROMO CODE';
      }
    });
  }

  // --- Checkout Form Submission ---
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (state.cart.length === 0) {
        alert('Your bag is empty!');
        return;
      }

      // Check BLIK code if BLIK selected
      const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked')?.value;
      if (selectedPayment === 'blik') {
        const blikVal = document.getElementById('blikCode')?.value.trim();
        if (!blikVal || blikVal.length < 6) {
          alert('Please enter a valid 6-digit BLIK code to proceed.');
          document.getElementById('blikCode')?.focus();
          return;
        }
      }

      // Show processing state
      if (checkoutPayBtn) {
        checkoutPayBtn.disabled = true;
        checkoutPayBtn.style.opacity = '0.7';
        checkoutPayBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>SECURING ALLOCATION IN ARCHIVE...</span>';
      }

      // Simulate instantaneous secure gateway confirmation
      setTimeout(() => {
        // Generate random order number
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const orderId = `DMB-${randomNum}`;

        if (successOrderNumber) {
          successOrderNumber.textContent = `ORDER #${orderId}`;
        }

        // Clear Cart from localStorage
        localStorage.removeItem('dropme_cart');

        // Show Success Modal
        if (orderSuccessModal) {
          orderSuccessModal.classList.add('active');
        }
      }, 1200);
    });
  }

  // --- Initialize Checkout ---
  renderOrderItems();

})();
