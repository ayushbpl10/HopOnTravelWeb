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
    
    // Add fallback timer to deep link in case app is not installed
    openAppBtn.addEventListener('click', (e) => {
      // It will try to open hopontravel://
      // After a timeout, if page is still active, prompt to download
      setTimeout(() => {
        // If the app wasn't installed, they might still be here
        // We can just let them know or redirect to download if needed.
        // But standard anchor tag behavior is fine.
      }, 2000);
    });

    loadingState.style.display = 'none';
    tripContent.style.display = 'block';

  } catch (error) {
    console.error("Error fetching trip details:", error);
    loadingState.style.display = 'none';
    errorState.style.display = 'block';
  }
});
