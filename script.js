// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.feature-card, .step, .showcase-text, .showcase-phones, .vendor-text, .vendor-visual, .vendor-stat-card').forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// ===== STAGGERED CHILDREN ANIMATION =====
document.querySelectorAll('.features-grid, .steps').forEach(container => {
  Array.from(container.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.1}s`;
  });
});

// ===== SMOOTH ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? '#00b0ff' : '';
  });
});
