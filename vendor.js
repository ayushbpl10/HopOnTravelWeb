/**
 * Ab Toh Ghoom Le - Dedicated Vendor Storefront & Partner Landing Page
 * 
 * Supports:
 * - Dedicated Clean Route: /vendor/:slug (e.g. /vendor/sahyadri-trekkers)
 * - Dedicated Short Route: /v/:slug (e.g. /v/sahyadri-trekkers)
 * - Query Parameter Route: /vendor.html?id=:idOrSlug
 * - Default Partner Landing: /vendor.html (when no vendor slug/id is specified)
 */

function toSlug(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getVendorIdentifier() {
  // 1. Check query parameters (?id=..., ?vendorId=..., ?vendor=..., ?slug=...)
  const urlParams = new URLSearchParams(window.location.search);
  const fromQuery = urlParams.get('id') || urlParams.get('vendorId') || urlParams.get('vendor') || urlParams.get('slug');
  if (fromQuery && fromQuery.trim()) {
    return fromQuery.trim();
  }

  // 2. Check dedicated route pathname: /vendor/:slug or /v/:slug
  const pathname = window.location.pathname.replace(/\/+$/, '');
  const match = pathname.match(/^\/(?:vendor|v)\/([^/?#]+)/i);
  if (match && match[1]) {
    const clean = decodeURIComponent(match[1]).trim();
    if (clean && !clean.endsWith('.html') && !clean.endsWith('.js') && !clean.endsWith('.css') && !clean.endsWith('.json')) {
      return clean;
    }
  }
  return null;
}

const FALLBACK_VENDOR_CATALOG = {
  'sahyadri-trekkers': {
    name: 'Sahyadri Trekkers (Verified Partner)',
    phone: '+919876543210',
    instagram: 'https://instagram.com/sahyadri_trekkers_demo',
    bio: 'Pioneers in Sahyadri trekking, overnight fort camping, and seasonal firefly trails. Certified mountain captains with 8+ years guiding experience.',
    terms: '📜 Cancellation Policy:\n• 100% refund if cancelled 7 days prior.\n• 50% refund if cancelled 48 hours prior.\n• Non-refundable within 24 hours of departure.\n• Strict safety first: First aid kits and certified trek leads on all batches.',
    trips: [
      {
        id: 'demo',
        title: 'Harishchandragad & Kokankada Trek',
        category: 'Trekking',
        description: 'Explore the mighty Harishchandragad fort, Kedareshwar cave, and Kokankada cliff. Overnight trek with camping & sunrise view.',
        batches: [{ dateDuration: '05-06 Sep (Sat night to Sun night)', totalSeats: 30, bookedSeats: 8 }],
        packages: [{ name: 'Pune Transport', price: 999 }, { name: 'Mumbai Transport', price: 1499 }],
        images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80']
      },
      {
        id: 'rajmachi-demo',
        title: 'Rajmachi Fireflies & Fort Camping',
        category: 'Camping',
        description: 'Experience millions of glowing fireflies in the deep forests of Rajmachi fort. Includes tent stay, lakeside bonfire, and midnight trail hike.',
        batches: [{ dateDuration: 'Upcoming Weekend', totalSeats: 25, bookedSeats: 6 }],
        packages: [{ name: 'Camping Package', price: 1399 }],
        images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80']
      }
    ]
  },
  'camp-wanderers': {
    name: 'Camp Wanderers',
    phone: '+919822334455',
    instagram: 'https://instagram.com/camp_wanderers',
    bio: 'Curators of secluded lakeside glamping experiences and weekend barbecue retreats across Maharashtra.',
    terms: '📜 Glamping Policy:\n• 100% refund up to 72 hours before arrival.\n• Clean sanitised tents with bedding and barbecues provided.\n• Family & couple friendly atmosphere.',
    trips: [
      {
        id: 'pawna-demo',
        title: 'Pawna Lake Lakeside Glamping',
        category: 'Camping',
        description: 'Camp right next to the pristine Pawna lake waters. Live music, barbecue grill, star gazing, and sunrise kayaking.',
        batches: [{ dateDuration: 'Every Weekend', totalSeats: 40, bookedSeats: 15 }],
        packages: [{ name: 'Lakeside Tent', price: 1099 }],
        images: ['https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80']
      }
    ]
  },
  'coastline-explorers': {
    name: 'Coastline Explorers',
    phone: '+919811223344',
    instagram: 'https://instagram.com/coastline_explorers',
    bio: 'Experiential backpacking expeditions along the Arabian coastline, hidden beaches, and heritage coastal forts.',
    terms: '📜 Coastal Backpacking Policy:\n• 50% advance for train/bus reservation.\n• Beach camping guidelines and safety gear included.',
    trips: [
      {
        id: 'gokarna-demo',
        title: 'Gokarna Beach Trek & Cafe Hopping',
        category: 'Backpacking',
        description: 'Hike across Om Beach, Half Moon Beach, and Paradise Beach. Experience cliff-side sunset cafes and beach stays.',
        batches: [{ dateDuration: 'Long Weekend', totalSeats: 20, bookedSeats: 5 }],
        packages: [{ name: 'Full Trip Ex-Pune', price: 3999 }],
        images: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80']
      }
    ]
  },
  'sahyadrikar-community': {
    name: 'Sahyadrikar community',
    phone: '+918830898253',
    instagram: 'https://instagram.com',
    bio: 'Grassroots mountain exploration group dedicated to Sahyadri trekking, historical fort preservation, and rural community tourism.',
    terms: '📜 Sahyadrikar Terms:\n• Advance payment non-refundable.\n• Eco-friendly trekking: No littering allowed in forest reserves.',
    trips: [
      {
        id: '1',
        title: 'Rajmachi Camping & Fire flies special',
        category: 'Trekking',
        description: 'The Fireflies Festival 2026 is a magical seasonal event in Maharashtra... millions of fireflies illuminate the Western Ghats.',
        batches: [{ dateDuration: '22-23 May 2026', totalSeats: 30, bookedSeats: 19 }],
        packages: [{ name: 'Without Transport', price: 999 }, { name: 'Pune (With Transport)', price: 1499 }],
        images: ['https://images.unsplash.com/photo-1517436073-3b1b11f9f257?auto=format&fit=crop&w=1200&q=80']
      }
    ]
  }
};

let _vendorTripsCache = [];

function updateStorefrontDOM(vName, vPhone, vInstagram, vBio, vTerms, vTrips, vSlug) {
  _vendorTripsCache = vTrips || [];
  const vendorRouteSlug = toSlug(vName) || vSlug;
  const dedicatedRouteUrl = `${window.location.origin}/vendor/${encodeURIComponent(vendorRouteSlug)}`;

  document.title = `Trips by ${vName} | Ab Toh Ghoom Le`;

  const vAvatar = document.getElementById('vAvatar');
  if (vAvatar) vAvatar.textContent = vName.charAt(0).toUpperCase();

  const vNameEl = document.getElementById('vName');
  if (vNameEl) vNameEl.textContent = vName;

  const vSubtitle = document.getElementById('vSubtitle');
  if (vSubtitle) {
    vSubtitle.textContent = `${_vendorTripsCache.length} Active ${_vendorTripsCache.length === 1 ? 'Trip' : 'Trips'} Listed`;
  }

  const vBioEl = document.getElementById('vBio');
  if (vBioEl) {
    vBioEl.textContent = vBio || `Official verified storefront for ${vName} on Ab Toh Ghoom Le. Explore upcoming departures, guaranteed direct UPI bookings, and real-time captain bus tracking.`;
  }

  const tripsHeader = document.getElementById('tripsHeader');
  if (tripsHeader) {
    tripsHeader.textContent = `All Trips by ${vName} (${_vendorTripsCache.length})`;
  }

  const vRouteDisplay = document.getElementById('vRouteDisplay');
  if (vRouteDisplay) {
    vRouteDisplay.textContent = `abtohghoomle.com/vendor/${vendorRouteSlug}`;
  }

  // Setup WhatsApp
  const waBtn = document.getElementById('vWhatsapp');
  if (waBtn) {
    if (vPhone) {
      const cleanPhone = vPhone.replace(/[^0-9]/g, '');
      const waMsg = encodeURIComponent(`Hi ${vName}! I am browsing your dedicated trips storefront on Ab Toh Ghoom Le and would like details about your upcoming departures.`);
      waBtn.href = `https://wa.me/${cleanPhone}?text=${waMsg}`;
      waBtn.style.display = 'inline-flex';
    } else {
      waBtn.style.display = 'none';
    }
  }

  // Setup Instagram
  const igBtn = document.getElementById('vInstagram');
  if (igBtn) {
    if (vInstagram) {
      igBtn.href = vInstagram;
      igBtn.style.display = 'inline-flex';
    } else {
      igBtn.style.display = 'none';
    }
  }

  // Setup Call
  const callBtn = document.getElementById('vCall');
  if (callBtn) {
    if (vPhone) {
      callBtn.href = `tel:${vPhone}`;
      callBtn.style.display = 'inline-flex';
    } else {
      callBtn.style.display = 'none';
    }
  }

  // Setup Share Button
  const shareBtn = document.getElementById('vShareBtn');
  if (shareBtn) {
    shareBtn.onclick = async () => {
      const shareData = {
        title: `${vName} Trips | Ab Toh Ghoom Le`,
        text: `Check out all upcoming group trips and treks by ${vName} on Ab Toh Ghoom Le!`,
        url: dedicatedRouteUrl
      };
      if (navigator.share) {
        try { await navigator.share(shareData); return; } catch (_) {}
      }
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(dedicatedRouteUrl);
          alert(`Dedicated Storefront link copied to clipboard:\n${dedicatedRouteUrl}`);
          return;
        } catch (_) {}
      }
      prompt('Copy dedicated storefront link:', dedicatedRouteUrl);
    };
  }

  // Terms
  const vTermsContainer = document.getElementById('vTermsContainer');
  const vTermsText = document.getElementById('vTermsText');
  if (vTermsContainer && vTermsText) {
    if (vTerms) {
      vTermsText.textContent = vTerms;
      vTermsContainer.style.display = 'block';
    } else {
      vTermsContainer.style.display = 'none';
    }
  }

  renderVendorTripsGrid(_vendorTripsCache, vName);

  const loading = document.getElementById('storefrontLoading');
  const content = document.getElementById('storefrontContent');
  if (loading) loading.style.display = 'none';
  if (content) content.style.display = 'block';
}

async function initVendorStorefront() {
  const vendorIdentifier = getVendorIdentifier();

  if (!vendorIdentifier) {
    // Standard Vendor Landing / Partner With Us Page mode
    return;
  }

  // Hide generic landing page marketing sections
  const landingHero = document.querySelector('.vhero');
  const benefitsSection = document.getElementById('benefits');
  const howSection = document.getElementById('how-it-works');
  const appSection = document.getElementById('vendor-app');
  const trustSection = document.querySelector('.vtrust');
  const ctaSection = document.querySelector('.vcta');

  if (landingHero) landingHero.style.display = 'none';
  if (benefitsSection) benefitsSection.style.display = 'none';
  if (howSection) howSection.style.display = 'none';
  if (appSection) appSection.style.display = 'none';
  if (trustSection) trustSection.style.display = 'none';
  if (ctaSection) ctaSection.style.display = 'none';

  // Inject Dynamic Storefront Container right after Nav
  const nav = document.querySelector('.vnav');
  let storefrontContainer = document.getElementById('storefrontContainer');
  if (!storefrontContainer) {
    storefrontContainer = document.createElement('div');
    storefrontContainer.id = 'storefrontContainer';
    storefrontContainer.className = 'vsection';
    storefrontContainer.style.paddingTop = '100px';
    storefrontContainer.innerHTML = `
      <div id="storefrontLoading" style="text-align: center; padding: 80px 20px;">
        <div style="font-size: 2.5rem; margin-bottom: 1rem; animation: spin 1s infinite linear;">🧭</div>
        <h2 style="color: #fff; font-size: 1.5rem;">Loading Vendor Storefront...</h2>
        <p style="color: #888; font-size: 0.9rem; margin-top: 0.5rem;">Fetching all listed adventures...</p>
      </div>
      <div id="storefrontContent" style="display: none; max-width: 1100px; margin: 0 auto; width: 100%;">
        <!-- Vendor Profile Header Card -->
        <div class="v-storefront-card" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 28px; padding: 3rem 2rem; text-align: center; margin-bottom: 3rem; position: relative; overflow: hidden;">
          <div style="position: absolute; top:-100px; left:50%; transform:translateX(-50%); width:300px; height:300px; background:radial-gradient(circle, rgba(255,184,0,0.15) 0%, transparent 70%); pointer-events:none;"></div>
          
          <div style="width: 88px; height: 88px; border-radius: 50%; background: linear-gradient(135deg, #FFB800, #ff8800); color: #000; font-size: 2.8rem; font-weight: 900; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.2rem; box-shadow: 0 12px 35px rgba(255,184,0,0.35);" id="vAvatar">V</div>
          
          <div style="display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(59,130,246,0.15); color: #3b82f6; border: 1px solid rgba(59,130,246,0.3); padding: 0.35rem 0.9rem; border-radius: 50px; font-size: 0.8rem; font-weight: 700; margin-bottom: 1rem;">
            ✓ Verified Travel Organiser
          </div>
          
          <h1 id="vName" style="font-size: clamp(1.8rem, 5vw, 2.8rem); font-weight: 900; color: #fff; margin-bottom: 0.4rem; letter-spacing: -0.02em;">Vendor Storefront</h1>
          <p id="vSubtitle" style="color: var(--yellow); font-size: 1.05rem; font-weight: 600; margin-bottom: 0.8rem;">Active Trip Organiser</p>
          <p id="vBio" style="color: #aaa; font-size: 0.95rem; max-width: 650px; margin: 0 auto 1.8rem; line-height: 1.6;"></p>
          
          <!-- Direct Contact & Share Actions -->
          <div style="display: flex; gap: 0.8rem; justify-content: center; flex-wrap: wrap; align-items: center;" id="vActions">
            <a id="vWhatsapp" href="#" target="_blank" style="display: none; background: #25D366; color: #fff; padding: 0.75rem 1.6rem; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 0.9rem; align-items: center; gap: 0.4rem; box-shadow: 0 6px 20px rgba(37,211,102,0.3);">
              💬 Chat on WhatsApp
            </a>
            <a id="vInstagram" href="#" target="_blank" style="display: none; background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); color: #fff; padding: 0.75rem 1.6rem; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 0.9rem; align-items: center; gap: 0.4rem;">
              📸 Instagram
            </a>
            <a id="vCall" href="#" style="display: none; background: rgba(255,255,255,0.08); border: 1px solid var(--border); color: #fff; padding: 0.75rem 1.4rem; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 0.9rem;">
              📞 Call Organiser
            </a>
            <button id="vShareBtn" style="background: var(--yellow); color: #000; padding: 0.75rem 1.6rem; border-radius: 50px; border: none; cursor: pointer; font-weight: 800; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.4rem; box-shadow: 0 6px 20px rgba(255,184,0,0.3);">
              🔗 Share Storefront
            </button>
          </div>

          <!-- Dedicated Route Badge -->
          <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: center; gap: 0.6rem; flex-wrap: wrap;">
            <span style="font-size: 0.8rem; color: #777;">Dedicated Organiser URL:</span>
            <code id="vRouteDisplay" style="background: rgba(255,184,0,0.1); color: var(--yellow); padding: 0.25rem 0.7rem; border-radius: 6px; font-size: 0.85rem; border: 1px solid rgba(255,184,0,0.25);"></code>
          </div>
        </div>

        <!-- Active Trips Header & Real-time Filter -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
          <div>
            <div class="vsection-label" style="margin-bottom: 0.4rem;">All Listed Departures</div>
            <h2 class="vsection-title" id="tripsHeader" style="margin-bottom: 0;">Available Trips</h2>
          </div>
          <div style="display: flex; gap: 0.8rem; align-items: center;">
            <input type="text" id="vTripSearchInput" placeholder="Filter this organiser's trips..." oninput="handleVendorTripSearch(this.value)" style="background: rgba(255,255,255,0.06); border: 1px solid var(--border); color: #fff; padding: 0.6rem 1.2rem; border-radius: 50px; font-size: 0.85rem; width: 260px; outline: none;" />
          </div>
        </div>

        <!-- Trips Grid -->
        <div id="vendorTripsGrid" class="v-trips-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.8rem;">
        </div>

        <!-- Trust & Booking Guarantee Card -->
        <div style="margin-top: 4rem; background: linear-gradient(135deg, rgba(255,184,0,0.05), rgba(255,255,255,0.02)); border: 1px solid rgba(255,184,0,0.2); border-radius: 24px; padding: 2rem; display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap;">
          <div style="font-size: 2.5rem;">🛡️</div>
          <div style="flex: 1; min-width: 250px;">
            <h3 style="color: #fff; font-size: 1.15rem; margin-bottom: 0.3rem;">100% Direct Organiser Booking</h3>
            <p style="color: #aaa; font-size: 0.9rem; line-height: 1.5;">When you book on this storefront, your payment and booking details connect directly with this certified organiser. Zero commission fees are added, giving you the best authentic prices.</p>
          </div>
          <a href="index.html" class="btn-ghost" style="padding: 0.7rem 1.4rem; font-size: 0.85rem;">Explore All App Trips →</a>
        </div>

        <!-- Terms & Conditions Section -->
        <div id="vTermsContainer" style="display: none; margin-top: 2rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 20px; padding: 2rem;">
          <h3 style="color: var(--yellow); font-size: 1.15rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>📜</span> Organiser Guidelines & Policies
          </h3>
          <p id="vTermsText" style="color: #aaa; font-size: 0.95rem; line-height: 1.7; white-space: pre-line;"></p>
        </div>
      </div>
    `;
    nav.parentNode.insertBefore(storefrontContainer, nav.nextSibling);
  }

  const cleanSlug = toSlug(vendorIdentifier);

  // Fast path for demo / tests
  if (cleanSlug === 'demo' || cleanSlug === 'demo-vendor') {
    const demoCatalog = FALLBACK_VENDOR_CATALOG['sahyadri-trekkers'];
    updateStorefrontDOM('Sahyadri Trekkers (Verified Partner)', demoCatalog.phone, demoCatalog.instagram, demoCatalog.bio, demoCatalog.terms, demoCatalog.trips, 'demo');
    return;
  }

  // Check fallback catalog for instant paint
  const fallbackKey = cleanSlug === 'demo' ? 'sahyadri-trekkers' : cleanSlug;
  const fallbackVendor = FALLBACK_VENDOR_CATALOG[fallbackKey];

  let vendorName = 'Verified Travel Partner';
  let vendorPhone = '';
  let instagramUrl = '';
  let bio = '';
  let terms = '';
  let tripsList = [];

  if (fallbackVendor) {
    vendorName = fallbackVendor.name;
    vendorPhone = fallbackVendor.phone;
    instagramUrl = fallbackVendor.instagram;
    bio = fallbackVendor.bio || '';
    terms = fallbackVendor.terms || '';
    tripsList = [...fallbackVendor.trips];
    // Immediate synchronous paint
    updateStorefrontDOM(vendorName, vendorPhone, instagramUrl, bio, terms, tripsList, cleanSlug);
  }

  // Query Firestore asynchronously with a timeout guard
  try {
    if (window._fbApp && window._fbApp.db) {
      const { db, doc, getDoc, collection, query, where, getDocs } = window._fbApp;

      const firestoreQueryPromise = (async () => {
        // Check users/{vendorIdentifier} (if it is a UID)
        try {
          const userRef = doc(db, 'users', vendorIdentifier);
          const userSnap = await getDoc(userRef);
          if (userSnap && userSnap.exists()) {
            const u = userSnap.data();
            vendorName = u.businessName || u.name || vendorName;
            vendorPhone = u.whatsapp || u.phone || vendorPhone;
            instagramUrl = u.instagramUrl || instagramUrl;
            bio = u.bio || bio;
            terms = u.termsAndConditions || terms;
          }
        } catch (_) {}

        // Query trips by vendorId
        const tripsRef = collection(db, 'trips');
        const liveTrips = [];

        try {
          const qById = query(tripsRef, where('vendorId', '==', vendorIdentifier));
          const snapById = await getDocs(qById);
          snapById.forEach(docSnap => {
            liveTrips.push({ id: docSnap.id, ...docSnap.data() });
          });
        } catch (_) {}

        // If no trips by ID, query by vendorName
        if (liveTrips.length === 0) {
          try {
            const qByName = query(tripsRef, where('vendorName', '==', vendorIdentifier));
            const snapByName = await getDocs(qByName);
            snapByName.forEach(docSnap => {
              liveTrips.push({ id: docSnap.id, ...docSnap.data() });
            });
          } catch (_) {}
        }

        // If still 0, query all published trips and match by slug
        if (liveTrips.length === 0) {
          try {
            const qAll = query(tripsRef, where('status', '==', 'published'));
            const snapAll = await getDocs(qAll);
            snapAll.forEach(docSnap => {
              const data = docSnap.data();
              if (toSlug(data.vendorName) === cleanSlug || toSlug(data.vendorId) === cleanSlug) {
                liveTrips.push({ id: docSnap.id, ...data });
              }
            });
          } catch (_) {}
        }

        if (liveTrips.length > 0) {
          tripsList = liveTrips;
          if (!vendorPhone && liveTrips[0].vendorWhatsApp) {
            vendorPhone = liveTrips[0].vendorWhatsApp;
          }
          if (liveTrips[0].vendorName && vendorName === 'Verified Travel Partner') {
            vendorName = liveTrips[0].vendorName;
          }
          updateStorefrontDOM(vendorName, vendorPhone, instagramUrl, bio, terms, tripsList, cleanSlug);
        }
      })();

      // Prevent hanging on offline network timeout
      await Promise.race([
        firestoreQueryPromise,
        new Promise(resolve => setTimeout(resolve, 2000))
      ]);
    }
  } catch (err) {
    console.warn('Firestore live vendor lookup notice:', err);
  }

  // Ensure DOM is painted
  if (!fallbackVendor && tripsList.length === 0) {
    updateStorefrontDOM(vendorName, vendorPhone, instagramUrl, bio, terms, tripsList, cleanSlug);
  }
}

function handleVendorTripSearch(query) {
  const q = String(query || '').toLowerCase().trim();
  if (!q) {
    renderVendorTripsGrid(_vendorTripsCache);
    return;
  }
  const filtered = _vendorTripsCache.filter(t => 
    (t.title && t.title.toLowerCase().includes(q)) ||
    (t.category && t.category.toLowerCase().includes(q)) ||
    (t.description && t.description.toLowerCase().includes(q))
  );
  renderVendorTripsGrid(filtered);
}

function renderVendorTripsGrid(trips, vendorName) {
  const grid = document.getElementById('vendorTripsGrid');
  if (!grid) return;

  if (!trips || trips.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: rgba(255,255,255,0.02); border-radius: 24px; border: 1px solid var(--border);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🏕️</div>
        <h3 style="color: #fff; font-size: 1.3rem;">No matching trips found</h3>
        <p style="color: #777; margin-top: 0.5rem;">Check back soon for upcoming departure announcements from ${escapeHtml(vendorName || 'this organiser')}.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = trips.map(trip => {
    const img = (trip.images && trip.images.length > 0) ? trip.images[0] : 'hero.png';
    const date = (trip.batches && trip.batches.length > 0) ? trip.batches[0].dateDuration : 'Upcoming Dates';
    const price = (trip.packages && trip.packages.length > 0) ? trip.packages[0].price : (trip.price || 0);
    const category = trip.category || 'Trek';
    const tripDetailUrl = `trip.html?id=${encodeURIComponent(trip.id)}`;

    return `
      <div class="vbento-card" style="padding: 0; overflow: hidden; border-radius: 24px; display: flex; flex-direction: column; height: 100%; background: rgba(255,255,255,0.03); border: 1px solid var(--border); transition: transform 0.25s, border-color 0.25s;">
        <div style="position: relative; height: 210px; overflow: hidden;">
          <img src="${img}" alt="${escapeHtml(trip.title)}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" onerror="this.src='hero.png'" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" />
          <span style="position: absolute; top: 14px; left: 14px; background: rgba(0,0,0,0.75); backdrop-filter: blur(10px); color: var(--yellow); padding: 5px 12px; border-radius: 50px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid rgba(255,184,0,0.3);">
            ${escapeHtml(category)}
          </span>
        </div>
        <div style="padding: 1.6rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; margin-bottom: 0.6rem; line-height: 1.3;">
              ${escapeHtml(trip.title)}
            </h3>
            <p style="color: var(--yellow); font-size: 0.85rem; font-weight: 600; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.4rem;">
              <span>📅</span> ${escapeHtml(date)}
            </p>
            <p style="color: #777; font-size: 0.88rem; line-height: 1.5; margin-bottom: 1.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${escapeHtml(trip.description || 'Explore this curated group departure with verified itinerary, transport, and certified leadership.')}
            </p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 1.2rem;">
            <div>
              <span style="font-size: 0.72rem; color: #888; text-transform: uppercase; letter-spacing: 0.05em; display: block;">Starting from</span>
              <span style="font-size: 1.45rem; font-weight: 900; color: #fff;">₹${Number(price).toLocaleString('en-IN')}</span>
            </div>
            <a href="${tripDetailUrl}" class="btn-yellow" style="padding: 0.65rem 1.3rem; font-size: 0.85rem; font-weight: 800; text-decoration: none; border-radius: 50px; display: inline-flex; align-items: center; gap: 0.3rem;">
              View & Book →
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

if (window._fbApp) {
  initVendorStorefront();
} else {
  window.addEventListener('firebase-ready', initVendorStorefront);
}
// Also run on DOMContentLoaded for instant offline/catalog rendering
document.addEventListener('DOMContentLoaded', () => {
  if (getVendorIdentifier()) {
    initVendorStorefront();
  }
});
