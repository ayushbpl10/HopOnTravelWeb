// ===== VENDOR PORTAL CONTROLLER =====

let _vendorUser = null;
let _vendorTrips = [];
let _vendorBookings = [];
let _tripsUnsub = null;
let _bookingsUnsub = null;
let _currentStatusFilter = 'all';

// Live GPS broadcast state
let _geoWatchId = null;
let _broadcastingTripId = null;

// Templates repository
const TEMPLATES = {
  harishchandragad: {
    title: 'Harishchandragad & Kokankada Trek',
    destination: 'Harishchandragad, Ahmednagar',
    category: 'Trekking',
    price: 1299,
    desc: 'Trek to the ancient fort of Harishchandragad, explore Kedareshwar cave, and stand atop the mighty Kokankada cliff. Includes overnight tent stay & bonfire.',
    date: 'Upcoming Weekend (Sat night to Sun)',
    seats: 30,
    packages: 'Pune Transport:1299, Mumbai Transport:1499, Base Village:899',
    pickups: 'Swargate - 10:00 PM, Shivajinagar - 10:30 PM, Dadar - 10:30 PM',
    inclusions: 'To & Fro Private Bus Transport, Breakfast & Tea, Authentic Village Lunch, First Aid, Trek Leaders',
    exclusions: 'Dinner on Saturday night, Personal expenses, Bottled water',
    itinerary: 'Day 1: Night departure from Pune/Mumbai. Overnight journey to Khireshwar.\nDay 2: Early morning climb, visit ancient Kedareshwar cave & Harishchandreshwar temple, cliff views at Kokankada, late afternoon descend & return by night.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
  },
  rajmachi: {
    title: 'Rajmachi Fireflies & Fort Camping',
    destination: 'Lonavala / Karjat',
    category: 'Camping',
    price: 1399,
    desc: 'Witness millions of glowing fireflies illuminating the Sahyadri forest trails around Rajmachi fort. Lakeside tents, barbecue, and starry night camping.',
    date: 'Upcoming Saturday - Sunday',
    seats: 25,
    packages: 'Standard Camping:1399, Couple Tent:1699, Without Transport:999',
    pickups: 'Lonavala Railway Station - 04:00 PM, Swargate - 02:30 PM',
    inclusions: 'Shared/Couple Tent stay, Evening Snacks & Tea, Barbecue (Limited), Unlimited Village Dinner, Breakfast, Forest Entry',
    exclusions: 'Train tickets, Extra personal expenses',
    itinerary: 'Day 1: Reach Udhewadi base village, sunset walk, evening fireflies trail with expert guide, campfire & dinner.\nDay 2: Morning sunrise trek to Shrivardhan fort, breakfast, checkout by 11 AM.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
  },
  pawna: {
    title: 'Pawna Lake Lakeside Glamping',
    destination: 'Pawna Lake, Kamshet',
    category: 'Camping',
    price: 1099,
    desc: 'Peaceful lakeside camping with live acoustic music, water games, sunset viewpoints, and cozy weatherproof tents under the stars.',
    date: 'Daily Bookings Available',
    seats: 50,
    packages: 'Standard Tent:1099, Couple Glamping Tent:1499',
    pickups: 'Direct Reporting at Campsite / Kamshet Station Pickups available',
    inclusions: 'Lakeside Tent Stay, Evening Snacks, Barbecue (Veg/Non-veg), Unlimited Dinner, Campfire, Morning Breakfast',
    exclusions: 'Transport to campsite, Personal orders',
    itinerary: 'Day 1: Check-in at 4 PM, welcome drink & snacks, sunset boat ride, barbecue & campfire with acoustic music.\nDay 2: Morning lake breeze, breakfast, check-out by 10 AM.',
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80'
  },
  gokarna: {
    title: 'Gokarna Beach Trek & Cafe Hopping',
    destination: 'Gokarna, Karnataka',
    category: 'Backpacking',
    price: 3999,
    desc: 'Backpack across 5 pristine coastal beaches (Kudle, Om, Half Moon, Paradise, Nirvana). Beach camping, cliff diving, and cafe sunsets.',
    date: 'Long Weekend (Thu night to Sun night)',
    seats: 20,
    packages: 'Ex-Pune/Mumbai Sleeper:4999, Ex-Gokarna:3499',
    pickups: 'Swargate - 06:00 PM, Mumbai Borivali - 04:00 PM',
    inclusions: 'Sleeper bus tickets, 2 Nights Beach Stay, 2 Breakfasts, 1 Beach Dinner, Guide, Local ferries',
    exclusions: 'Cafe meals, Watersports',
    itinerary: 'Day 1: Overnight travel to Gokarna.\nDay 2: Check-in at Kudle beach, sunset at Om beach, cafe dinner.\nDay 3: Beach cliff trek across 5 beaches, night bioluminescence hunt.\nDay 4: Morning temple & town walk, evening departure.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
  }
};

const DEMO_VENDOR_USER = {
  uid: 'demo_vendor_sahyadri',
  displayName: 'Sahyadri Trekkers (Demo Organiser)',
  email: 'sahyadri.demo@hopontravel.com',
  photoURL: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=200&q=80',
  role: 'vendor'
};

const DEMO_VENDOR_TRIPS = [
  {
    id: 'demo',
    title: 'Harishchandragad & Kokankada Trek',
    destination: 'Harishchandragad, Ahmednagar',
    category: 'Trekking',
    price: 1299,
    description: 'Explore the mighty Harishchandragad fort, ancient Kedareshwar cave, and experience the breathtaking drop of Kokankada cliff. Overnight trek with camping & sunrise view.',
    batches: [{ id: 'b1', dateDuration: 'Upcoming Weekend (Sat-Sun)', totalSeats: 30, bookedSeats: 8 }],
    packages: [{ name: 'Pune Transport', price: 1299 }, { name: 'Mumbai Transport', price: 1499 }],
    pickupPoints: [{ location: 'Swargate', time: '10:00 PM' }, { location: 'Dadar', time: '10:30 PM' }],
    inclusions: ['Bus Transport', 'Breakfast & Tea', 'Lunch', 'Trek Leader Expertise'],
    exclusions: ['Personal Expenses'],
    itinerary: 'Day 1: Night departure.\nDay 2: Early morning climb, caves, sunset/sunrise at Kokankada.',
    images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'],
    status: 'published',
    tripStatus: 'upcoming',
    vendorId: 'demo_vendor_sahyadri',
    vendorName: 'Sahyadri Trekkers',
    vendorWhatsApp: '+919876543210'
  },
  {
    id: 'rajmachi-demo',
    title: 'Rajmachi Fireflies & Fort Camping',
    destination: 'Lonavala / Karjat',
    category: 'Camping',
    price: 1399,
    description: 'Witness millions of glowing fireflies illuminating the Sahyadri forest trails around Rajmachi fort.',
    batches: [{ id: 'b2', dateDuration: 'Upcoming Saturday - Sunday', totalSeats: 25, bookedSeats: 6 }],
    packages: [{ name: 'Standard Camping', price: 1399 }, { name: 'Couple Tent', price: 1699 }],
    pickupPoints: [{ location: 'Lonavala Station', time: '04:00 PM' }],
    inclusions: ['Tent stay', 'Barbecue', 'Dinner', 'Breakfast'],
    exclusions: ['Train tickets'],
    itinerary: 'Day 1: Base village, fireflies trail, campfire.\nDay 2: Sunrise fort trek, breakfast.',
    images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'],
    status: 'published',
    tripStatus: 'upcoming',
    vendorId: 'demo_vendor_sahyadri',
    vendorName: 'Sahyadri Trekkers',
    vendorWhatsApp: '+919876543210'
  }
];

const DEMO_VENDOR_BOOKINGS = [
  {
    id: 'demo_vb_1',
    bookingId: 'ATGL-78901',
    tripId: 'demo',
    batchId: 'b1',
    packageName: 'Pune Transport Package',
    travelerName: 'Pooja Sharma',
    travelerPhone: '+91 98765 43210',
    travelerEmail: 'pooja.demo@hopontravel.com',
    seats: 2,
    totalPrice: 2598,
    status: 'confirmed',
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'demo_vb_2',
    bookingId: 'ATGL-45678',
    tripId: 'rajmachi-demo',
    batchId: 'b2',
    packageName: 'Standard Camping',
    travelerName: 'Rahul Verma',
    travelerPhone: '+91 98220 12345',
    travelerEmail: 'rahul.verma@example.com',
    seats: 1,
    totalPrice: 1399,
    status: 'pending',
    createdAt: Date.now() - 86400000
  },
  {
    id: 'demo_vb_3',
    bookingId: 'ATGL-10293',
    tripId: 'demo',
    batchId: 'b1',
    packageName: 'Mumbai Transport',
    travelerName: 'Amit Desai',
    travelerPhone: '+91 99887 66554',
    travelerEmail: 'amit.desai@example.com',
    seats: 4,
    totalPrice: 5996,
    status: 'confirmed',
    createdAt: Date.now() - 86400000 * 3
  }
];

function loginAsDemoVendor() {
  localStorage.setItem('hopon_demo_vendor', 'true');
  _vendorUser = DEMO_VENDOR_USER;
  onVendorSignedIn(DEMO_VENDOR_USER);
}

function isDemoAccount() {
  return localStorage.getItem('hopon_demo_vendor') === 'true' || (_vendorUser && _vendorUser.uid === DEMO_VENDOR_USER.uid);
}

function showDemoAuthModal(actionName) {
  const overlay = document.getElementById('demoAuthModalOverlay');
  const msg = document.getElementById('demoAuthModalMsg');
  if (msg && actionName) {
    msg.innerHTML = `You are currently exploring in <strong>Demo Mode</strong>. Demo accounts are read-only. To <strong>${escapeHtml(actionName)}</strong>, please create or connect your real account via Google login.`;
  }
  if (overlay) {
    overlay.classList.add('open');
  } else {
    alert(`Google Sign-In Required: Demo accounts are read-only. To ${actionName || 'perform this action'}, please sign in with your Google account.`);
  }
}

function closeDemoAuthModal() {
  const overlay = document.getElementById('demoAuthModalOverlay');
  if (overlay) overlay.classList.remove('open');
}

function handleDemoAuthModalLogin() {
  closeDemoAuthModal();
  loginVendorWithGoogle();
}

function initVendorPortal() {
  // Auto-restore demo vendor if active
  if (localStorage.getItem('hopon_demo_vendor') === 'true') {
    _vendorUser = DEMO_VENDOR_USER;
    onVendorSignedIn(DEMO_VENDOR_USER);
    return;
  }

  const { auth, onAuthStateChanged, getRedirectResult } = window._fb;

  // Handle redirect login result if returning from redirect sign-in
  if (getRedirectResult) {
    getRedirectResult(auth).then(async (result) => {
      if (result && result.user) {
        _vendorUser = result.user;
        await onVendorSignedIn(result.user);
      }
    }).catch(err => {
      console.warn('Vendor redirect auth check:', err.message);
    });
  }

  // If already authenticated in current session, sign in immediately
  if (auth && auth.currentUser) {
    _vendorUser = auth.currentUser;
    onVendorSignedIn(auth.currentUser);
  }

  onAuthStateChanged(auth, async (user) => {
    if (localStorage.getItem('hopon_demo_vendor') === 'true') return;
    if (user) {
      _vendorUser = user;
      await onVendorSignedIn(user);
    } else {
      _vendorUser = null;
      onVendorSignedOut();
    }
  });
}

if (window._fb) {
  initVendorPortal();
} else {
  window.addEventListener('firebase-vendor-portal-ready', initVendorPortal);
}

// ===== VENDOR GOOGLE AUTHENTICATION =====
async function loginVendorWithGoogle() {
  const { auth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } = window._fb;
  const provider = new GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');

  const btn = document.getElementById('vendorLoginBtn');
  const origText = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>⏳ Signing in...</span>';
  }

  // Active watcher: handles COOP isolation gracefully so user doesn't need to reload
  let authWatcher = null;
  const clearWatcher = () => {
    if (authWatcher) {
      clearInterval(authWatcher);
      authWatcher = null;
    }
  };

  authWatcher = setInterval(async () => {
    if (auth.currentUser) {
      clearWatcher();
      _vendorUser = auth.currentUser;
      await onVendorSignedIn(auth.currentUser);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = origText;
      }
    }
  }, 400);

  setTimeout(clearWatcher, 45000);

  try {
    const result = await signInWithPopup(auth, provider);
    clearWatcher();
    if (result && result.user) {
      _vendorUser = result.user;
      await onVendorSignedIn(result.user);
    }
  } catch (err) {
    clearWatcher();
    if (auth.currentUser) {
      _vendorUser = auth.currentUser;
      await onVendorSignedIn(auth.currentUser);
      return;
    }

    console.warn('Vendor popup sign in error/warning:', err);
    if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
      if (signInWithRedirect) {
        console.log('Falling back to vendor signInWithRedirect...');
        await signInWithRedirect(auth, provider);
        return;
      }
    }

    if (err.code !== 'auth/popup-closed-by-user') {
      alert('Could not sign in: ' + (err.message || 'Please check popup permissions.'));
    }
  } finally {
    if (btn && !_vendorUser) {
      btn.disabled = false;
      btn.innerHTML = origText;
    }
  }
}

async function handleVendorLogout() {
  localStorage.removeItem('hopon_demo_vendor');
  if (_tripsUnsub) _tripsUnsub();
  if (_bookingsUnsub) _bookingsUnsub();
  stopLiveBroadcast();
  _vendorUser = null;
  onVendorSignedOut();

  const { auth, signOut } = window._fb;
  if (auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  }
}

// Vendor Signed In
async function onVendorSignedIn(user) {
  document.getElementById('vendorLoggedOutBanner').style.display = 'none';
  document.getElementById('vendorLoggedInView').style.display = 'block';
  document.getElementById('vendorLoginBtn').style.display = 'none';
  const navDemoBtn = document.getElementById('loginDemoVendorNavBtn');
  if (navDemoBtn) navDemoBtn.style.display = 'none';

  // Render Nav Chip
  const navChip = document.getElementById('vendorNavChip');
  navChip.style.display = 'flex';
  navChip.innerHTML = `
    <div class="pnav-user-chip">
      <div class="pnav-avatar">
        ${user.photoURL ? `<img src="${user.photoURL}" alt="${user.displayName}" />` : (user.displayName || 'V').charAt(0).toUpperCase()}
      </div>
      <div class="pnav-user-meta">
        <span class="pnav-user-name">${user.displayName || 'Travel Partner'}</span>
        <span class="pnav-user-role" style="color:var(--portal-primary);">Verified Partner</span>
      </div>
      <button class="p-btn p-btn-dark p-btn-sm" style="margin-left:0.5rem; padding:0.2rem 0.6rem;" onclick="handleVendorLogout()">Sign Out</button>
    </div>
  `;

  document.getElementById('vendorGreetingTitle').textContent = `Welcome, ${user.displayName || 'Organiser'}!`;
  
  // Update Storefront Link
  const storefrontLink = document.getElementById('publicStorefrontLink');
  storefrontLink.href = `vendor.html?id=${encodeURIComponent(user.uid)}`;

  // Instant demo vendor bypass (avoids Firestore network timeout)
  if (user.uid === DEMO_VENDOR_USER.uid) {
    document.getElementById('vSetBusinessName').value = 'Sahyadri Trekkers';
    document.getElementById('vSetWhatsApp').value = '+919876543210';
    document.getElementById('vSetInstagram').value = 'https://instagram.com/sahyadri_trekkers_demo';
    document.getElementById('vSetUpi').value = 'sahyadri.trekkers@okhdfcbank';
    listenToVendorTrips(user.uid);
    listenToVendorBookings(user.uid);
    return;
  }

  // Save/Update vendor role in users/{uid} and vendors/{uid}
  try {
    const { db, doc, getDoc, updateDoc } = window._fb;
    const userDocRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userDocRef);
    
    if (snap.exists()) {
      const data = snap.data();
      document.getElementById('vSetBusinessName').value = data.businessName || data.name || user.displayName || '';
      document.getElementById('vSetWhatsApp').value = data.whatsappNumber || data.whatsapp || data.phone || '';
      document.getElementById('vSetInstagram').value = data.instagramUrl || '';
      document.getElementById('vSetUpi').value = data.upiId || (Array.isArray(data.upiIds) ? data.upiIds.join(', ') : '');
      document.getElementById('vSetTerms').value = data.termsAndConditions || '';
      if (data.paymentSettings && data.paymentSettings.razorpayKeyId) {
        document.getElementById('vSetRazorpayKey').value = data.paymentSettings.razorpayKeyId;
      }
    } else {
      const { setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
      await setDoc(userDocRef, {
        name: user.displayName || 'Verified Organiser',
        email: user.email || '',
        role: 'vendor',
        createdAt: Date.now()
      });
      document.getElementById('vSetBusinessName').value = user.displayName || '';
    }
  } catch (err) {
    console.warn('Vendor profile setup error:', err);
  }

  // Subscribe to trips and bookings
  listenToVendorTrips(user.uid);
  listenToVendorBookings(user.uid);
}

// Vendor Signed Out
function onVendorSignedOut() {
  document.getElementById('vendorLoggedOutBanner').style.display = 'block';
  document.getElementById('vendorLoggedInView').style.display = 'none';
  document.getElementById('vendorLoginBtn').style.display = 'inline-flex';
  const navDemoBtn = document.getElementById('loginDemoVendorNavBtn');
  if (navDemoBtn) navDemoBtn.style.display = 'inline-flex';
  document.getElementById('vendorNavChip').style.display = 'none';
  _vendorTrips = [];
  _vendorBookings = [];
}

// ===== REAL-TIME TRIPS STREAM =====
function listenToVendorTrips(vendorId) {
  if (vendorId === DEMO_VENDOR_USER.uid) {
    _vendorTrips = [...DEMO_VENDOR_TRIPS];
    document.getElementById('vStatTotalTrips').textContent = _vendorTrips.length;
    renderVendorTrips();
    updateTripFilterOptions();
    return;
  }

  const { db, collection, query, where, onSnapshot } = window._fb;

  const q = query(collection(db, 'trips'), where('vendorId', '==', vendorId));
  _tripsUnsub = onSnapshot(q, (snapshot) => {
    _vendorTrips = [];
    snapshot.forEach(docSnap => {
      _vendorTrips.push({ id: docSnap.id, ...docSnap.data() });
    });
    // Sort newest first
    _vendorTrips.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    document.getElementById('vStatTotalTrips').textContent = _vendorTrips.length;
    renderVendorTrips();
    updateTripFilterOptions();
  }, (err) => {
    console.error('Error fetching trips:', err);
    document.getElementById('vendorTripsListContainer').innerHTML = `
      <div class="p-empty" style="grid-column: 1 / -1;">
        <p style="color:var(--portal-danger);">Failed to load trips. Please check connection.</p>
      </div>
    `;
  });
}

function renderVendorTrips() {
  const container = document.getElementById('vendorTripsListContainer');

  if (!_vendorTrips.length) {
    container.innerHTML = `
      <div class="p-empty" style="grid-column: 1 / -1;">
        <div class="p-empty-icon">🎒</div>
        <h3>No Trips Listed Yet</h3>
        <p>List your first weekend trek, camping trip, or road tour in under 2 minutes. You can also import directly from WhatsApp!</p>
        <button class="p-btn p-btn-yellow" onclick="openCreateTripModal()">+ List Your First Trip</button>
      </div>
    `;
    return;
  }

  container.innerHTML = _vendorTrips.map(trip => {
    const minPrice = trip.packages && trip.packages.length
      ? Math.min(...trip.packages.map(p => p.price))
      : (trip.price || 0);

    const totalSeats = trip.batches && trip.batches.length
      ? trip.batches.reduce((a, b) => a + (b.totalSeats - b.bookedSeats), 0)
      : 0;

    const dateStr = trip.batches && trip.batches.length
      ? trip.batches[0].dateDuration
      : 'Upcoming';

    const img = (trip.images && trip.images[0]) ? trip.images[0] : 'hero.png';
    const isLive = trip.tripStatus === 'started';

    return `
      <div class="p-stat-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between;">
        <div style="position: relative; height: 180px;">
          <img src="${img}" alt="${escapeHtml(trip.title)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='hero.png'" />
          <span class="p-badge p-badge-confirmed" style="position: absolute; top: 12px; left: 12px;">
            ${escapeHtml(trip.category || 'Trek')}
          </span>
          ${isLive ? `
            <span class="p-badge p-badge-confirmed" style="position: absolute; top: 12px; right: 12px; background: rgba(16,185,129,0.9); color:#fff;">
              ● LIVE GPS
            </span>
          ` : ''}
        </div>

        <div style="padding: 1.4rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h4 style="font-size: 1.2rem; font-weight: 800; color: #fff; margin-bottom: 0.3rem;">${escapeHtml(trip.title)}</h4>
            <p style="color: var(--portal-muted); font-size: 0.85rem; margin-bottom: 0.8rem;">📍 ${escapeHtml(trip.destination || 'Destination')}</p>
            <p style="color: #cbd5e1; font-size: 0.85rem; margin-bottom: 1rem;">📅 ${escapeHtml(dateStr)} • <strong style="color:var(--portal-primary);">${totalSeats} seats left</strong></p>
            <div style="font-size: 1.3rem; font-weight: 900; color: var(--portal-primary); margin-bottom: 1.2rem;">
              ₹${minPrice.toLocaleString('en-IN')} <span style="font-size: 0.75rem; color: var(--portal-muted); font-weight: 400;">per seat</span>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.5rem; border-top: 1px solid var(--portal-card-border); padding-top: 1rem;">
            <div style="display: flex; gap: 0.5rem;">
              <button class="p-btn p-btn-yellow p-btn-sm" style="flex: 1;" onclick="openEditTripModal('${trip.id}')">✏️ Edit</button>
              <button class="p-btn p-btn-danger p-btn-sm" onclick="confirmDeleteTrip('${trip.id}')">🗑️</button>
              <a href="trip.html?id=${encodeURIComponent(trip.id)}" target="_blank" class="p-btn p-btn-dark p-btn-sm">🔗 View</a>
            </div>
            <button class="p-btn p-btn-dark p-btn-sm" style="width: 100%;" onclick="openStartTripBroadcastModal('${trip.id}', '${escapeHtml(trip.title)}')">
              📡 ${isLive ? 'Manage Live GPS Broadcast' : 'Start Trip & Broadcast GPS'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ===== REAL-TIME BOOKINGS STREAM =====
function listenToVendorBookings(vendorId) {
  if (vendorId === DEMO_VENDOR_USER.uid) {
    _vendorBookings = [...DEMO_VENDOR_BOOKINGS];
    updateBookingMetrics();
    filterVendorBookings();
    return;
  }

  const { db, collection, query, where, onSnapshot } = window._fb;

  const q = query(collection(db, 'bookings'), where('vendorId', '==', vendorId));
  _bookingsUnsub = onSnapshot(q, (snapshot) => {
    _vendorBookings = [];
    snapshot.forEach(docSnap => {
      _vendorBookings.push({ id: docSnap.id, ...docSnap.data() });
    });
    // Sort newest first
    _vendorBookings.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    updateBookingMetrics();
    filterVendorBookings();
  }, (err) => {
    console.error('Error listening to vendor bookings:', err);
  });
}

function updateBookingMetrics() {
  const confirmed = _vendorBookings.filter(b => b.status === 'confirmed');
  const pending = _vendorBookings.filter(b => b.status === 'pending');
  const totalRev = confirmed.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  document.getElementById('vStatConfirmedBookings').textContent = confirmed.length;
  document.getElementById('vStatPendingBookings').textContent = pending.length;
  document.getElementById('vStatTotalRevenue').textContent = `₹${totalRev.toLocaleString('en-IN')}`;
}

function updateTripFilterOptions() {
  const select = document.getElementById('vBookingTripFilter');
  if (!select) return;
  const currentVal = select.value;

  select.innerHTML = '<option value="all">All Trips</option>' +
    _vendorTrips.map(t => `<option value="${t.id}">${escapeHtml(t.title)}</option>`).join('');

  if (currentVal) select.value = currentVal;
}

// ===== BOOKING FILTERS & TABLE RENDER =====
function setBookingStatusFilter(status, btn) {
  _currentStatusFilter = status;
  const pills = document.querySelectorAll('#vBookingStatusPills button');
  pills.forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  filterVendorBookings();
}

function filterVendorBookings() {
  const searchInput = (document.getElementById('vBookingSearchInput').value || '').toLowerCase().trim();
  const tripFilter = document.getElementById('vBookingTripFilter').value;

  let filtered = _vendorBookings;

  if (_currentStatusFilter !== 'all') {
    filtered = filtered.filter(b => b.status === _currentStatusFilter);
  }

  if (tripFilter && tripFilter !== 'all') {
    filtered = filtered.filter(b => b.tripId === tripFilter);
  }

  if (searchInput) {
    filtered = filtered.filter(b => 
      (b.travelerName && b.travelerName.toLowerCase().includes(searchInput)) ||
      (b.travelerPhone && b.travelerPhone.includes(searchInput)) ||
      (b.bookingId && b.bookingId.toLowerCase().includes(searchInput)) ||
      (b.id && b.id.toLowerCase().includes(searchInput))
    );
  }

  renderVendorBookingsTable(filtered);
}

function renderVendorBookingsTable(list) {
  const tbody = document.getElementById('vBookingsTableBody');

  if (!list.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; color: var(--portal-muted); padding: 3rem;">
          No bookings matching selected criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map(b => {
    const statusClass = b.status === 'confirmed' ? 'p-badge-confirmed' :
                        b.status === 'pending' ? 'p-badge-pending' : 'p-badge-cancelled';
    const dateStr = b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN') : 'N/A';

    return `
      <tr>
        <td>
          <strong style="color: var(--portal-primary);">${escapeHtml(b.bookingId || b.id)}</strong>
        </td>
        <td>
          <div style="font-weight: 700; color: #fff;">${escapeHtml(b.travelerName || 'Traveller')}</div>
          <div style="font-size: 0.8rem; color: var(--portal-muted);">${escapeHtml(b.travelerPhone || '')}</div>
        </td>
        <td>
          <div style="color: #fff;">${escapeHtml(b.packageName || 'Trip')}</div>
          <div style="font-size: 0.75rem; color: var(--portal-muted);">Trip ID: ${escapeHtml(b.tripId || 'N/A')}</div>
        </td>
        <td><strong>${b.seats || 1}</strong></td>
        <td><strong style="color: var(--portal-primary);">₹${(b.totalPrice || 0).toLocaleString('en-IN')}</strong></td>
        <td><span class="p-badge ${statusClass}">${b.status}</span></td>
        <td style="color: var(--portal-muted); font-size: 0.85rem;">${dateStr}</td>
        <td>
          <div style="display: flex; gap: 0.4rem;">
            ${b.status !== 'confirmed' ? `
              <button class="p-btn p-btn-success p-btn-sm" title="Approve Booking" onclick="updateBookingStatus('${b.id}', 'confirmed', '${b.tripId}', '${b.batchId}', ${b.seats || 1})">✓ Confirm</button>
            ` : ''}
            ${b.status !== 'cancelled' ? `
              <button class="p-btn p-btn-danger p-btn-sm" title="Reject / Cancel" onclick="updateBookingStatus('${b.id}', 'cancelled', '${b.tripId}', '${b.batchId}', ${b.seats || 1})">✕</button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Update Booking Status in Firestore
async function updateBookingStatus(bookingDocId, newStatus, tripId, batchId, seatsCount) {
  const allowedStatuses = ['confirmed', 'cancelled', 'pending', 'completed'];
  if (!allowedStatuses.includes(newStatus)) {
    return alert('Invalid booking status transition.');
  }

  if (isDemoAccount()) {
    showDemoAuthModal(`update booking status to ${newStatus}`);
    return;
  }

  if (window.SecurityThrottler && !window.SecurityThrottler.checkAndEnforce('update booking status')) {
    return;
  }

  const confirmMsg = newStatus === 'confirmed'
    ? 'Are you sure you want to approve and confirm this booking?'
    : 'Are you sure you want to cancel this booking?';

  if (!confirm(confirmMsg)) return;

  try {
    const { db, doc, updateDoc, getDoc } = window._fb;

    // 1. Update booking document status
    const bookingRef = doc(db, 'bookings', bookingDocId);
    await updateDoc(bookingRef, { status: newStatus });

    // 2. Adjust bookedSeats on the trip batch if valid
    if (tripId && batchId) {
      try {
        const tripRef = doc(db, 'trips', tripId);
        const tripSnap = await getDoc(tripRef);
        if (tripSnap.exists() && tripSnap.data().batches) {
          const delta = newStatus === 'confirmed' ? seatsCount : -seatsCount;
          const updatedBatches = tripSnap.data().batches.map(b => {
            if (b.id === batchId) {
              const current = b.bookedSeats || 0;
              return { ...b, bookedSeats: Math.max(0, current + delta) };
            }
            return b;
          });
          await updateDoc(tripRef, { batches: updatedBatches });
        }
      } catch (err) {
        console.warn('Batch seat adjustment non-fatal:', err);
      }
    }

    alert(`Booking marked as ${newStatus.toUpperCase()}`);
  } catch (err) {
    console.error('Failed to update booking status:', err);
    alert('Error updating booking: ' + err.message);
  }
}

// ===== DATA EXPORT: CSV & PRINT MANIFEST =====
function exportBookingsToCSV() {
  if (!_vendorBookings.length) {
    alert('No bookings available to export.');
    return;
  }

  let csv = 'Booking ID,Traveller Name,Phone,Email,Package,Seats,Total Amount,Status,Booking Date\n';

  _vendorBookings.forEach(b => {
    const dateStr = b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN') : 'N/A';
    csv += `"${b.bookingId || b.id}","${(b.travelerName || '').replace(/"/g, '""')}","${b.travelerPhone || ''}","${b.travelerEmail || ''}","${(b.packageName || '').replace(/"/g, '""')}",${b.seats || 1},${b.totalPrice || 0},"${b.status}","${dateStr}"\n`;
  });

  // Summary
  const confirmed = _vendorBookings.filter(b => b.status === 'confirmed');
  const revenue = confirmed.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  csv += `\nTotal Bookings,${_vendorBookings.length}\nTotal Confirmed,${confirmed.length}\nTotal Confirmed Revenue,₹${revenue}\n`;

  // Download Trigger
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Trip_Bookings_Report_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function printPassengerManifest() {
  if (!_vendorBookings.length) {
    alert('No bookings available to print.');
    return;
  }

  const printable = document.getElementById('printableManifest');
  printable.style.display = 'block';

  printable.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif; color: #000; background: #fff;">
      <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px;">
        <div>
          <h2 style="margin: 0;">Ab Toh Ghoom Le – Official Passenger Manifest</h2>
          <span style="font-size: 13px; color: #555;">Printed on: ${new Date().toLocaleString('en-IN')}</span>
        </div>
        <div style="text-align: right;">
          <strong>Total Passengers: ${_vendorBookings.reduce((sum, b) => sum + (b.seats || 1), 0)}</strong>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px;">
        <thead>
          <tr style="background: #eee; text-align: left;">
            <th style="padding: 8px; border: 1px solid #ccc;">Booking ID</th>
            <th style="padding: 8px; border: 1px solid #ccc;">Traveller Name</th>
            <th style="padding: 8px; border: 1px solid #ccc;">Phone</th>
            <th style="padding: 8px; border: 1px solid #ccc;">Package</th>
            <th style="padding: 8px; border: 1px solid #ccc;">Seats</th>
            <th style="padding: 8px; border: 1px solid #ccc;">Amount</th>
            <th style="padding: 8px; border: 1px solid #ccc;">Status</th>
            <th style="padding: 8px; border: 1px solid #ccc;">Signature / Check</th>
          </tr>
        </thead>
        <tbody>
          ${_vendorBookings.map(b => `
            <tr>
              <td style="padding: 6px 8px; border: 1px solid #ccc;"><strong>${b.bookingId || b.id}</strong></td>
              <td style="padding: 6px 8px; border: 1px solid #ccc;">${b.travelerName}</td>
              <td style="padding: 6px 8px; border: 1px solid #ccc;">${b.travelerPhone}</td>
              <td style="padding: 6px 8px; border: 1px solid #ccc;">${b.packageName || 'Trip'}</td>
              <td style="padding: 6px 8px; border: 1px solid #ccc;">${b.seats || 1}</td>
              <td style="padding: 6px 8px; border: 1px solid #ccc;">₹${b.totalPrice || 0}</td>
              <td style="padding: 6px 8px; border: 1px solid #ccc; text-transform: uppercase;">${b.status}</td>
              <td style="padding: 6px 8px; border: 1px solid #ccc; min-width: 60px;">[ &nbsp; ]</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  window.print();
  printable.style.display = 'none';
}

// ===== TRIP CREATION / EDITING =====
function openCreateTripModal() {
  document.getElementById('tripModalTitle').textContent = 'Create New Adventure';
  document.getElementById('saveTripSubmitBtn').textContent = 'Publish Adventure →';
  document.getElementById('editTripDocId').value = '';

  // Reset fields
  document.getElementById('tripFormTitle').value = '';
  document.getElementById('tripFormDestination').value = '';
  document.getElementById('tripFormCategory').value = 'Trekking';
  document.getElementById('tripFormPrice').value = '';
  document.getElementById('tripFormDesc').value = '';
  document.getElementById('tripFormBatchDate').value = '';
  document.getElementById('tripFormTotalSeats').value = '30';
  document.getElementById('tripFormPackages').value = '';
  document.getElementById('tripFormPickups').value = '';
  document.getElementById('tripFormInclusions').value = '';
  document.getElementById('tripFormExclusions').value = '';
  document.getElementById('tripFormItinerary').value = '';
  document.getElementById('tripFormImage').value = '';

  document.getElementById('tripModalOverlay').classList.add('open');
}

function openEditTripModal(tripId) {
  const trip = _vendorTrips.find(t => t.id === tripId);
  if (!trip) return;

  document.getElementById('tripModalTitle').textContent = 'Edit Trip Details';
  document.getElementById('saveTripSubmitBtn').textContent = 'Save Changes';
  document.getElementById('editTripDocId').value = trip.id;

  document.getElementById('tripFormTitle').value = trip.title || '';
  document.getElementById('tripFormDestination').value = trip.destination || '';
  document.getElementById('tripFormCategory').value = trip.category || 'Trekking';
  document.getElementById('tripFormPrice').value = trip.price || (trip.packages && trip.packages[0] ? trip.packages[0].price : '');
  document.getElementById('tripFormDesc').value = trip.description || '';

  if (trip.batches && trip.batches.length > 0) {
    document.getElementById('tripFormBatchDate').value = trip.batches[0].dateDuration || '';
    document.getElementById('tripFormTotalSeats').value = trip.batches[0].totalSeats || 30;
  }

  if (trip.packages && trip.packages.length > 0) {
    document.getElementById('tripFormPackages').value = trip.packages.map(p => `${p.name}:${p.price}`).join(', ');
  }

  if (trip.pickupPoints && trip.pickupPoints.length > 0) {
    document.getElementById('tripFormPickups').value = trip.pickupPoints.map(p => `${p.location} - ${p.time}`).join(', ');
  }

  document.getElementById('tripFormInclusions').value = (trip.inclusions || []).join(', ');
  document.getElementById('tripFormExclusions').value = (trip.exclusions || []).join(', ');
  document.getElementById('tripFormItinerary').value = trip.itinerary || '';
  document.getElementById('tripFormImage').value = (trip.images && trip.images[0]) ? trip.images[0] : '';

  document.getElementById('tripModalOverlay').classList.add('open');
}

function closeTripModal() {
  document.getElementById('tripModalOverlay').classList.remove('open');
}

function applyTripTemplate(key) {
  if (!key || !TEMPLATES[key]) return;
  const tpl = TEMPLATES[key];

  document.getElementById('tripFormTitle').value = tpl.title;
  document.getElementById('tripFormDestination').value = tpl.destination;
  document.getElementById('tripFormCategory').value = tpl.category;
  document.getElementById('tripFormPrice').value = tpl.price;
  document.getElementById('tripFormDesc').value = tpl.desc;
  document.getElementById('tripFormBatchDate').value = tpl.date;
  document.getElementById('tripFormTotalSeats').value = tpl.seats;
  document.getElementById('tripFormPackages').value = tpl.packages;
  document.getElementById('tripFormPickups').value = tpl.pickups;
  document.getElementById('tripFormInclusions').value = tpl.inclusions;
  document.getElementById('tripFormExclusions').value = tpl.exclusions;
  document.getElementById('tripFormItinerary').value = tpl.itinerary;
  document.getElementById('tripFormImage').value = tpl.image;
}

let _isSavingTrip = false;

// Save Trip to Firestore
async function handleSaveTrip() {
  if (_isSavingTrip) return;
  if (!_vendorUser) return alert('You must be logged in as a vendor.');

  const editId = document.getElementById('editTripDocId').value;

  if (isDemoAccount()) {
    showDemoAuthModal(editId ? 'save changes to this trip' : 'create and publish a new trip');
    return;
  }

  if (window.SecurityThrottler && !window.SecurityThrottler.checkAndEnforce('save trip')) {
    return;
  }
  const title = document.getElementById('tripFormTitle').value.trim();
  const destination = document.getElementById('tripFormDestination').value.trim();
  const category = document.getElementById('tripFormCategory').value;
  const price = parseInt(document.getElementById('tripFormPrice').value, 10) || 0;
  const description = document.getElementById('tripFormDesc').value.trim();
  const batchDate = document.getElementById('tripFormBatchDate').value.trim();
  const totalSeats = parseInt(document.getElementById('tripFormTotalSeats').value, 10) || 30;
  const packagesRaw = document.getElementById('tripFormPackages').value.trim();
  const pickupsRaw = document.getElementById('tripFormPickups').value.trim();
  const inclusionsRaw = document.getElementById('tripFormInclusions').value.trim();
  const exclusionsRaw = document.getElementById('tripFormExclusions').value.trim();
  const itinerary = document.getElementById('tripFormItinerary').value.trim();
  const image = document.getElementById('tripFormImage').value.trim() || 'hero.png';

  if (!title || !destination || !price) {
    return alert('Please fill in Trip Title, Destination, and Price.');
  }

  // Parse Packages
  let packages = [];
  if (packagesRaw) {
    packages = packagesRaw.split(',').map(item => {
      const parts = item.split(':');
      return {
        name: parts[0] ? parts[0].trim() : 'Standard',
        price: parseInt(parts[1], 10) || price
      };
    });
  } else {
    packages = [{ name: 'Standard Package', price }];
  }

  // Parse Pickup Points
  let pickupPoints = [];
  if (pickupsRaw) {
    pickupPoints = pickupsRaw.split(',').map(item => {
      const parts = item.split('-');
      return {
        location: parts[0] ? parts[0].trim() : item.trim(),
        time: parts[1] ? parts[1].trim() : 'TBD'
      };
    });
  }

  // Parse Inclusions & Exclusions
  const inclusions = inclusionsRaw ? inclusionsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
  const exclusions = exclusionsRaw ? exclusionsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

  const batchId = 'batch_' + Date.now();
  const batches = [{
    id: batchId,
    dateDuration: batchDate || 'Upcoming Dates',
    totalSeats,
    bookedSeats: 0
  }];

  _isSavingTrip = true;
  const btn = document.getElementById('saveTripSubmitBtn');
  btn.disabled = true;
  btn.textContent = 'Saving...';

  try {
    const { db, collection, addDoc, doc, updateDoc } = window._fb;

    const tripData = {
      title,
      destination,
      category,
      price,
      description,
      batches,
      packages,
      pickupPoints,
      inclusions,
      exclusions,
      itinerary,
      images: [image],
      status: 'published',
      vendorId: _vendorUser.uid,
      vendorName: document.getElementById('vSetBusinessName').value.trim() || _vendorUser.displayName || 'Verified Vendor',
      vendorWhatsApp: document.getElementById('vSetWhatsApp').value.trim() || '',
      updatedAt: Date.now()
    };

    if (editId) {
      const tripRef = doc(db, 'trips', editId);
      await updateDoc(tripRef, tripData);
      alert('Trip updated successfully!');
    } else {
      tripData.createdAt = Date.now();
      await addDoc(collection(db, 'trips'), tripData);
      alert('Trip published successfully!');
    }

    closeTripModal();
  } catch (err) {
    console.error('Error saving trip:', err);
    alert('Failed to save trip: ' + err.message);
  } finally {
    _isSavingTrip = false;
    btn.disabled = false;
    btn.textContent = editId ? 'Save Changes' : 'Publish Adventure →';
  }
}

// Delete Trip
async function confirmDeleteTrip(tripId) {
  if (isDemoAccount()) {
    showDemoAuthModal('delete trips');
    return;
  }

  if (window.SecurityThrottler && !window.SecurityThrottler.checkAndEnforce('delete trip')) {
    return;
  }

  if (!confirm('Are you sure you want to delete this trip listing? This cannot be undone.')) return;

  try {
    const { db, doc, deleteDoc } = window._fb;
    await deleteDoc(doc(db, 'trips', tripId));
    alert('Trip deleted.');
  } catch (err) {
    console.error('Error deleting trip:', err);
    alert('Could not delete trip: ' + err.message);
  }
}

// ===== AI WHATSAPP PARSER =====
function openAiImportModal() {
  document.getElementById('aiRawMessageInput').value = '';
  document.getElementById('aiModalOverlay').classList.add('open');
}

function closeAiImportModal() {
  document.getElementById('aiModalOverlay').classList.remove('open');
}

function handleParseWhatsAppMessage() {
  const rawText = document.getElementById('aiRawMessageInput').value.trim();
  if (!rawText) return alert('Please paste your WhatsApp itinerary message first.');

  const parsed = parseWhatsAppLocal(rawText);

  closeAiImportModal();
  openCreateTripModal();

  // Populate form with parsed values
  if (parsed.title) document.getElementById('tripFormTitle').value = parsed.title;
  if (parsed.destination) document.getElementById('tripFormDestination').value = parsed.destination;
  if (parsed.category) document.getElementById('tripFormCategory').value = parsed.category;
  if (parsed.price) document.getElementById('tripFormPrice').value = parsed.price;
  if (parsed.date) document.getElementById('tripFormBatchDate').value = parsed.date;
  if (parsed.packages) document.getElementById('tripFormPackages').value = parsed.packages;
  if (parsed.pickups) document.getElementById('tripFormPickups').value = parsed.pickups;
  if (parsed.inclusions) document.getElementById('tripFormInclusions').value = parsed.inclusions;
  if (parsed.exclusions) document.getElementById('tripFormExclusions').value = parsed.exclusions;
  if (parsed.itinerary) document.getElementById('tripFormItinerary').value = parsed.itinerary;
  if (parsed.desc) document.getElementById('tripFormDesc').value = parsed.desc;

  alert('WhatsApp message successfully parsed! Review details and click Publish.');
}

// Local intelligent heuristic extraction
function parseWhatsAppLocal(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let title = lines[0] ? lines[0].replace(/[*_~#]/g, '').trim() : 'Weekend Adventure';
  let price = 999;
  let destination = 'Maharashtra';
  let category = 'Trekking';
  let date = '';
  let inclusions = [];
  let exclusions = [];
  let pickups = [];

  // Determine category
  const lower = text.toLowerCase();
  if (lower.includes('camp') || lower.includes('lake') || lower.includes('tent')) category = 'Camping';
  else if (lower.includes('beach') || lower.includes('coastal') || lower.includes('backpack')) category = 'Backpacking';
  else if (lower.includes('bike') || lower.includes('ride')) category = 'Biking';

  // Find price patterns (e.g. 1299/-, Rs 1299, ₹1299)
  const priceMatch = text.match(/(?:rs\.?|₹|inr|-|cost:?|price:?)\s*(\d{3,5})/i);
  if (priceMatch && priceMatch[1]) {
    price = parseInt(priceMatch[1], 10);
  }

  // Find date patterns (e.g. 15-16 Nov, 20 May)
  const dateMatch = text.match(/(?:dates?:?|batch:?)\s*([^\n\r]+)/i);
  if (dateMatch && dateMatch[1]) {
    date = dateMatch[1].replace(/[*_]/g, '').trim();
  }

  // Find pickups
  const pickupMatch = text.match(/(?:pickup|boarding)\s*points?:?\s*([^\n\r]+)/i);
  if (pickupMatch && pickupMatch[1]) {
    pickups.push(pickupMatch[1].replace(/[*_]/g, '').trim());
  }

  // Inclusions extraction
  if (lower.includes('transport')) inclusions.push('To & Fro Bus Transport');
  if (lower.includes('breakfast')) inclusions.push('Breakfast & Morning Tea');
  if (lower.includes('lunch')) inclusions.push('Village Lunch');
  if (lower.includes('tent') || lower.includes('stay')) inclusions.push('Tent Accommodation');
  if (lower.includes('guide') || lower.includes('leader')) inclusions.push('Experienced Trek Leader');
  if (lower.includes('first aid')) inclusions.push('Basic First Aid');

  if (lower.includes('personal')) exclusions.push('Personal Expenses');
  exclusions.push('Anything not explicitly mentioned in inclusions');

  return {
    title,
    destination,
    category,
    price,
    date: date || 'Upcoming Departure',
    packages: `Standard Package:${price}`,
    pickups: pickups.join(', ') || 'Swargate - 10:00 PM',
    inclusions: inclusions.join(', ') || 'Transport, Breakfast, Expertise',
    exclusions: exclusions.join(', '),
    itinerary: text.substring(0, 500),
    desc: `Experience an incredible getaway with us on ${title}.`
  };
}

// ===== LIVE CAPTAIN BROADCASTING =====
function openStartTripBroadcastModal(tripId, tripTitle) {
  document.getElementById('broadcastTripId').value = tripId;
  document.getElementById('bcCaptainName').value = document.getElementById('vSetBusinessName').value || (_vendorUser && _vendorUser.displayName) || 'Trip Captain';
  document.getElementById('bcCaptainPhone').value = document.getElementById('vSetWhatsApp').value || '';
  document.getElementById('broadcastModalOverlay').classList.add('open');
}

function closeBroadcastModal() {
  document.getElementById('broadcastModalOverlay').classList.remove('open');
}

async function confirmStartLiveBroadcast() {
  const tripId = document.getElementById('broadcastTripId').value;
  const captainName = document.getElementById('bcCaptainName').value.trim();
  const captainPhone = document.getElementById('bcCaptainPhone').value.trim();
  const driverName = document.getElementById('bcDriverName').value.trim();
  const vehicleNumber = document.getElementById('bcVehicleNumber').value.trim();
  const vehiclePhoto = document.getElementById('bcVehiclePhoto').value.trim() || 'hero.png';

  if (isDemoAccount()) {
    closeBroadcastModal();
    showDemoAuthModal('start live GPS trip broadcasting');
    return;
  }

  if (window.SecurityThrottler && !window.SecurityThrottler.checkAndEnforce('start live broadcast')) {
    return;
  }

  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser.');
  }

  closeBroadcastModal();

  // Watch position using standard HTML5 Geolocation API
  _broadcastingTripId = tripId;

  _geoWatchId = navigator.geolocation.watchPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    try {
      const { db, doc, updateDoc } = window._fb;
      const { setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

      // 1. Update live_trips/{tripId}
      const liveRef = doc(db, 'live_trips', tripId);
      await setDoc(liveRef, {
        tripId,
        captainLatitude: lat,
        captainLongitude: lng,
        captainLocation: { latitude: lat, longitude: lng },
        updatedAt: Date.now(),
        isLive: true,
        crewDetails: { captainName, captainPhone, driverName, vehicleNumber, vehiclePhoto }
      }, { merge: true });

      // 2. Mark trip status as started in trips/{tripId}
      const tripRef = doc(db, 'trips', tripId);
      await updateDoc(tripRef, {
        tripStatus: 'started',
        crewDetails: { captainName, captainPhone, driverName, vehicleNumber, vehiclePhoto }
      }).catch(console.warn);

      // Show alert banner
      document.getElementById('liveBroadcastingAlert').style.display = 'flex';
      document.getElementById('liveBroadcastingTripTitle').textContent = `Broadcasting GPS coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (e) {
      console.error('Error broadcasting GPS position:', e);
    }
  }, (geoErr) => {
    console.error('Geolocation watch error:', geoErr);
    alert('Could not access location: ' + geoErr.message);
  }, {
    enableHighAccuracy: true,
    maximumAge: 5000,
    timeout: 20000
  });

  alert('Live GPS broadcasting started! Travellers can now track your bus on the Traveller Portal.');
}

function stopLiveBroadcast() {
  if (_geoWatchId !== null) {
    navigator.geolocation.clearWatch(_geoWatchId);
    _geoWatchId = null;
  }

  if (_broadcastingTripId) {
    try {
      const { db, doc } = window._fb;
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js').then(({ setDoc }) => {
        setDoc(doc(db, 'live_trips', _broadcastingTripId), { isLive: false, updatedAt: Date.now() }, { merge: true });
      });
    } catch (e) {}
    _broadcastingTripId = null;
  }

  document.getElementById('liveBroadcastingAlert').style.display = 'none';
  alert('Live GPS broadcast stopped.');
}

// ===== SETTINGS =====
async function saveVendorProfileSettings() {
  if (!_vendorUser) return alert('Please sign in first.');

  if (isDemoAccount()) {
    showDemoAuthModal('save business and payment settings');
    return;
  }

  if (window.SecurityThrottler && !window.SecurityThrottler.checkAndEnforce('save profile settings')) {
    return;
  }

  const businessName = document.getElementById('vSetBusinessName').value.trim();
  const whatsappNumber = document.getElementById('vSetWhatsApp').value.trim();
  const instagramUrl = document.getElementById('vSetInstagram').value.trim();
  const upiId = document.getElementById('vSetUpi').value.trim();
  const termsAndConditions = document.getElementById('vSetTerms').value.trim();
  const razorpayKeyId = document.getElementById('vSetRazorpayKey').value.trim();

  try {
    const { db, doc, updateDoc } = window._fb;
    const { setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

    const updatePayload = {
      businessName,
      name: businessName,
      whatsappNumber,
      whatsapp: whatsappNumber,
      instagramUrl,
      upiId,
      termsAndConditions,
      paymentSettings: {
        enabled: Boolean(razorpayKeyId),
        gateway: razorpayKeyId ? 'razorpay' : 'manual',
        razorpayKeyId
      }
    };

    await setDoc(doc(db, 'users', _vendorUser.uid), updatePayload, { merge: true });
    await setDoc(doc(db, 'vendors', _vendorUser.uid), updatePayload, { merge: true });

    alert('Vendor profile & settings saved successfully!');
  } catch (err) {
    console.error('Error saving vendor settings:', err);
    alert('Could not save settings: ' + err.message);
  }
}

// Tab Switching
function switchVendorTab(tab) {
  ['trips', 'bookings', 'settings'].forEach(t => {
    const section = document.getElementById(`vtab-${t}`);
    const btn = document.getElementById(`vTabBtn-${t}`);
    if (section) section.style.display = t === tab ? 'block' : 'none';
    if (btn) btn.classList.toggle('active', t === tab);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}
