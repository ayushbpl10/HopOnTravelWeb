window.addEventListener('firebase-ready', async () => {
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

  try {
    const { db, doc, getDoc } = window._fbApp;
    
    // Fetch trip
    const tripRef = doc(db, 'trips', tripId);
    const tripSnap = await getDoc(tripRef);

    if (!tripSnap.exists()) {
      loadingState.style.display = 'none';
      errorState.style.display = 'block';
      return;
    }

    const tripData = tripSnap.data();

    // Populate DOM
    document.title = `${tripData.title} | Ab Toh Ghoom Le`;
    document.getElementById('tripTitle').textContent = tripData.title || 'Trip Details';
    document.getElementById('tripDesc').textContent = tripData.description || '';
    document.getElementById('tripVendor').textContent = tripData.vendorName || 'Unknown';
    
    if (tripData.images && tripData.images.length > 0) {
      document.getElementById('tripImage').src = tripData.images[0];
    }

    if (tripData.batches && tripData.batches.length > 0) {
      document.getElementById('tripDate').textContent = tripData.batches[0].dateDuration;
    }

    if (tripData.packages && tripData.packages.length > 0) {
      // Find lowest price
      const lowestPrice = Math.min(...tripData.packages.map(p => p.price || 0));
      document.getElementById('tripPrice').textContent = `₹${lowestPrice}`;
    }

    // Set deep link
    const openAppBtn = document.getElementById('openAppBtn');
    openAppBtn.href = `hopontravel://trip/${tripId}`;
    
    // Inject SEO meta tags dynamically
    const ogTitle = `${tripData.title} | Ab Toh Ghoom Le`;
    const ogDesc = tripData.description ? tripData.description.substring(0, 160) : 'Book this amazing trip on Ab Toh Ghoom Le';
    const ogImage = (tripData.images && tripData.images.length > 0) ? tripData.images[0] : 'https://abtohghoomle.com/hero.png';
    const ogUrl = `https://abtohghoomle.com/trip.html?id=${tripId}`;

    const metaTags = {
      'og:title': ogTitle,
      'og:description': ogDesc,
      'og:image': ogImage,
      'og:url': ogUrl,
      'og:type': 'website',
      'twitter:card': 'summary_large_image',
      'twitter:title': ogTitle,
      'twitter:description': ogDesc,
      'twitter:image': ogImage,
    };
    Object.entries(metaTags).forEach(([property, content]) => {
      let meta = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(property.startsWith('og:') ? 'property' : 'name', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });
    // Update description meta
    let descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', ogDesc);

    // Inject JSON-LD structured data for Google rich results
    const lowestPrice = (tripData.packages && tripData.packages.length > 0) ? Math.min(...tripData.packages.map(p => p.price || 0)) : 0;
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      'name': tripData.title,
      'description': tripData.description || '',
      'image': ogImage,
      'url': ogUrl,
      'organizer': {
        '@type': 'Organization',
        'name': tripData.vendorName || 'Ab Toh Ghoom Le',
      },
      'offers': {
        '@type': 'Offer',
        'price': lowestPrice,
        'priceCurrency': 'INR',
        'availability': 'https://schema.org/InStock',
        'url': ogUrl,
      },
    };
    if (tripData.batches && tripData.batches.length > 0) {
      jsonLd['startDate'] = tripData.batches[0].dateDuration;
    }
    const scriptTag = document.createElement('script');
    scriptTag.type = 'application/ld+json';
    scriptTag.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(scriptTag);

    loadingState.style.display = 'none';
    tripContent.style.display = 'block';

  } catch (error) {
    console.error("Error fetching trip details:", error);
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
  }
});
