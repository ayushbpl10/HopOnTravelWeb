async function initTripPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const tripId = urlParams.get('id');

  const loadingState = document.getElementById('loadingState');
  const errorState = document.getElementById('errorState');
  const tripContent = document.getElementById('tripContent');

  if (!tripId) {
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
    return;
  }

  let tripData = null;

  const DEMO_TRIP = {
    id: 'demo',
    title: 'Harishchandragad & Kokankada Trek',
    description: 'Explore the mighty Harishchandragad fort, ancient Kedareshwar cave, and experience the breathtaking drop of Kokankada cliff. Overnight trek with camping & sunrise view.',
    category: 'Trekking',
    destination: 'Harishchandragad',
    vendorName: 'Sahyadri Trekkers (Verified Partner)',
    vendorId: 'demo',
    packages: [
      { name: 'Pune Transport Package', price: 999 },
      { name: 'Mumbai Transport Package', price: 1099 }
    ],
    batches: [
      { id: 'b1', dateDuration: '05-06 Sep (Sat night to Sun night)', totalSeats: 20, bookedSeats: 2 }
    ],
    pickupPoints: [
      { location: 'Pune - Shivajinagar / Swargate', time: '10:00 PM' },
      { location: 'Mumbai - Dadar / Thane', time: '10:30 PM' }
    ],
    inclusions: ['To & Fro Bus Transport', 'Breakfast & Tea (1x)', 'Lunch (1x)', 'Trek Leader Expertise', 'First Aid'],
    exclusions: ['Personal Expenses', 'Dinner on Day 1', 'Anything not mentioned in inclusions'],
    structuredItinerary: [
      { day: 1, title: 'Night Departure', description: 'Overnight journey from Pune/Mumbai to Khireshwar base village.' },
      { day: 2, title: 'Ascend & Kokankada Sunset/Sunrise', description: 'Early morning climb via Tolar Khind, explore Kedareshwar cave & Harishchandreshwar temple, cliff views at Kokankada, evening return.' }
    ],
    images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80']
  };

  try {
    if (tripId === 'demo') {
      tripData = DEMO_TRIP;
    } else {
      const { db, doc, getDoc } = window._fbApp;
      const tripRef = doc(db, 'trips', tripId);
      const tripSnap = await getDoc(tripRef);

      if (tripSnap.exists()) {
        tripData = { id: tripSnap.id, ...tripSnap.data() };
      } else {
        tripData = DEMO_TRIP;
      }
    }

    // Populate basic fields
    document.title = `${tripData.title} | Ab Toh Ghoom Le`;
    document.getElementById('tripTitle').textContent = tripData.title || 'Trip Details';
    document.getElementById('tripDesc').textContent = tripData.description || '';
    document.getElementById('tripVendor').textContent = tripData.vendorName || 'Verified Vendor';

    // Set vendor profile link
    const vendorLink = document.getElementById('vendorLink');
    const vId = tripData.vendorId || tripData.vendorName;
    if (vId) {
      vendorLink.href = `vendor.html?id=${encodeURIComponent(vId)}`;
    }

    // Set Image
    if (tripData.images && tripData.images.length > 0) {
      document.getElementById('tripImage').src = tripData.images[0];
    } else {
      document.getElementById('tripImage').src = 'hero.png';
    }

    // Date
    if (tripData.batches && tripData.batches.length > 0) {
      document.getElementById('tripDate').textContent = tripData.batches[0].dateDuration;
    } else {
      document.getElementById('tripDate').textContent = 'Upcoming Dates';
    }

    // Price
    let price = tripData.price || 0;
    if (tripData.packages && tripData.packages.length > 0) {
      price = Math.min(...tripData.packages.map(p => p.price || 0));
    }
    document.getElementById('tripPrice').textContent = `₹${price}`;

    // Inclusions & Exclusions
    const incExcSection = document.getElementById('incExcSection');
    const incBox = document.getElementById('incBox');
    const excBox = document.getElementById('excBox');
    const incList = document.getElementById('incList');
    const excList = document.getElementById('excList');

    let hasIncExc = false;

    if (tripData.inclusions && tripData.inclusions.length > 0) {
      hasIncExc = true;
      incBox.style.display = 'block';
      incList.innerHTML = tripData.inclusions.map(item => `
        <div class="tlist-item">
          <span class="ticon-check">✓</span>
          <span>${item}</span>
        </div>
      `).join('');
    }

    if (tripData.exclusions && tripData.exclusions.length > 0) {
      hasIncExc = true;
      excBox.style.display = 'block';
      excList.innerHTML = tripData.exclusions.map(item => `
        <div class="tlist-item">
          <span class="ticon-cross">✕</span>
          <span>${item}</span>
        </div>
      `).join('');
    }

    if (hasIncExc) {
      incExcSection.style.display = 'grid';
    }

    // Itinerary
    const itinerarySection = document.getElementById('itinerarySection');
    const itineraryList = document.getElementById('itineraryList');

    if (tripData.structuredItinerary && tripData.structuredItinerary.length > 0) {
      itinerarySection.style.display = 'block';
      itineraryList.innerHTML = tripData.structuredItinerary.map((dayItem, idx) => `
        <div class="titinerary-card">
          <div class="titinerary-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
            <span>Day ${dayItem.day}: ${dayItem.title}</span>
            <span style="color: var(--yellow);">▼</span>
          </div>
          <div class="titinerary-body" style="${idx === 0 ? 'display: block;' : 'display: none;'}">
            <p>${dayItem.description}</p>
          </div>
        </div>
      `).join('');
    } else if (tripData.itinerary) {
      const days = tripData.itinerary.split('Day ').filter(d => d.trim() !== '');
      if (days.length > 0) {
        itinerarySection.style.display = 'block';
        itineraryList.innerHTML = days.map((dayText, idx) => {
          const lines = dayText.trim().split('\n');
          const title = 'Day ' + lines[0];
          const desc = lines.slice(1).join('\n');
          return `
            <div class="titinerary-card">
              <div class="titinerary-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
                <span>${title}</span>
                <span style="color: var(--yellow);">▼</span>
              </div>
              <div class="titinerary-body" style="${idx === 0 ? 'display: block;' : 'display: none;'}">
                <p style="white-space: pre-line;">${desc}</p>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Pickup Points
    if (tripData.pickupPoints && tripData.pickupPoints.length > 0) {
      const pickupSection = document.getElementById('pickupSection');
      const pickupList = document.getElementById('pickupList');
      pickupSection.style.display = 'block';
      pickupList.innerHTML = tripData.pickupPoints.map(p => `
        <div class="tpickup-item">
          <div class="tpickup-icon">📍</div>
          <div>
            <div class="tpickup-loc">${p.location}</div>
            <div class="tpickup-time">⏰ Pickup Time: ${p.time}</div>
          </div>
        </div>
      `).join('');
    }

    // Deep Links & Share
    const openAppBtn = document.getElementById('openAppBtn');
    openAppBtn.href = `hopontravel://trip/${tripId}`;

    const shareWebBtn = document.getElementById('shareWebBtn');
    shareWebBtn.onclick = () => {
      const shareUrl = window.location.href;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl);
        alert('Web Trip link copied to clipboard!');
      } else {
        alert(`Share URL: ${shareUrl}`);
      }
    };

    // Inject Meta Tags for SEO & Social Sharing
    const ogTitle = `${tripData.title} | Ab Toh Ghoom Le`;
    const ogDesc = tripData.description ? tripData.description.substring(0, 160) : 'Book this trip on Ab Toh Ghoom Le';
    const ogImage = (tripData.images && tripData.images.length > 0) ? tripData.images[0] : 'https://abtohghoomle.com/hero.png';
    const ogUrl = `https://abtohghoomle.com/trip.html?id=${tripId}`;

    const metaTags = {
      'og:title': ogTitle,
      'og:description': ogDesc,
      'og:image': ogImage,
      'og:url': ogUrl,
      'og:type': 'website',
      'twitter:card': 'summary_large_image',
    };
    Object.entries(metaTags).forEach(([prop, content]) => {
      let meta = document.querySelector(`meta[property="${prop}"]`) || document.querySelector(`meta[name="${prop}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(prop.startsWith('og:') ? 'property' : 'name', prop);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // Populate Booking Selectors
    window._currentTripData = tripData;

    const batchSel = document.getElementById('tbBatchSelect');
    if (batchSel && tripData.batches) {
      batchSel.innerHTML = tripData.batches.map(b =>
        `<option value="${b.id}" data-seats="${b.totalSeats - b.bookedSeats}">${b.dateDuration} (${b.totalSeats - b.bookedSeats} seats left)</option>`
      ).join('');
    }

    const pkgSel = document.getElementById('tbPackageSelect');
    if (pkgSel && tripData.packages) {
      pkgSel.innerHTML = tripData.packages.map(p =>
        `<option value="${p.name}" data-price="${p.price}">${p.name} — ₹${p.price.toLocaleString('en-IN')}</option>`
      ).join('');
    }

    // Generate CAPTCHA
    window._tbCaptchaA = Math.floor(Math.random() * 10) + 1;
    window._tbCaptchaB = Math.floor(Math.random() * 10) + 1;
    const captchaQ = document.getElementById('tbCaptchaQ');
    if (captchaQ) captchaQ.textContent = `${window._tbCaptchaA} + ${window._tbCaptchaB}`;

    updateTripPriceDisplay();

    loadingState.style.display = 'none';
    tripContent.style.display = 'block';

  } catch (err) {
    console.error("Error loading web trip details:", err);
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
  }
}

if (window._fbApp) {
  initTripPage();
} else {
  window.addEventListener('firebase-ready', initTripPage);
}

// Update Live Price Display on Trip Page
function updateTripPriceDisplay() {
  const pkgSel = document.getElementById('tbPackageSelect');
  const seatsInput = document.getElementById('tbSeatsInput');
  const display = document.getElementById('tbPriceDisplay');
  if (!pkgSel || !seatsInput || !display) return;

  const selectedOpt = pkgSel.selectedOptions[0];
  if (!selectedOpt) return;
  const pricePerSeat = parseInt(selectedOpt.dataset.price, 10) || 0;
  const seats = parseInt(seatsInput.value, 10) || 1;
  display.textContent = `₹${(pricePerSeat * seats).toLocaleString('en-IN')}`;
}

// XSS Sanitizer for Trip Page
function sanitizeTripInput(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
}

// Rate Limiting Check (Max 3 per 2 minutes)
function checkTripRateLimit() {
  const now = Date.now();
  const attempts = JSON.parse(localStorage.getItem('_tb_rate_limit') || '[]');
  const recentAttempts = attempts.filter(ts => now - ts < 120000);
  if (recentAttempts.length >= 3) return false;
  recentAttempts.push(now);
  localStorage.setItem('_tb_rate_limit', JSON.stringify(recentAttempts));
  return true;
}

// Submit Booking from Trip Page
async function submitTripPageBooking() {
  const tripData = window._currentTripData;
  if (!tripData) return alert('Trip details not ready.');

  // 1. Anti-bot Honeypot Check
  const hpField = document.getElementById('tb_hp_field');
  if (hpField && hpField.value) {
    console.warn('Bot submission blocked via honeypot.');
    alert('Booking submitted.');
    return;
  }

  // 2. Client Rate Limiting
  if (!checkTripRateLimit()) {
    return alert('Too many booking requests. Please wait 2 minutes before trying again.');
  }

  // 3. Inputs & Sanitization
  const name = sanitizeTripInput(document.getElementById('tbTravelerName').value);
  const phone = sanitizeTripInput(document.getElementById('tbTravelerPhone').value);
  const email = sanitizeTripInput(document.getElementById('tbTravelerEmail').value);
  const consent = document.getElementById('tbConsentCheck').checked;
  const captchaAns = parseInt(document.getElementById('tbCaptchaAns').value, 10);
  const pkgSel = document.getElementById('tbPackageSelect');
  const batchSel = document.getElementById('tbBatchSelect');
  const seats = parseInt(document.getElementById('tbSeatsInput').value, 10) || 1;

  if (!name || !phone || !email) return alert('Please fill in all required fields.');
  if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) return alert('Please enter a valid 10-digit phone number.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert('Please enter a valid email address.');
  if (!consent) return alert('You must accept the risks involved before booking.');
  if (captchaAns !== window._tbCaptchaA + window._tbCaptchaB) return alert(`Security check failed. Hint: ${window._tbCaptchaA} + ${window._tbCaptchaB} = ?`);

  const btn = document.getElementById('tbSubmitBtn');
  btn.disabled = true;
  btn.textContent = 'Processing Booking...';

  try {
    if (!window._fbApp) {
      alert('Connecting to database... Please wait a few seconds and try again.');
      return;
    }
    const { db, auth, collection, addDoc, signInAnonymously, doc, getDoc, updateDoc } = window._fbApp;

    if (auth && !auth.currentUser) {
      try {
        await signInAnonymously(auth);
      } catch (authErr) {
        console.warn('Anonymous auth failed (non-fatal):', authErr.message);
      }
    }

    const pkgOpt = pkgSel.selectedOptions[0];
    const packageName = pkgOpt?.value || '';
    const pricePerSeat = parseInt(pkgOpt?.dataset.price, 10) || 0;
    const totalPrice = pricePerSeat * seats;
    const batchId = batchSel ? batchSel.value : 'default';
    const bookingId = 'ATGL-' + Math.floor(10000 + Math.random() * 90000).toString();

    const bookingData = {
      tripId: tripData.id,
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
      vendorId: tripData.vendorId || null,
      source: 'web_trip_page'
    };

    if (db && collection && addDoc) {
      await addDoc(collection(db, 'bookings'), bookingData);
    }

    // Update batch bookedSeats if trip exists in Firestore
    try {
      if (tripData.id && tripData.id !== 'demo') {
        const tripRef = doc(db, 'trips', tripData.id);
        const tripSnap = await getDoc(tripRef);
        if (tripSnap.exists() && tripSnap.data().batches) {
          const updatedBatches = tripSnap.data().batches.map(b =>
            b.id === batchId ? { ...b, bookedSeats: (b.bookedSeats || 0) + seats } : b
          );
          await updateDoc(tripRef, { batches: updatedBatches });
        }
      }
    } catch (seatErr) {
      console.warn('Could not update batch seat count (non-fatal):', seatErr.message);
    }

    // Populate result ticket
    document.getElementById('tbResBookingId').textContent = bookingId;
    document.getElementById('tbResName').textContent = name;
    document.getElementById('tbResPackage').textContent = packageName;
    document.getElementById('tbResSeats').textContent = seats;
    document.getElementById('tbResTotal').textContent = `₹${totalPrice.toLocaleString('en-IN')}`;

    const trackLink = document.getElementById('tbResTrackLink');
    if (trackLink) {
      trackLink.href = `traveller.html?bookingId=${encodeURIComponent(bookingId)}`;
    }

    document.getElementById('tbTicketResult').style.display = 'block';
    document.getElementById('tbTicketResult').scrollIntoView({ behavior: 'smooth' });

  } catch (err) {
    console.error('Trip page booking error:', err);
    alert('Booking error: ' + (err.message || 'Please try again.'));
  } finally {
    btn.disabled = false;
    btn.textContent = 'Confirm Booking & Generate Ticket →';
  }
}
