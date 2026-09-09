window.addEventListener('firebase-ready', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const vendorId = urlParams.get('id') || urlParams.get('vendorId');

  if (!vendorId) {
    // Standard Vendor Landing Page mode
    return;
  }

  // Switch page to Dynamic Vendor Storefront mode
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
  const storefrontContainer = document.createElement('div');
  storefrontContainer.id = 'storefrontContainer';
  storefrontContainer.className = 'vsection';
  storefrontContainer.style.paddingTop = '100px';
  storefrontContainer.innerHTML = `
    <div id="storefrontLoading" style="text-align: center; padding: 80px 20px;">
      <div style="font-size: 2.5rem; margin-bottom: 1rem; animation: spin 1s infinite linear;">🧭</div>
      <h2 style="color: #fff; font-size: 1.5rem;">Loading Vendor Storefront...</h2>
    </div>
    <div id="storefrontContent" style="display: none; max-width: 1100px; margin: 0 auto;">
      <!-- Vendor Header Card -->
      <div style="background: linear-gradient(135deg, rgba(255,184,0,0.1), rgba(20,20,20,0.9)); border: 1px solid var(--yellow); border-radius: 24px; padding: 2.5rem; text-align: center; margin-bottom: 3rem; position: relative; overflow: hidden; backdrop-filter: blur(10px);">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--yellow); color: #000; font-size: 2.5rem; font-weight: 900; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.2rem; box-shadow: 0 10px 30px rgba(255,184,0,0.4);" id="vAvatar">V</div>
        <div style="display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(59,130,246,0.15); color: #3b82f6; border: 1px solid rgba(59,130,246,0.3); padding: 0.3rem 0.8rem; border-radius: 50px; font-size: 0.8rem; font-weight: 700; margin-bottom: 1rem;">
          ✓ Verified Travel Partner
        </div>
        <h1 id="vName" style="font-size: 2.5rem; font-weight: 900; color: #fff; margin-bottom: 0.5rem;">Vendor Storefront</h1>
        <p id="vSubtitle" style="color: #aaa; font-size: 1rem; margin-bottom: 1.5rem;">Active Trip Organiser</p>
        
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;" id="vActions">
          <a id="vWhatsapp" href="#" target="_blank" style="display: none; background: #25D366; color: #fff; padding: 0.7rem 1.5rem; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 0.9rem;">💬 WhatsApp</a>
          <a id="vInstagram" href="#" target="_blank" style="display: none; background: #E1306C; color: #fff; padding: 0.7rem 1.5rem; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 0.9rem;">📸 Instagram</a>
          <button id="vShareBtn" style="background: var(--yellow); color: #000; padding: 0.7rem 1.5rem; border-radius: 50px; border: none; cursor: pointer; font-weight: 700; font-size: 0.9rem;">🔗 Share Profile</button>
        </div>
      </div>

      <!-- Active Trips Grid -->
      <div style="margin-bottom: 2rem;">
        <div class="vsection-label">Active Listings</div>
        <h2 class="vsection-title" id="tripsHeader">Available Trips</h2>
      </div>

      <div id="vendorTripsGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem;">
      </div>

      <!-- Terms & Conditions Section -->
      <div id="vTermsContainer" style="display: none; margin-top: 4rem; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 20px; padding: 2rem;">
        <h3 style="color: var(--yellow); font-size: 1.2rem; margin-bottom: 1rem;">📜 Vendor Terms & Policy</h3>
        <p id="vTermsText" style="color: #aaa; font-size: 0.95rem; line-height: 1.7; white-space: pre-line;"></p>
      </div>
    </div>
  `;

  nav.parentNode.insertBefore(storefrontContainer, nav.nextSibling);

  try {
    const { db, doc, getDoc, collection, query, where, getDocs } = window._fbApp;

    // Fetch vendor user profile
    let vendorName = 'Verified Travel Partner';
    let vendorPhone = '';
    let instagramUrl = '';
    let terms = '';

    const userRef = doc(db, 'users', vendorId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const u = userSnap.data();
      vendorName = u.name || u.businessName || vendorName;
      vendorPhone = u.whatsapp || u.phone || '';
      instagramUrl = u.instagramUrl || '';
      terms = u.termsAndConditions || '';
    }

    // Fetch trips
    const tripsRef = collection(db, 'trips');
    const qById = query(tripsRef, where('vendorId', '==', vendorId));
    const snapById = await getDocs(qById);

    let tripsList = [];
    snapById.forEach(docSnap => {
      tripsList.push({ id: docSnap.id, ...docSnap.data() });
    });

    if (tripsList.length === 0) {
      const qByName = query(tripsRef, where('vendorName', '==', vendorId));
      const snapByName = await getDocs(qByName);
      snapByName.forEach(docSnap => {
        tripsList.push({ id: docSnap.id, ...docSnap.data() });
      });
    }

    if (tripsList.length > 0 && !userSnap.exists()) {
      vendorName = tripsList[0].vendorName || vendorName;
      vendorPhone = tripsList[0].vendorWhatsApp || '';
    }

    // Demo fallback for demo testing or unlisted vendor IDs
    if (vendorId === 'demo' || (tripsList.length === 0 && !userSnap.exists())) {
      vendorName = 'Sahyadri Trekkers (Verified Partner)';
      vendorPhone = '+919876543210';
      instagramUrl = 'https://instagram.com';
      terms = '📜 Cancellation Policy:\n• 100% refund if cancelled 7 days prior.\n• 50% refund if cancelled 48 hours prior.\n• Non-refundable within 24 hours of departure.';
      tripsList = [{
        id: 'demo',
        title: 'Harishchandragad & Kokankada Trek',
        category: 'Trekking',
        description: 'Explore the mighty Harishchandragad fort, Kedareshwar cave, and Kokankada cliff. Overnight trek with camping & sunrise view.',
        batches: [{ dateDuration: '05-06 Sep (Sat night to Sun night)' }],
        packages: [{ price: 999 }],
        images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80']
      }];
    }

    // Update DOM
    document.title = `${vendorName} Storefront | Ab Toh Ghoom Le`;
    document.getElementById('vAvatar').textContent = vendorName.charAt(0).toUpperCase();
    document.getElementById('vName').textContent = vendorName;
    document.getElementById('vSubtitle').textContent = `${tripsList.length} Active ${tripsList.length === 1 ? 'Trip' : 'Trips'} Listed`;
    document.getElementById('tripsHeader').textContent = `Trips by ${vendorName} (${tripsList.length})`;

    if (vendorPhone) {
      const waBtn = document.getElementById('vWhatsapp');
      waBtn.href = `https://wa.me/${vendorPhone.replace(/[^0-9]/g, '')}`;
      waBtn.style.display = 'inline-flex';
    }

    if (instagramUrl) {
      const igBtn = document.getElementById('vInstagram');
      igBtn.href = instagramUrl;
      igBtn.style.display = 'inline-flex';
    }

    document.getElementById('vShareBtn').onclick = () => {
      const shareUrl = window.location.href;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl);
        alert('Vendor Storefront link copied to clipboard!');
      } else {
        alert(`Share Link: ${shareUrl}`);
      }
    };

    if (terms) {
      document.getElementById('vTermsText').textContent = terms;
      document.getElementById('vTermsContainer').style.display = 'block';
    }

    const grid = document.getElementById('vendorTripsGrid');
    if (tripsList.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: rgba(255,255,255,0.02); border-radius: 20px; border: 1px solid var(--border);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🏕️</div>
          <h3 style="color: #fff; font-size: 1.3rem;">No active trips right now</h3>
          <p style="color: #666; margin-top: 0.5rem;">Check back soon for upcoming departures from ${vendorName}.</p>
        </div>
      `;
    } else {
      grid.innerHTML = tripsList.map(trip => {
        const img = (trip.images && trip.images.length > 0) ? trip.images[0] : 'hero.png';
        const date = trip.batches && trip.batches.length > 0 ? trip.batches[0].dateDuration : 'Upcoming';
        const price = (trip.packages && trip.packages.length > 0) ? trip.packages[0].price : (trip.price || 0);

        const tripTargetUrl = (window.location.pathname.includes('/vendor') && !window.location.pathname.endsWith('.html'))
          ? `trip?id=${encodeURIComponent(trip.id)}`
          : `trip.html?id=${encodeURIComponent(trip.id)}`;

        return `
          <div class="vbento-card" style="padding: 0; overflow: hidden; border-radius: 20px; display: flex; flex-direction: column; height: 100%;">
            <div style="position: relative; height: 200px;">
              <img src="${img}" alt="${trip.title}" style="width: 100%; height: 100%; object-fit: cover;" />
              <span style="position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); color: var(--yellow); padding: 4px 10px; border-radius: 50px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">
                ${trip.category || 'Trek'}
              </span>
            </div>
            <div style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <h3 style="font-size: 1.2rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">${trip.title}</h3>
                <p style="color: #aaa; font-size: 0.85rem; margin-bottom: 1rem;">📅 ${date}</p>
                <p style="color: #777; font-size: 0.85rem; line-height: 1.5; margin-bottom: 1.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                  ${trip.description || ''}
                </p>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 1rem;">
                <div>
                  <span style="font-size: 0.75rem; color: #666; display: block;">Starting from</span>
                  <span style="font-size: 1.4rem; font-weight: 900; color: var(--yellow);">₹${price}</span>
                </div>
                <a href="${tripTargetUrl}" class="btn-yellow" style="padding: 0.6rem 1.2rem; font-size: 0.85rem; text-decoration: none; display: inline-block;">View Trip →</a>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    document.getElementById('storefrontLoading').style.display = 'none';
    document.getElementById('storefrontContent').style.display = 'block';

  } catch (err) {
    console.error('Error rendering vendor storefront:', err);
    document.getElementById('storefrontLoading').innerHTML = `
      <h2 style="color: #e53e3e;">Vendor Storefront Not Found</h2>
      <p style="color: #888; margin-top: 10px;">Could not load trips for this vendor ID.</p>
    `;
  }
});
