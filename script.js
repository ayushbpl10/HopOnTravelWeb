// ===== i18n is managed globally via web/i18n.js =====
// Supporting en (English), hi (Hindi), mr (Marathi), kn (Kannada)


// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if(navbar) navbar.classList.toggle('scrolled', window.scrollY > 30);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
    }
  });
}

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

// ===== BOOKING FLOW =====
let _allWebTrips = [];
let _selectedTrip = null;
let _captchaA = 0, _captchaB = 0;

// Step navigation
function goToStep(n) {
  [1, 2, 3].forEach(i => {
    document.getElementById(`step-${i}`).style.display = i === n ? 'block' : 'none';
    const bsi = document.getElementById(`bsi-${i}`);
    if (bsi) bsi.classList.toggle('active', i <= n);
  });
}

// Filter trips in Step 1
function filterWebTrips(query) {
  const q = query.toLowerCase();
  const filtered = _allWebTrips.filter(t =>
    t.title.toLowerCase().includes(q) || t.vendorName.toLowerCase().includes(q)
  );
  renderTripCards(filtered);
}

// Render trip cards
function renderTripCards(tripsArr) {
  const grid = document.getElementById('webTripsGrid');
  if (!tripsArr.length) {
    grid.innerHTML = '<p style="color:#94a3b8;text-align:center;padding:3rem;grid-column:1/-1">No trips found. Try a different search.</p>';
    return;
  }
  grid.innerHTML = tripsArr.map(trip => {
    const minPrice = trip.packages && trip.packages.length
      ? Math.min(...trip.packages.map(p => p.price))
      : 0;
    const totalSeats = trip.batches
      ? trip.batches.reduce((a, b) => a + (b.totalSeats - b.bookedSeats), 0)
      : 0;
    const emoji = trip.title.toLowerCase().includes('beach') ? '🏖️' :
                  trip.title.toLowerCase().includes('camp') ? '🏕️' : '🏔️';
    const img = trip.images && trip.images[0]
      ? `<img class="web-trip-img" src="${trip.images[0]}" alt="${escapeHtml(trip.title)}" loading="lazy" onerror="this.outerHTML='<div class=web-trip-img>${emoji}</div>'" />`
      : `<div class="web-trip-img">${emoji}</div>`;
    return `
      <div class="web-trip-card" data-id="${trip.id}">
        ${img}
        <div class="web-trip-body">
          <div class="web-trip-title">${escapeHtml(trip.title)}</div>
          <div class="web-trip-vendor">
            by <a href="vendor.html?id=${encodeURIComponent(String(trip.vendorName || trip.vendorId || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''))}" style="color:var(--text-secondary, #94a3b8); text-decoration:underline; font-weight:500;" title="View all trips by this organiser">${escapeHtml(trip.vendorName)}</a>
          </div>
          <div class="web-trip-meta">
            <span class="web-trip-price">from ₹${minPrice.toLocaleString('en-IN')}</span>
            <span class="web-trip-seats">${totalSeats} seats left</span>
          </div>
          <div style="display:flex; gap:0.5rem; margin-top:0.8rem;">
            <button class="web-trip-book-btn" style="flex:1;" onclick="selectWebTrip('${trip.id}')">Book This Trip →</button>
            <a href="trip.html?id=${encodeURIComponent(trip.id)}" class="p-btn p-btn-dark p-btn-sm" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center; padding:0.6rem 0.9rem; font-size:0.85rem; border-radius:10px;">Details</a>
          </div>
        </div>
      </div>`;
  }).join('');
}

// Select a trip → go to Step 2
function selectWebTrip(tripId) {
  _selectedTrip = _allWebTrips.find(t => t.id === tripId);
  if (!_selectedTrip) return;

  document.getElementById('selectedTripBadge').textContent = _selectedTrip.title;

  // Populate batch selector
  const batchSel = document.getElementById('batchSelect');
  batchSel.innerHTML = (_selectedTrip.batches || []).map(b =>
    `<option value="${b.id}" data-seats="${b.totalSeats - b.bookedSeats}">${escapeHtml(b.dateDuration)} (${b.totalSeats - b.bookedSeats} seats left)</option>`
  ).join('');

  // Populate package selector
  const pkgSel = document.getElementById('packageSelect');
  pkgSel.innerHTML = (_selectedTrip.packages || []).map(p =>
    `<option value="${p.name}" data-price="${p.price}">${escapeHtml(p.name)} — ₹${p.price.toLocaleString('en-IN')}</option>`
  ).join('');

  // Reset form fields
  document.getElementById('travelerName').value = '';
  document.getElementById('travelerPhone').value = '';
  document.getElementById('travelerEmail').value = '';
  document.getElementById('seatsInput').value = '1';
  document.getElementById('consentCheck').checked = false;
  document.getElementById('captchaAns').value = '';

  // Reset reCAPTCHA widget if loaded
  if (window.grecaptcha && typeof window.grecaptcha.reset === 'function') {
    try { window.grecaptcha.reset(); } catch (_) {}
  }

  // Generate CAPTCHA
  _captchaA = Math.floor(Math.random() * 10) + 1;
  _captchaB = Math.floor(Math.random() * 10) + 1;
  document.getElementById('captchaQ').textContent = `${_captchaA} + ${_captchaB}`;

  updatePriceDisplay();
  goToStep(2);
  document.getElementById('book').scrollIntoView({ behavior: 'smooth' });
}

// Update live price display
function updatePriceDisplay() {
  const pkgSel = document.getElementById('packageSelect');
  const seatsInput = document.getElementById('seatsInput');
  const selectedOpt = pkgSel.selectedOptions[0];
  if (!selectedOpt) return;
  const pricePerSeat = parseInt(selectedOpt.dataset.price, 10) || 0;
  const seats = parseInt(seatsInput.value, 10) || 1;
  document.getElementById('priceDisplay').textContent = `₹${(pricePerSeat * seats).toLocaleString('en-IN')}`;
}

// Helper for XSS sanitization
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
}

// Rate limiter helper (max 3 bookings per 2 minutes per client)
function checkBookingRateLimit() {
  const now = Date.now();
  const attempts = JSON.parse(localStorage.getItem('_b_rate_limit') || '[]');
  const recentAttempts = attempts.filter(ts => now - ts < 120000); // 2 minutes window
  if (recentAttempts.length >= 3) {
    return false;
  }
  recentAttempts.push(now);
  localStorage.setItem('_b_rate_limit', JSON.stringify(recentAttempts));
  return true;
}

let _isSubmittingBooking = false;

// Submit booking
async function submitWebBooking() {
  if (_isSubmittingBooking) return;

  // 1. Anti-bot honeypot verification
  const hpField = document.getElementById('hp_field');
  if (hpField && hpField.value) {
    console.warn('Bot submission blocked via honeypot.');
    alert('Booking submitted.'); // Silent trap for automated bots
    return;
  }

  // 2. Client-side Rate Limiting & Attack Protection
  if (window.SecurityThrottler && !window.SecurityThrottler.checkAndEnforce('submit booking')) {
    return;
  }
  if (!checkBookingRateLimit()) {
    return alert('Too many booking requests. Please wait 2 minutes before trying again.');
  }

  // 3. Input Sanitization
  const rawName = document.getElementById('travelerName').value;
  const rawPhone = document.getElementById('travelerPhone').value;
  const rawEmail = document.getElementById('travelerEmail').value;

  const name = sanitizeInput(rawName);
  const phone = sanitizeInput(rawPhone);
  const email = sanitizeInput(rawEmail);

  const consent = document.getElementById('consentCheck').checked;
  const captchaAns = parseInt(document.getElementById('captchaAns').value, 10);
  const pkgSel = document.getElementById('packageSelect');
  const batchSel = document.getElementById('batchSelect');
  const seats = parseInt(document.getElementById('seatsInput').value, 10) || 1;

  // Validation
  if (!name || !phone || !email) return alert('Please fill in all required fields.');
  if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) return alert('Please enter a valid 10-digit phone number.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert('Please enter a valid email address.');
  if (!consent) return alert('You must accept the risks involved before booking.');

  // 4. reCAPTCHA Verification with Math Captcha Fallback
  let recaptchaToken = null;
  if (window.grecaptcha && typeof window.grecaptcha.execute === 'function') {
    try {
      recaptchaToken = await new Promise((resolve) => {
        window.grecaptcha.ready(async () => {
          try {
            const t = await window.grecaptcha.execute('6Lexm8UtAAAAABvf5IuhmCniieHVVpsqiuADIAPM', { action: 'booking' });
            resolve(t);
          } catch (err) {
            console.warn('grecaptcha.execute failed:', err);
            resolve(null);
          }
        });
      });
    } catch (_) {}
  } else if (window.grecaptcha && typeof window.grecaptcha.getResponse === 'function') {
    try {
      recaptchaToken = window.grecaptcha.getResponse();
    } catch (_) {}
  }

  if (recaptchaToken) {
    try {
      const verifyRes = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: recaptchaToken })
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        console.warn('reCAPTCHA verification returned unsuccessful:', verifyData);
        if (captchaAns !== _captchaA + _captchaB) {
          const fallback = document.getElementById('fallbackCaptchaBlock');
          if (fallback) fallback.style.display = 'block';
          return alert(`Security check failed. Hint: ${_captchaA} + ${_captchaB} = ?`);
        }
      }
    } catch (netErr) {
      console.warn('reCAPTCHA verification endpoint error:', netErr);
      if (captchaAns !== _captchaA + _captchaB) {
        const fallback = document.getElementById('fallbackCaptchaBlock');
        if (fallback) fallback.style.display = 'block';
        return alert(`Security check failed. Hint: ${_captchaA} + ${_captchaB} = ?`);
      }
    }
  } else {
    // If headless/offline or no reCAPTCHA token returned
    if (captchaAns !== _captchaA + _captchaB) {
      const fallback = document.getElementById('fallbackCaptchaBlock');
      if (fallback) fallback.style.display = 'block';
      return alert(`Please complete the security check: ${_captchaA} + ${_captchaB} = ?`);
    }
  }

  _isSubmittingBooking = true;
  const btn = document.getElementById('bookSubmitBtn');
  btn.disabled = true;
  btn.textContent = 'Creating Booking...';

  try {
    if (!window._fbApp) {
      alert('Connecting to database... Please wait a few seconds and try again.');
      return;
    }
    const { db, auth, collection, addDoc, signInAnonymously, doc, getDoc, updateDoc, query, getDocs, where } = window._fbApp;

    // Sign in anonymously so Firestore rules allow writes
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }

    const pkgOpt = pkgSel.selectedOptions[0];
    const packageName = pkgOpt?.value || '';
    const pricePerSeat = parseInt(pkgOpt?.dataset.price, 10) || 0;
    const totalPrice = pricePerSeat * seats;
    const batchId = batchSel.value;
    const bookingId = 'ATGL-' + Math.floor(10000 + Math.random() * 90000).toString();

    // Find vendorId (use trip's attached vendorId first, fallback to whatsapp lookup)
    let vendorId = _selectedTrip.vendorId || null;
    let vendorWhatsApp = _selectedTrip.vendorWhatsApp || '';
    if (!vendorId && vendorWhatsApp) {
      const vq = query(collection(db, 'vendors'), where('whatsappNumber', '==', vendorWhatsApp));
      const vSnap = await getDocs(vq);
      if (!vSnap.empty) vendorId = vSnap.docs[0].id;
    }

    const bookingData = {
      tripId: _selectedTrip.id,
      batchId,
      packageName,
      travelerName: name,
      travelerPhone: phone,
      travelerEmail: email,
      seats,
      totalPrice,
      status: 'pending',
      createdAt: Date.now(),
      bookingId,
      vendorId: vendorId || null,
      source: 'website',
      captchaVerified: true,
      securityVerification: {
        provider: recaptchaToken ? 'google_recaptcha_v3' : 'math_captcha',
        verified: true,
        siteKey: '6Lexm8UtAAAAABvf5IuhmCniieHVVpsqiuADIAPM',
        timestamp: Date.now()
      }
    };

    await addDoc(collection(db, 'bookings'), bookingData);

    // Update bookedSeats on the trip batch (best-effort — may fail if
    // Firestore rules don't allow anonymous users to update trips)
    try {
      const tripRef = doc(db, 'trips', _selectedTrip.id);
      const tripSnap = await getDoc(tripRef);
      if (tripSnap.exists()) {
        const updatedBatches = tripSnap.data().batches.map(b =>
          b.id === batchId ? { ...b, bookedSeats: b.bookedSeats + seats } : b
        );
        await updateDoc(tripRef, { batches: updatedBatches });
      }
    } catch (seatErr) {
      console.warn('Could not update seat count (non-fatal):', seatErr.message);
    }

    // Populate confirmation ticket
    document.getElementById('conf-name').textContent = name;
    document.getElementById('conf-trip').textContent = _selectedTrip.title;
    document.getElementById('conf-package').textContent = packageName;
    document.getElementById('conf-seats').textContent = seats;
    document.getElementById('conf-total').textContent = `₹${totalPrice.toLocaleString('en-IN')}`;
    document.getElementById('conf-bookingId').textContent = bookingId;

    const portalLink = document.getElementById('conf-portal-link');
    if (portalLink) {
      portalLink.href = `traveller.html?bookingId=${encodeURIComponent(bookingId)}`;
    }

    goToStep(3);
    document.getElementById('book').scrollIntoView({ behavior: 'smooth' });

  } catch (err) {
    console.error('Booking failed:', err);
    alert('Booking failed: ' + (err.message || 'Unknown error. Please try again.'));
  } finally {
    _isSubmittingBooking = false;
    btn.disabled = false;
    btn.textContent = 'Confirm Booking →';
    if (window.grecaptcha && typeof window.grecaptcha.reset === 'function') {
      try { window.grecaptcha.reset(); } catch (_) {}
    }
  }
}

// Curated Fallback Trips for instant browsing & testing
const CURATED_SAMPLE_TRIPS = [
  {
    id: 'demo',
    title: 'Harishchandragad & Kokankada Trek',
    vendorName: 'Sahyadri Trekkers (Verified Partner)',
    vendorId: 'demo',
    packages: [{ name: 'Pune Transport', price: 1299 }, { name: 'Mumbai Transport', price: 1499 }],
    batches: [{ id: 'b1', dateDuration: '05-06 Sep (Sat-Sun)', totalSeats: 30, bookedSeats: 8 }],
    images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: 'rajmachi-demo',
    title: 'Rajmachi Fireflies & Fort Camping',
    vendorName: 'Sahyadri Trekkers (Verified Partner)',
    vendorId: 'demo',
    packages: [{ name: 'Camping Package', price: 1399 }],
    batches: [{ id: 'b2', dateDuration: 'Upcoming Weekend', totalSeats: 25, bookedSeats: 6 }],
    images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: 'pawna-demo',
    title: 'Pawna Lake Lakeside Glamping',
    vendorName: 'Camp Wanderers',
    vendorId: 'camp-wanderers',
    packages: [{ name: 'Lakeside Tent', price: 1099 }],
    batches: [{ id: 'b3', dateDuration: 'Every Weekend', totalSeats: 40, bookedSeats: 15 }],
    images: ['https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: 'gokarna-demo',
    title: 'Gokarna Beach Trek & Cafe Hopping',
    vendorName: 'Coastline Explorers',
    vendorId: 'coastline-explorers',
    packages: [{ name: 'Full Trip Ex-Pune', price: 3999 }],
    batches: [{ id: 'b4', dateDuration: 'Long Weekend', totalSeats: 20, bookedSeats: 5 }],
    images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80']
  }
];

// ===== LOAD TRIPS ON FIREBASE READY =====
async function loadTripsOnReady() {
  const grid = document.getElementById('webTripsGrid');
  const loadingMsg = document.getElementById('tripsLoadingMsg');
  const errorMsg = document.getElementById('tripsErrorMsg');

  try {
    const { db, collection, getDocs, query, where } = window._fbApp;
    const q = query(collection(db, 'trips'), where('status', '==', 'published'));
    const snap = await getDocs(q);

    _allWebTrips = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (!_allWebTrips.length) {
      _allWebTrips = CURATED_SAMPLE_TRIPS;
    }
    if (loadingMsg) loadingMsg.style.display = 'none';
    renderTripCards(_allWebTrips);

  } catch (err) {
    console.warn('Could not load live trips from Firestore, using curated sample trips:', err);
    if (loadingMsg) loadingMsg.style.display = 'none';
    _allWebTrips = CURATED_SAMPLE_TRIPS;
    renderTripCards(_allWebTrips);
  }
}

if (window._fbApp) {
  loadTripsOnReady();
} else {
  window.addEventListener('firebase-ready', loadTripsOnReady);
}

// ===== GSAP ANIMATIONS =====
function initAnimations() {
  if (typeof gsap === 'undefined') return;
  // Register ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 1. Hero Content Load Animation
  const heroTimeline = gsap.timeline();
  heroTimeline.from('.tmpl-small-text', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 })
              .from('.tmpl-main-title', { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
              .from('.tmpl-hero-desc', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
              .from('.tmpl-hero-actions', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');

  // 2. Split Section Reveal (Journey)
  gsap.from('.tmpl-split-right > *', {
    scrollTrigger: {
      trigger: '.tmpl-split-section',
      start: 'top 70%'
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // 3. Book Section Reveal
  gsap.from('.tmpl-book-section h2, .book-search-row', {
    scrollTrigger: {
      trigger: '.tmpl-book-section',
      start: 'top 75%'
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out'
  });

  // 4. Community Section Reveal
  gsap.from('.tmpl-community-section .tmpl-content-left > *', {
    scrollTrigger: {
      trigger: '.tmpl-community-section',
      start: 'top 70%'
    },
    x: -30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // 5. Collect Moments Section Reveal
  gsap.from('.tmpl-collect-section .tmpl-content-left > *', {
    scrollTrigger: {
      trigger: '.tmpl-collect-section',
      start: 'top 70%'
    },
    x: -30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });
}

// Initialize animations once the DOM is fully ready
document.addEventListener('DOMContentLoaded', () => {
  // Give a tiny delay to ensure everything is painted
  setTimeout(initAnimations, 100);
});

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}
