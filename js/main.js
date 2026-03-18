/* ============================================================
   LUMIO — main.js
   DIM22104 Web Design & Coding Basics
   Jesus Gabriel Blanco Bellido — 24018013
   ============================================================ */

'use strict';

/* ── Cart state ────────────────────────────────────────────── */
let cart = JSON.parse(localStorage.getItem('lumio-cart') || '[]');
let cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

function saveCart() {
  localStorage.setItem('lumio-cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-count');
  badges.forEach(b => {
    b.textContent = cartCount > 0 ? cartCount : '';
    b.style.display = cartCount > 0 ? 'inline-flex' : 'none';
  });
}

/* ── Add to cart ───────────────────────────────────────────── */
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  cartCount += 1;
  saveCart();
  updateCartBadge();
  showToast(`${name} added to bag`);
}

/* ── Toast notification ────────────────────────────────────── */
function showToast(message) {
  let toast = document.querySelector('.cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'cart-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('active');
  setTimeout(() => toast.classList.remove('active'), 2800);
}

/* ── Quantity controls (product page) ─────────────────────── */
function initQuantityControls() {
  const input  = document.getElementById('qty-input');
  const btnPlus  = document.getElementById('qty-plus');
  const btnMinus = document.getElementById('qty-minus');

  if (!input || !btnPlus || !btnMinus) return;

  btnPlus.addEventListener('click', function() {
    let v = parseInt(input.value, 10) || 1;
    if (v < 10) input.value = v + 1;
  });

  btnMinus.addEventListener('click', function() {
    let v = parseInt(input.value, 10) || 1;
    if (v > 1) input.value = v - 1;
  });

  input.addEventListener('change', function() {
    let v = parseInt(this.value, 10);
    if (isNaN(v) || v < 1) this.value = 1;
    if (v > 10) this.value = 10;
  });
}

/* ── Fade-up scroll animation ──────────────────────────────── */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

/* ── Mobile navigation ─────────────────────────────────────── */
function initMobileNav() {
  const hamburger = document.querySelector('.nav__hamburger');
  const navLinks  = document.querySelector('.nav__links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', function() {
    const isOpen = navLinks.style.display === 'flex';
    navLinks.style.display = isOpen ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '68px';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = '#FFFFFF';
    navLinks.style.padding = '24px';
    navLinks.style.borderBottom = '1px solid #E8DDD0';
    navLinks.style.zIndex = '99';
  });

  // Close nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.style.display = 'none';
    });
  });
}

/* ── Newsletter form ───────────────────────────────────────── */
function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter__form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const input = this.querySelector('.newsletter__input');
      const email = input ? input.value.trim() : '';
      if (email && email.includes('@')) {
        showToast('Thank you — you\'re on the list.');
        if (input) input.value = '';
      } else {
        showToast('Please enter a valid email address.');
      }
    });
  });
}

/* ── Hero fade-in animation ────────────────────────────────── */
function initHeroAnimation() {
  const hero = document.querySelector('.hero');
  if (hero) {
    // animation handled via CSS — just ensure class is present
    hero.style.animationPlayState = 'running';
  }
}

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  updateCartBadge();
  initQuantityControls();
  initScrollAnimations();
  initMobileNav();
  initNewsletter();
  initHeroAnimation();

  // Add-to-cart buttons
  document.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', function() {
      const name  = this.dataset.name  || 'Product';
      const price = this.dataset.price || '0.00';
      addToCart(name, price);
    });
  });
});
