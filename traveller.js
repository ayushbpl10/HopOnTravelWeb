// ===== TRAVELLER PORTAL CONTROLLER =====

let _currentUser = null;
let _userBookings = [];
let _activeFilter = 'all';
let _trackingMap = null;
let _captainMarker = null;
let _liveTrackingUnsub = null;
let _bookingsUnsub = null;

const DEMO_TRAVELLER_USER = {
  uid: 'demo_traveller_uid',
  displayName: 'Pooja Sharma (Demo Traveller)',
  email: 'pooja.demo@hopontravel.com',
  phone: '+91 98765 43210',
  photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  role: 'traveller'
};

const DEMO_TRAVELLER_BOOKINGS = [
  {
    id: 'demo_booking_1',
    bookingId: 'ATGL-78901',
    tripId: 'demo',
    travelerName: 'Pooja Sharma',
    travelerPhone: '+91 98765 43210',
    travelerEmail: 'pooja.demo@hopontravel.com',
    packageName: 'Pune Transport Package',
    seats: 2,
    totalPrice: 2598,
    status: 'confirmed',
    createdAt: Date.now() - 86400000 * 2,
    source: 'website'
  },
  {
    id: 'demo_booking_2',
    bookingId: 'ATGL-45678',
    tripId: 'rajmachi-demo',
    travelerName: 'Pooja Sharma',
    travelerPhone: '+91 98765 43210',
    travelerEmail: 'pooja.demo@hopontravel.com',
    packageName: 'Standard Camping',
    seats: 1,
    totalPrice: 1399,
    status: 'pending',
    createdAt: Date.now() - 86400000,
    source: 'website'
  }
];

function loginAsDemoTraveller() {
  localStorage.setItem('hopon_demo_traveller', 'true');
  _currentUser = DEMO_TRAVELLER_USER;
  onUserSignedIn(DEMO_TRAVELLER_USER);
}

function isDemoTraveller() {
  return localStorage.getItem('hopon_demo_traveller') === 'true' || (_currentUser && _currentUser.uid === DEMO_TRAVELLER_USER.uid);
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
  loginWithGoogle();
}

function initTravellerPortal() {
  // Auto-restore demo traveller if previously active
  if (localStorage.getItem('hopon_demo_traveller') === 'true') {
    _currentUser = DEMO_TRAVELLER_USER;
    onUserSignedIn(DEMO_TRAVELLER_USER);
    return;
  }

  const { auth, onAuthStateChanged, getRedirectResult } = window._fb;

  // Handle redirect login result if user was redirected back from Google
  if (getRedirectResult) {
    getRedirectResult(auth).then(async (result) => {
      if (result && result.user) {
        _currentUser = result.user;
        await onUserSignedIn(result.user);
      }
    }).catch(err => {
      console.warn('Redirect auth result check:', err.message);
    });
  }

  // If already authenticated in current session, sign in immediately
  if (auth && auth.currentUser) {
    _currentUser = auth.currentUser;
    onUserSignedIn(auth.currentUser);
  }

  onAuthStateChanged(auth, async (user) => {
    if (localStorage.getItem('hopon_demo_traveller') === 'true') return;
    if (user) {
      _currentUser = user;
      await onUserSignedIn(user);
    } else {
      _currentUser = null;
      onUserSignedOut();
    }
  });

  // Check URL query for direct booking tracking (e.g. traveller.html?bookingId=ATGL-12345)
  const urlParams = new URLSearchParams(window.location.search);
  const paramBookingId = urlParams.get('bookingId');
  if (paramBookingId) {
    const input = document.getElementById('quickBookingIdInput');
    if (input) input.value = paramBookingId;
    handleQuickLookup();
  }
}

if (window._fb) {
  initTravellerPortal();
} else {
  window.addEventListener('firebase-portal-ready', initTravellerPortal);
}

// ===== GOOGLE AUTHENTICATION =====
async function loginWithGoogle() {
  const { auth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } = window._fb;
  const provider = new GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');

  const btn = document.getElementById('loginGoogleBtn');
  const origText = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>⏳ Signing in with Google...</span>';
  }

  // Active watcher: even if Chrome COOP blocks popup.closed from resolving the promise,
  // Firebase Auth syncs the user token into storage. This polling listener guarantees
  // the UI transitions immediately without requiring the user to reload!
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
      _currentUser = auth.currentUser;
      await onUserSignedIn(auth.currentUser);
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
      _currentUser = result.user;
      await onUserSignedIn(result.user);
    }
  } catch (err) {
    clearWatcher();
    // If user is actually signed in despite popup communication error (e.g. COOP window.closed warning)
    if (auth.currentUser) {
      _currentUser = auth.currentUser;
      await onUserSignedIn(auth.currentUser);
      return;
    }

    console.warn('Popup sign in did not complete directly:', err);
    // If popup was blocked by browser or COOP prevented popup, fallback to redirect
    if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
      if (signInWithRedirect) {
        console.log('Falling back to signInWithRedirect...');
        await signInWithRedirect(auth, provider);
        return;
      }
    }

    if (err.code !== 'auth/popup-closed-by-user') {
      alert('Could not complete Google Sign-In: ' + (err.message || 'Please enable popups or try again.'));
    }
  } finally {
    if (btn && !_currentUser) {
      btn.disabled = false;
      btn.innerHTML = origText;
    }
  }
}

async function handleLogout() {
  localStorage.removeItem('hopon_demo_traveller');
  if (_bookingsUnsub) _bookingsUnsub();
  if (_liveTrackingUnsub) _liveTrackingUnsub();
  _currentUser = null;
  onUserSignedOut();

  const { auth, signOut } = window._fb;
  if (auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  }
}

// User Signed In Callback
async function onUserSignedIn(user) {
  document.getElementById('loggedOutBanner').style.display = 'none';
  document.getElementById('loggedInView').style.display = 'block';
  document.getElementById('loginGoogleBtn').style.display = 'none';
  const navDemoBtn = document.getElementById('loginDemoTravellerNavBtn');
  if (navDemoBtn) navDemoBtn.style.display = 'none';

  // Render User Chip in Nav
  const chipContainer = document.getElementById('userChipContainer');
  chipContainer.style.display = 'flex';
  chipContainer.innerHTML = `
    <div class="pnav-user-chip">
      <div class="pnav-avatar">
        ${user.photoURL ? `<img src="${user.photoURL}" alt="${user.displayName}" />` : (user.displayName || 'U').charAt(0).toUpperCase()}
      </div>
      <div class="pnav-user-meta">
        <span class="pnav-user-name">${user.displayName || 'Explorer'}</span>
        <span class="pnav-user-role">Traveller</span>
      </div>
      <button class="p-btn p-btn-dark p-btn-sm" style="margin-left: 0.5rem; padding: 0.2rem 0.6rem;" onclick="handleLogout()">Sign Out</button>
    </div>
  `;

  // Update Profile Tab
  document.getElementById('welcomeUserTitle').textContent = `Hello, ${user.displayName ? user.displayName.split(' ')[0] : 'Explorer'}! 🌍`;
  document.getElementById('profileName').textContent = user.displayName || 'Traveller';
  document.getElementById('profileEmail').textContent = user.email || '';
  if (user.photoURL) {
    document.getElementById('profileAvatarBig').innerHTML = `<img src="${user.photoURL}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`;
  }

  // Instant demo user bypass (avoids Firestore network timeout)
  if (user.uid === DEMO_TRAVELLER_USER.uid) {
    document.getElementById('profilePhoneInput').value = DEMO_TRAVELLER_USER.phone;
    listenToUserBookings(user.email);
    loadWishlist();
    return;
  }

  // Ensure record in users/{uid}
  try {
    const { db, doc, getDoc, updateDoc, addDoc } = window._fb;
    const userDocRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) {
      await updateDoc(userDocRef, {
        name: user.displayName || 'Traveller',
        email: user.email || '',
        role: 'traveller',
        photoURL: user.photoURL || '',
        createdAt: Date.now()
      }).catch(async () => {
        // Fallback if setDoc is needed
        const { setDoc } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
        await setDoc(userDocRef, {
          name: user.displayName || 'Traveller',
          email: user.email || '',
          role: 'traveller',
          photoURL: user.photoURL || '',
          createdAt: Date.now()
        });
      });
    } else {
      const data = snap.data();
      if (data.phone) {
        document.getElementById('profilePhoneInput').value = data.phone;
      }
    }
  } catch (e) {
    console.warn('User document sync (non-fatal):', e);
  }

  // Listen to bookings in real time
  listenToUserBookings(user.email);
  loadWishlist();
}

// User Signed Out Callback
function onUserSignedOut() {
  document.getElementById('loggedOutBanner').style.display = 'block';
  document.getElementById('loggedInView').style.display = 'none';
  document.getElementById('loginGoogleBtn').style.display = 'inline-flex';
  const navDemoBtn = document.getElementById('loginDemoTravellerNavBtn');
  if (navDemoBtn) navDemoBtn.style.display = 'inline-flex';
  document.getElementById('userChipContainer').style.display = 'none';
  _userBookings = [];
}

// ===== REAL-TIME USER BOOKINGS =====
function listenToUserBookings(email) {
  if (!email) return;

  if (email === DEMO_TRAVELLER_USER.email) {
    _userBookings = [...DEMO_TRAVELLER_BOOKINGS];
    updateMetricsAndSelects();
    renderBookings();
    return;
  }

  const { db, collection, query, where, onSnapshot } = window._fb;

  const q = query(collection(db, 'bookings'), where('travelerEmail', '==', email));
  _bookingsUnsub = onSnapshot(q, (snapshot) => {
    _userBookings = [];
    snapshot.forEach(docSnap => {
      _userBookings.push({ id: docSnap.id, ...docSnap.data() });
    });
    // Sort newest first
    _userBookings.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    updateMetricsAndSelects();
    renderBookings();
  }, (err) => {
    console.error('Error listening to bookings:', err);
    document.getElementById('bookingsListContainer').innerHTML = `
      <div class="p-empty">
        <p style="color:var(--portal-danger);">Could not load bookings. Please refresh or check connection.</p>
      </div>
    `;
  });
}

function updateMetricsAndSelects() {
  const total = _userBookings.length;
  const confirmed = _userBookings.filter(b => b.status === 'confirmed').length;
  const pending = _userBookings.filter(b => b.status === 'pending').length;

  document.getElementById('statTotalBookings').textContent = total;
  document.getElementById('statConfirmedBookings').textContent = confirmed;
  document.getElementById('statPendingBookings').textContent = pending;

  // Populate tracking select box
  const trackingSelect = document.getElementById('trackingTripSelect');
  trackingSelect.innerHTML = '<option value="">-- Choose an active trip to track --</option>' +
    _userBookings
      .filter(b => b.status === 'confirmed' || b.status === 'pending')
      .map(b => `<option value="${b.tripId}" data-booking-id="${b.bookingId || b.id}">${b.bookingId || b.id} — ${b.packageName || 'Trip'}</option>`)
      .join('');
}

// ===== RENDER BOOKINGS =====
function filterBookings(status, btn) {
  _activeFilter = status;
  const pills = document.querySelectorAll('#bookingFilterPills button');
  pills.forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderBookings();
}

function renderBookings() {
  const container = document.getElementById('bookingsListContainer');
  let list = _userBookings;

  if (_activeFilter !== 'all') {
    list = list.filter(b => b.status === _activeFilter);
  }

  if (!list.length) {
    container.innerHTML = `
      <div class="p-empty">
        <div class="p-empty-icon">🎟️</div>
        <h3>No ${ _activeFilter === 'all' ? '' : _activeFilter } Bookings Found</h3>
        <p>Ready for your next adventure? Explore handpicked treks and camping getaways across Maharashtra and Goa.</p>
        <a href="index.html#book" class="p-btn p-btn-yellow">Browse Upcoming Trips &rarr;</a>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(b => {
    const statusClass = b.status === 'confirmed' ? 'p-badge-confirmed' :
                        b.status === 'pending' ? 'p-badge-pending' : 'p-badge-cancelled';
    const statusIcon = b.status === 'confirmed' ? '✓' : b.status === 'pending' ? '⏳' : '✕';
    const formattedDate = b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : 'Recent';

    return `
      <div class="p-ticket-card" id="ticket-${b.id}">
        <div class="p-ticket-header">
          <div>
            <span style="font-size: 0.75rem; color: var(--portal-muted); text-transform: uppercase;">BOOKING ID</span>
            <strong style="color: var(--portal-primary); font-size: 1.15rem; letter-spacing: 1px; display: block;">${b.bookingId || b.id}</strong>
          </div>
          <div style="display: flex; gap: 0.8rem; align-items: center;">
            <span class="p-badge ${statusClass}">${statusIcon} ${b.status}</span>
            <button class="p-btn p-btn-dark p-btn-sm" onclick="printSingleTicket('${b.id}')">🖨️ Print</button>
          </div>
        </div>

        <div class="p-ticket-body">
          <div class="p-ticket-row">
            <span style="color: var(--portal-muted);">Traveller Name:</span>
            <strong>${escapeHtml(b.travelerName || 'Traveller')}</strong>
          </div>
          <div class="p-ticket-row">
            <span style="color: var(--portal-muted);">Package Chosen:</span>
            <span>${escapeHtml(b.packageName || 'Standard Package')}</span>
          </div>
          <div class="p-ticket-row">
            <span style="color: var(--portal-muted);">Seats Reserved:</span>
            <span>${b.seats || 1} Person</span>
          </div>
          <div class="p-ticket-row">
            <span style="color: var(--portal-muted);">Booking Date:</span>
            <span>${formattedDate}</span>
          </div>

          <div class="p-ticket-divider">
            <div class="p-ticket-notch-left"></div>
            <div class="p-ticket-notch-right"></div>
          </div>

          <div class="p-ticket-row" style="padding-top: 0.5rem;">
            <span style="font-size: 1rem; font-weight: 800;">Total Amount:</span>
            <span style="font-size: 1.4rem; font-weight: 900; color: var(--portal-primary);">₹${(b.totalPrice || 0).toLocaleString('en-IN')}</span>
          </div>

          <div style="margin-top: 1.2rem; display: flex; gap: 0.8rem; flex-wrap: wrap;">
            ${b.status === 'confirmed' ? `
              <button class="p-btn p-btn-yellow p-btn-sm" onclick="trackBookingLive('${b.tripId}')">
                📍 Track Live Bus
              </button>
            ` : ''}
            <a href="trip.html?id=${encodeURIComponent(b.tripId)}" class="p-btn p-btn-dark p-btn-sm">
              📄 View Trip Details
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ===== QUICK BOOKING LOOKUP (PUBLIC / UNLOGGED) =====
async function handleQuickLookup() {
  const input = document.getElementById('quickBookingIdInput');
  const resultDiv = document.getElementById('quickLookupResult');
  const cleanId = (input.value || '').trim();

  if (!cleanId) {
    alert('Please enter a valid Booking ID.');
    return;
  }

  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `
    <div style="text-align: center; padding: 1.5rem; color: var(--portal-muted);">
      <div class="book-spinner" style="margin: 0 auto 0.5rem;"></div>
      <span>Searching for booking...</span>
    </div>
  `;

  try {
    const { db, collection, query, where, getDocs, doc, getDoc } = window._fb;
    let foundBooking = null;

    // 1. Query uppercase custom booking ID (e.g. ATGL-12345)
    const qUpper = query(collection(db, 'bookings'), where('bookingId', '==', cleanId.toUpperCase()));
    const snapUpper = await getDocs(qUpper);
    if (!snapUpper.empty) {
      foundBooking = { id: snapUpper.docs[0].id, ...snapUpper.docs[0].data() };
    } else {
      // 2. Query original case
      const qRaw = query(collection(db, 'bookings'), where('bookingId', '==', cleanId));
      const snapRaw = await getDocs(qRaw);
      if (!snapRaw.empty) {
        foundBooking = { id: snapRaw.docs[0].id, ...snapRaw.docs[0].data() };
      } else {
        // 3. Check direct Firestore document ID
        const docRef = doc(db, 'bookings', cleanId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          foundBooking = { id: docSnap.id, ...docSnap.data() };
        }
      }
    }

    if (!foundBooking) {
      resultDiv.innerHTML = `
        <div style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 12px; padding: 1rem; color: #fca5a5;">
          ⚠️ Booking not found for "<strong>${escapeHtml(cleanId)}</strong>". Please double check your booking code.
        </div>
      `;
      return;
    }

    _lastFoundBooking = foundBooking;

    // Render Quick Result Card
    const statusClass = foundBooking.status === 'confirmed' ? 'p-badge-confirmed' :
                        foundBooking.status === 'pending' ? 'p-badge-pending' : 'p-badge-cancelled';

    resultDiv.innerHTML = `
      <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--portal-card-border); border-radius: 16px; padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <span style="font-size: 0.75rem; color: var(--portal-muted);">BOOKING ID</span>
            <strong style="color: var(--portal-primary); font-size: 1.2rem; display: block;">${foundBooking.bookingId || foundBooking.id}</strong>
          </div>
          <span class="p-badge ${statusClass}">${foundBooking.status}</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div><span style="color: var(--portal-muted); font-size: 0.8rem; display: block;">Traveller</span><strong>${escapeHtml(foundBooking.travelerName)}</strong></div>
          <div><span style="color: var(--portal-muted); font-size: 0.8rem; display: block;">Package</span><strong>${escapeHtml(foundBooking.packageName || 'Trip')}</strong></div>
          <div><span style="color: var(--portal-muted); font-size: 0.8rem; display: block;">Seats</span><strong>${foundBooking.seats || 1} Seat(s)</strong></div>
          <div><span style="color: var(--portal-muted); font-size: 0.8rem; display: block;">Total Price</span><strong style="color: var(--portal-primary); font-size: 1.1rem;">₹${(foundBooking.totalPrice || 0).toLocaleString('en-IN')}</strong></div>
        </div>

        ${foundBooking.status === 'pending' ? `
          <div style="background: rgba(245,158,11,0.1); border-left: 4px solid var(--portal-warning); padding: 0.8rem; border-radius: 6px; font-size: 0.85rem; color: #fde68a; margin-bottom: 1rem;">
            ⏳ Your booking is registered. If paying via UPI or cash, the organiser will verify your payment and confirm your seat shortly.
          </div>
        ` : `
          <div style="background: rgba(16,185,129,0.1); border-left: 4px solid var(--portal-success); padding: 0.8rem; border-radius: 6px; font-size: 0.85rem; color: #a7f3d0; margin-bottom: 1rem;">
            ✓ Your seat is confirmed! Present this Booking ID on the day of departure.
          </div>
        `}

        <div style="display: flex; gap: 0.8rem; flex-wrap: wrap; margin-top: 1rem; border-top: 1px solid var(--portal-card-border); padding-top: 1rem;">
          ${foundBooking.tripId ? `
            <button class="p-btn p-btn-yellow p-btn-sm" onclick="trackBookingLive('${foundBooking.tripId}')">
              📍 Track Live Bus
            </button>
            <a href="trip.html?id=${encodeURIComponent(foundBooking.tripId)}" class="p-btn p-btn-dark p-btn-sm">
              📄 View Trip Details
            </a>
          ` : ''}
          <button class="p-btn p-btn-dark p-btn-sm" onclick="printSingleTicket(_lastFoundBooking)">
            🖨️ Print Ticket
          </button>
        </div>
      </div>
    `;

  } catch (err) {
    console.error('Quick lookup error:', err);
    resultDiv.innerHTML = `
      <div style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 12px; padding: 1rem; color: #fca5a5;">
        ⚠️ Error fetching booking status: ${err.message}
      </div>
    `;
  }
}

// ===== TAB SWITCHING =====
function switchTravellerTab(tabName) {
  const tabs = ['bookings', 'tracking', 'wishlist', 'profile'];
  tabs.forEach(t => {
    const el = document.getElementById(`tab-${t}`);
    const btn = document.getElementById(`tabBtn-${t}`);
    if (el) el.style.display = t === tabName ? 'block' : 'none';
    if (btn) btn.classList.toggle('active', t === tabName);
  });

  if (tabName === 'tracking' && _trackingMap) {
    setTimeout(() => { _trackingMap.invalidateSize(); }, 200);
  }
}

function trackBookingLive(tripId) {
  if (!_currentUser) {
    document.getElementById('loggedOutBanner').style.display = 'none';
    document.getElementById('loggedInView').style.display = 'block';
  }
  switchTravellerTab('tracking');
  const select = document.getElementById('trackingTripSelect');
  if (select) select.value = tripId;
  loadTripLiveTracking(tripId);
}

// ===== LIVE TRACKING (LEAFLET.JS MAP) =====
function initLeafletMap(lat, lng) {
  const mapDiv = document.getElementById('leafletMap');
  if (!_trackingMap) {
    _trackingMap = L.map('leafletMap').setView([lat, lng], 13);

    // Dark styled tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(_trackingMap);
  } else {
    _trackingMap.setView([lat, lng], 13);
  }

  // Create or move captain bus marker
  const busIcon = L.divIcon({
    className: 'custom-bus-icon',
    html: `<div style="background:#FFB800; color:#000; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow:0 0 25px rgba(255,184,0,0.8); border:3px solid #fff;">🚌</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });

  if (_captainMarker) {
    _captainMarker.setLatLng([lat, lng]);
  } else {
    _captainMarker = L.marker([lat, lng], { icon: busIcon }).addTo(_trackingMap);
    _captainMarker.bindPopup("<strong>Trip Captain Bus</strong><br/>Live position broadcasted").openPopup();
  }
}

async function loadTripLiveTracking(tripId) {
  if (!tripId) {
    document.getElementById('liveTrackingViewArea').style.display = 'none';
    document.getElementById('noActiveTrackingMsg').style.display = 'block';
    if (_liveTrackingUnsub) _liveTrackingUnsub();
    return;
  }

  const { db, doc, onSnapshot, getDoc } = window._fb;

  document.getElementById('liveTrackingViewArea').style.display = 'block';
  document.getElementById('noActiveTrackingMsg').style.display = 'none';

  // Also fetch trip details to display crew photo / contact if available
  try {
    const tripSnap = await getDoc(doc(db, 'trips', tripId));
    if (tripSnap.exists()) {
      const t = tripSnap.data();
      const crew = t.crewDetails || {};
      document.getElementById('crewCaptainName').textContent = crew.captainName || t.vendorName || 'Trip Captain';
      document.getElementById('crewDriverVehicle').textContent = `Driver: ${crew.driverName || 'Verified Captain'} • Vehicle: ${crew.vehicleNumber || 'Registered Bus'}`;
      if (crew.vehiclePhoto) {
        document.getElementById('crewVehiclePhoto').src = crew.vehiclePhoto;
      }
      const waNumber = (crew.captainPhone || t.vendorWhatsApp || '').replace(/[^0-9]/g, '');
      if (waNumber) {
        document.getElementById('crewCaptainWhatsapp').href = `https://wa.me/${waNumber}`;
        document.getElementById('crewCaptainCall').href = `tel:${waNumber}`;
      }
    }
  } catch (err) {
    console.warn('Could not load trip crew info:', err);
  }

  // Subscribe to live coordinates in live_trips/{tripId}
  if (_liveTrackingUnsub) _liveTrackingUnsub();

  const liveDocRef = doc(db, 'live_trips', tripId);
  _liveTrackingUnsub = onSnapshot(liveDocRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      const lat = data.captainLatitude || (data.captainLocation && data.captainLocation.latitude) || 18.5204;
      const lng = data.captainLongitude || (data.captainLocation && data.captainLocation.longitude) || 73.8567;
      const updatedAt = data.updatedAt ? new Date(data.updatedAt).toLocaleTimeString() : 'Live';

      document.getElementById('crewLastUpdate').textContent = updatedAt;
      initLeafletMap(lat, lng);
    } else {
      // Default placeholder location (Pune / Mumbai coordinates)
      initLeafletMap(18.5204, 73.8567);
      document.getElementById('crewLastUpdate').textContent = 'Waiting for captain...';
    }
  }, (err) => {
    console.error('Live tracking listener error:', err);
  });
}

function refreshLiveTracking() {
  const sel = document.getElementById('trackingTripSelect');
  if (sel.value) {
    loadTripLiveTracking(sel.value);
  }
}

// ===== WISHLIST =====
function loadWishlist() {
  const raw = localStorage.getItem('hopon_wishlist') || '[]';
  const wishIds = JSON.parse(raw);
  document.getElementById('statWishlistCount').textContent = wishIds.length;

  const container = document.getElementById('wishlistContainer');
  if (!wishIds.length) {
    container.innerHTML = `
      <div class="p-empty" style="grid-column: 1 / -1;">
        <div class="p-empty-icon">❤️</div>
        <h3>Your Wishlist is Empty</h3>
        <p>Save your favorite weekend trips, treks, and beach adventures for later.</p>
        <a href="index.html#book" class="p-btn p-btn-yellow">Browse Escapes &rarr;</a>
      </div>
    `;
    return;
  }

  // Render simple cards for wishlisted IDs
  container.innerHTML = wishIds.map(id => `
    <div class="p-stat-card" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="p-badge p-badge-confirmed" style="margin-bottom: 0.5rem;">Saved Adventure</span>
        <h4 style="font-size: 1.15rem; color: #fff; margin-bottom: 0.4rem;">Trip #${escapeHtml(id)}</h4>
        <p style="color: var(--portal-muted); font-size: 0.85rem;">Saved to your browser wishlist.</p>
      </div>
      <div style="display: flex; gap: 0.5rem; margin-top: 1.5rem;">
        <a href="trip.html?id=${encodeURIComponent(id)}" class="p-btn p-btn-yellow p-btn-sm" style="flex:1;">View Trip</a>
        <button class="p-btn p-btn-danger p-btn-sm" onclick="removeWishlistItem('${id}')">Remove</button>
      </div>
    </div>
  `).join('');
}

function removeWishlistItem(id) {
  let list = JSON.parse(localStorage.getItem('hopon_wishlist') || '[]');
  list = list.filter(item => item !== id);
  localStorage.setItem('hopon_wishlist', JSON.stringify(list));
  loadWishlist();
}

// ===== PROFILE =====
async function saveTravellerProfile() {
  if (!_currentUser) return alert('Please sign in first.');

  if (isDemoTraveller()) {
    showDemoAuthModal('update your profile details');
    return;
  }

  if (window.SecurityThrottler && !window.SecurityThrottler.checkAndEnforce('save profile details')) {
    return;
  }

  const phone = document.getElementById('profilePhoneInput').value.trim();

  try {
    const { db, doc, updateDoc } = window._fb;
    const userDocRef = doc(db, 'users', _currentUser.uid);
    await updateDoc(userDocRef, { phone });
    alert('Profile details updated successfully!');
  } catch (err) {
    console.error('Error saving profile:', err);
    alert('Could not update profile: ' + err.message);
  }
}

// ===== PRINT SINGLE TICKET =====
function printSingleTicket(target) {
  const booking = typeof target === 'object' && target !== null ? target : (_userBookings.find(b => b.id === target) || _lastFoundBooking);
  if (!booking) return;

  const manifest = document.getElementById('printableManifest');
  manifest.style.display = 'block';
  manifest.innerHTML = `
    <div style="border: 2px solid #000; padding: 25px; border-radius: 12px; font-family: sans-serif; max-width: 650px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px;">
        <div>
          <h2 style="margin: 0; font-size: 24px;">Ab Toh Ghoom Le</h2>
          <span style="font-size: 14px; color: #555;">Official Travel Confirmation Ticket</span>
        </div>
        <div style="text-align: right;">
          <strong style="font-size: 20px;">${booking.bookingId || booking.id}</strong><br/>
          <span style="font-size: 12px; text-transform: uppercase;">Status: ${booking.status}</span>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr><td style="padding: 6px 0; color: #555;">Traveller:</td><td><strong>${booking.travelerName}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #555;">Phone:</td><td>${booking.travelerPhone}</td></tr>
        <tr><td style="padding: 6px 0; color: #555;">Email:</td><td>${booking.travelerEmail || 'N/A'}</td></tr>
        <tr><td style="padding: 6px 0; color: #555;">Package:</td><td>${booking.packageName || 'Trip'}</td></tr>
        <tr><td style="padding: 6px 0; color: #555;">Seats:</td><td>${booking.seats || 1}</td></tr>
        <tr><td style="padding: 6px 0; color: #555;">Total Amount:</td><td><strong>₹${(booking.totalPrice || 0).toLocaleString('en-IN')}</strong></td></tr>
      </table>

      <div style="border-top: 1px dashed #777; padding-top: 15px; font-size: 12px; color: #555;">
        📌 Please show this ticket to the trip captain when boarding the vehicle. Safe travels!
      </div>
    </div>
  `;

  window.print();
  manifest.style.display = 'none';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}
