// cart.js - Shared cart logic for all pages

// Utility: Get cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

// Utility: Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add product to cart (by id, name, price, image)
function addToCart(product) {
  let cart = getCart();
  const index = cart.findIndex(item => item.id === product.id);
  if (index > -1) {
    cart[index].qty += 1;
  } else {
    cart.push({...product, qty: 1});
  }
  saveCart(cart);
  updateCartCounter();
  showCartFeedback('Added to cart!');
}

// Remove product from cart by id
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  updateCartCounter();
}

// Update cart counter in navbar
function updateCartCounter() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const el = document.getElementById('cartCounter');
  if (el) el.textContent = count > 0 ? count : '';
}

// Show feedback (toast or alert)
function showCartFeedback(msg) {
  let el = document.getElementById('cartFeedback');
  if (!el) {
    el = document.createElement('div');
    el.id = 'cartFeedback';
    el.style.position = 'fixed';
    el.style.top = '20px';
    el.style.right = '20px';
    el.style.zIndex = 9999;
    el.className = 'alert alert-success';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 1200);
}

// Call on page load
window.addEventListener('DOMContentLoaded', updateCartCounter);

// Export for use in inline onclick (for legacy)
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.getCart = getCart;
window.saveCart = saveCart;
window.updateCartCounter = updateCartCounter;
// Export new quantity functions for cart.html
window.incrementQty = function(id) {
  const cart = getCart();
  const idx = cart.findIndex(item => item.id === id);
  if (idx > -1) {
    cart[idx].qty += 1;
    saveCart(cart);
    if (typeof renderCart === 'function') renderCart();
    showCartFeedback('Quantity increased.');
  }
};
window.decrementQty = function(id) {
  let cart = getCart();
  const idx = cart.findIndex(item => item.id === id);
  if (idx > -1) {
    cart[idx].qty -= 1;
    if (cart[idx].qty <= 0) {
      cart.splice(idx, 1);
      showCartFeedback('Item removed from cart.');
    } else {
      showCartFeedback('Quantity decreased.');
    }
    saveCart(cart);
    if (typeof renderCart === 'function') renderCart();
  }
};
