// ===== i18n (Internationalization) =====
const translations = {
  en: {
    nav_features: "Features",
    nav_how_it_works: "How It Works",
    nav_book_now: "Book Now",
    nav_for_vendors: "For Vendors",
    nav_contact: "Contact",
    nav_book_a_trip: "Book a Trip",
    hero_badge: "🇮🇳 Made for India's Travellers",
    hero_title: "Your Next <span class=\"gradient-text\">Adventure</span><br/>Starts Here",
    hero_sub: "Discover curated weekend treks, camping trips & group getaways across India — with live bus tracking, easy booking, and verified trip organizers.",
    stat_trips: "Trips Listed",
    stat_travellers: "Happy Travellers",
    stat_vendors: "Verified Vendors",
    hiw_label: "Simple Process",
    hiw_title: "Go from Browsing to<br/><span class=\"gradient-text\">Boarding in Minutes</span>",
    book_label: "Book Online",
    book_title: "Find Your <span class=\"gradient-text\">Perfect Trip</span>",
    book_sub: "Browse real trips, fill your details, and get your booking ID instantly. Same database as the app."
  },
  hi: {
    nav_features: "विशेषताएं",
    nav_how_it_works: "यह कैसे काम करता है",
    nav_book_now: "अभी बुक करें",
    nav_for_vendors: "विक्रेताओं के लिए",
    nav_contact: "संपर्क करें",
    nav_book_a_trip: "ट्रिप बुक करें",
    hero_badge: "🇮🇳 भारत के यात्रियों के लिए निर्मित",
    hero_title: "आपका अगला <span class=\"gradient-text\">रोमांच</span><br/>यहाँ से शुरू होता है",
    hero_sub: "भारत भर में चुनिंदा वीकेंड ट्रेक, कैंपिंग ट्रिप और ग्रुप गेटवे खोजें — लाइव बस ट्रैकिंग, आसान बुकिंग और सत्यापित ट्रिप आयोजकों के साथ।",
    stat_trips: "सूचीबद्ध ट्रिप",
    stat_travellers: "संतुष्ट यात्री",
    stat_vendors: "सत्यापित विक्रेता",
    hiw_label: "सरल प्रक्रिया",
    hiw_title: "ब्राउज़िंग से<br/><span class=\"gradient-text\">मिनटों में बोर्डिंग तक जाएं</span>",
    book_label: "ऑनलाइन बुक करें",
    book_title: "अपना <span class=\"gradient-text\">परफेक्ट ट्रिप</span> खोजें",
    book_sub: "असली ट्रिप ब्राउज़ करें, अपना विवरण भरें, और तुरंत अपनी बुकिंग आईडी प्राप्त करें।"
  },
  mr: {
    nav_features: "वैशिष्ट्ये",
    nav_how_it_works: "हे कसे कार्य करते",
    nav_book_now: "आता बुक करा",
    nav_for_vendors: "विक्रेत्यांसाठी",
    nav_contact: "संपर्क",
    nav_book_a_trip: "ट्रिप बुक करा",
    hero_badge: "🇮🇳 भारताच्या प्रवाशांसाठी निर्मित",
    hero_title: "तुमचा पुढचा <span class=\"gradient-text\">रोमांच</span><br/>येथून सुरू होतो",
    hero_sub: "संपूर्ण भारतात निवडक वीकेंड ट्रेक, कॅम्पिंग ट्रिप आणि ग्रुप गेटवे शोधा — थेट बस ट्रॅकिंग, सोपे बुकिंग आणि सत्यापित ट्रिप आयोजकांसह।",
    stat_trips: "सूचीबद्ध ट्रिप",
    stat_travellers: "आनंदी प्रवासी",
    stat_vendors: "सत्यापित विक्रेते",
    hiw_label: "सोपी प्रक्रिया",
    hiw_title: "शोधण्यापासून<br/><span class=\"gradient-text\">काही मिनिटांत प्रवासापर्यंत</span>",
    book_label: "ऑनलाइन बुकिंग",
    book_title: "तुमची <span class=\"gradient-text\">परफेक्ट ट्रिप</span> शोधा",
    book_sub: "खऱ्या ट्रिप पहा, तुमचे तपशील भरा आणि लगेच तुमचा बुकिंग आयडी मिळवा."
  },
  kn: {
    nav_features: "ವೈಶಿಷ್ಟ್ಯಗಳು",
    nav_how_it_works: "ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
    nav_book_now: "ಈಗ ಬುಕ್ ಮಾಡಿ",
    nav_for_vendors: "ಮಾರಾಟಗಾರರಿಗೆ",
    nav_contact: "ಸಂಪರ್ಕಿಸಿ",
    nav_book_a_trip: "ಟ್ರಿಪ್ ಬುಕ್ ಮಾಡಿ",
    hero_badge: "🇮🇳 ಭಾರತದ ಪ್ರಯಾಣಿಕರಿಗಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ",
    hero_title: "ನಿಮ್ಮ ಮುಂದಿನ <span class=\"gradient-text\">ಸಾಹಸ</span><br/>ಇಲ್ಲಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ",
    hero_sub: "ಭಾರತದಾದ್ಯಂತ ಆಯ್ದ ವಾರಾಂತ್ಯದ ಟ್ರೆಕ್‌ಗಳು, ಕ್ಯಾಂಪಿಂಗ್ ಟ್ರಿಪ್‌ಗಳು ಮತ್ತು ಗುಂಪು ಗೆಟ್‌ವೇಗಳನ್ನು ಅನ್ವೇಷಿಸಿ — ಲೈವ್ ಬಸ್ ಟ್ರ್ಯಾಕಿಂಗ್, ಸುಲಭ ಬುಕಿಂಗ್ ಮತ್ತು ಪರಿಶೀಲಿಸಿದ ಟ್ರಿಪ್ ಸಂಘಟಕರೊಂದಿಗೆ.",
    stat_trips: "ಪಟ್ಟಿ ಮಾಡಲಾದ ಪ್ರವಾಸಗಳು",
    stat_travellers: "ಸಂತೋಷದ ಪ್ರಯಾಣಿಕರು",
    stat_vendors: "ಪರಿಶೀಲಿಸಿದ ಮಾರಾಟಗಾರರು",
    hiw_label: "ಸರಳ ಪ್ರಕ್ರಿಯೆ",
    hiw_title: "ಹುಡುಕುವುದರಿಂದ<br/><span class=\"gradient-text\">ಕೆಲವೇ ನಿಮಿಷಗಳಲ್ಲಿ ಪ್ರಯಾಣದವರೆಗೆ</span>",
    book_label: "ಆನ್‌ಲೈನ್ ಬುಕ್ ಮಾಡಿ",
    book_title: "ನಿಮ್ಮ <span class=\"gradient-text\">ಪರ್ಫೆಕ್ಟ್ ಟ್ರಿಪ್</span> ಹುಡುಕಿ",
    book_sub: "ನೈಜ ಪ್ರವಾಸಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ, ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ ಮತ್ತು ತಕ್ಷಣವೇ ನಿಮ್ಮ ಬುಕಿಂಗ್ ಐಡಿ ಪಡೆಯಿರಿ."
  }
};

function changeLanguage(lang) {
  localStorage.setItem('site_lang', lang);
  document.getElementById('langSelect').value = lang;
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('site_lang') || 'en';
  changeLanguage(savedLang);
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if(navbar) navbar.classList.toggle('scrolled', window.scrollY > 30);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
  });
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
      ? `<img class="web-trip-img" src="${trip.images[0]}" alt="${trip.title}" loading="lazy" onerror="this.outerHTML='<div class=web-trip-img>${emoji}</div>'" />`
      : `<div class="web-trip-img">${emoji}</div>`;
    return `
      <div class="web-trip-card" data-id="${trip.id}">
        ${img}
        <div class="web-trip-body">
          <div class="web-trip-title">${trip.title}</div>
          <div class="web-trip-vendor">by ${trip.vendorName}</div>
          <div class="web-trip-meta">
            <span class="web-trip-price">from ₹${minPrice.toLocaleString('en-IN')}</span>
            <span class="web-trip-seats">${totalSeats} seats left</span>
          </div>
          <button class="web-trip-book-btn" onclick="selectWebTrip('${trip.id}')">Book This Trip →</button>
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
    `<option value="${b.id}" data-seats="${b.totalSeats - b.bookedSeats}">${b.dateDuration} (${b.totalSeats - b.bookedSeats} seats left)</option>`
  ).join('');

  // Populate package selector
  const pkgSel = document.getElementById('packageSelect');
  pkgSel.innerHTML = (_selectedTrip.packages || []).map(p =>
    `<option value="${p.name}" data-price="${p.price}">${p.name} — ₹${p.price.toLocaleString('en-IN')}</option>`
  ).join('');

  // Reset form fields
  document.getElementById('travelerName').value = '';
  document.getElementById('travelerPhone').value = '';
  document.getElementById('travelerEmail').value = '';
  document.getElementById('seatsInput').value = '1';
  document.getElementById('consentCheck').checked = false;
  document.getElementById('captchaAns').value = '';

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

// Submit booking
async function submitWebBooking() {
  const name = document.getElementById('travelerName').value.trim();
  const phone = document.getElementById('travelerPhone').value.trim();
  const email = document.getElementById('travelerEmail').value.trim();
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
  if (captchaAns !== _captchaA + _captchaB) return alert(`Security check failed. Hint: ${_captchaA} + ${_captchaB} = ?`);

  const btn = document.getElementById('bookSubmitBtn');
  btn.disabled = true;
  btn.textContent = 'Creating Booking...';

  try {
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

    // Find vendorId by matching whatsappNumber
    let vendorId = null;
    let vendorWhatsApp = _selectedTrip.vendorWhatsApp || '';
    if (vendorWhatsApp) {
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
      source: 'website'
    };

    await addDoc(collection(db, 'bookings'), bookingData);

    // Update bookedSeats on the trip batch
    const tripRef = doc(db, 'trips', _selectedTrip.id);
    const tripSnap = await getDoc(tripRef);
    if (tripSnap.exists()) {
      const updatedBatches = tripSnap.data().batches.map(b =>
        b.id === batchId ? { ...b, bookedSeats: b.bookedSeats + seats } : b
      );
      await updateDoc(tripRef, { batches: updatedBatches });
    }

    // Populate confirmation ticket
    document.getElementById('conf-name').textContent = name;
    document.getElementById('conf-trip').textContent = _selectedTrip.title;
    document.getElementById('conf-package').textContent = packageName;
    document.getElementById('conf-seats').textContent = seats;
    document.getElementById('conf-total').textContent = `₹${totalPrice.toLocaleString('en-IN')}`;
    document.getElementById('conf-bookingId').textContent = bookingId;

    // WhatsApp link
    const waNum = (vendorWhatsApp || '').replace(/\D/g, '');
    const waMsg = encodeURIComponent(
      `Hi! I just booked "${_selectedTrip.title}" on AbTohGhoomLe.com\n\nBooking ID: ${bookingId}\nName: ${name}\nPackage: ${packageName} x${seats}\nTotal: ₹${totalPrice}\n\nPlease confirm my booking!`
    );
    document.getElementById('conf-whatsapp').href = `https://wa.me/${waNum}?text=${waMsg}`;

    goToStep(3);
    document.getElementById('book').scrollIntoView({ behavior: 'smooth' });

  } catch (err) {
    console.error('Booking failed:', err);
    alert('Booking failed: ' + (err.message || 'Unknown error. Please try again.'));
  } finally {
    btn.disabled = false;
    btn.textContent = 'Confirm Booking →';
  }
}

// ===== LOAD TRIPS ON FIREBASE READY =====
window.addEventListener('firebase-ready', async () => {
  const grid = document.getElementById('webTripsGrid');
  const loadingMsg = document.getElementById('tripsLoadingMsg');
  const errorMsg = document.getElementById('tripsErrorMsg');

  try {
    const { db, collection, getDocs, query, where } = window._fbApp;
    const q = query(collection(db, 'trips'), where('status', '==', 'published'));
    const snap = await getDocs(q);

    _allWebTrips = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    loadingMsg.style.display = 'none';
    renderTripCards(_allWebTrips);
  } catch (err) {
    console.error('Failed to load trips:', err);
    loadingMsg.style.display = 'none';
    errorMsg.style.display = 'block';
  }
});

// ===== GSAP ANIMATIONS =====
function initAnimations() {
  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // 1. Hero Content Load Animation
  const heroTimeline = gsap.timeline();
  heroTimeline.from('.hero-badge', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 })
              .from('.hero-title', { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
              .from('.hero-sub', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
              .from('.hero-actions', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');

  // 2. Hero Background Parallax
  gsap.to('.hero-bg', {
    yPercent: 30,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  // 3. Staggered Stats Reveal
  gsap.from('.stat', {
    scrollTrigger: {
      trigger: '.hero-stats',
      start: 'top 85%'
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'back.out(1.7)'
  });

  // 4. Feature Cards Staggered Reveal
  gsap.from('.feature-card', {
    scrollTrigger: {
      trigger: '.features',
      start: 'top 75%'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out'
  });

  // 5. How It Works Steps Sequence
  gsap.from('.step', {
    scrollTrigger: {
      trigger: '.steps',
      start: 'top 80%'
    },
    x: -30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.3,
    ease: 'power3.out'
  });
}

// Initialize animations once the DOM is fully ready
document.addEventListener('DOMContentLoaded', () => {
  // Give a tiny delay to ensure everything is painted
  setTimeout(initAnimations, 100);
});
