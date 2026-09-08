'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Default Location: Ara, Bihar (Center)
export const DEFAULT_LOCATION = {
  city: 'Ara',
  area: 'Grand Trunk Road',
  street: 'Grand Trunk Road',
  houseNo: '',
  landmark: '',
  fullAddress: 'Grand Trunk Road, Ara, Bihar - 802301',
  pincode: '802301',
  lat: 25.5560,
  lng: 84.6600,
  isGps: false,
  isLoaded: false
};

export const PRESET_LOCATIONS = [
  { city: 'Ara', area: 'Grand Trunk Road', pincode: '802301', lat: 25.5560, lng: 84.6600 },
  { city: 'Ara', area: 'Station Road', pincode: '802301', lat: 25.5580, lng: 84.6620 },
  { city: 'Ara', area: 'Nawada Market', pincode: '802302', lat: 25.5680, lng: 84.6750 },
  { city: 'Ara', area: 'Civil Lines', pincode: '802301', lat: 25.5610, lng: 84.6680 },
  { city: 'Ara', area: 'Dharhara Kothi', pincode: '802301', lat: 25.5490, lng: 84.6480 },
  { city: 'Patna', area: 'Boring Road', pincode: '800001', lat: 25.6120, lng: 85.1250 },
  { city: 'Patna', area: 'Kankarbagh', pincode: '800020', lat: 25.5940, lng: 85.1580 },
  { city: 'Patna', area: 'Patliputra Colony', pincode: '800013', lat: 25.6200, lng: 85.1100 }
];

const LocationContext = createContext({
  location: DEFAULT_LOCATION,
  recentLocations: [],
  detectGpsLocation: async () => {},
  selectLocation: () => {},
  isDetecting: false,
  locationError: null,
  isLocationPickerOpen: false,
  setIsLocationPickerOpen: () => {},
  toast: { show: false, area: '', city: '' },
  hideToast: () => {}
});

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [recentLocations, setRecentLocations] = useState([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, area: '', city: '' });

  // Function to show location toast for 2 seconds
  const showToastNotification = (area, city) => {
    setToast({ show: true, area, city });
    setTimeout(() => {
      setToast({ show: false, area: '', city: '' });
    }, 2000);
  };

  // Helper to save location and update recent locations (max 5)
  const saveAndApplyLocation = useCallback((newLoc, triggerToast = true) => {
    const updated = { ...newLoc, isLoaded: true };
    setLocation(updated);

    try {
      localStorage.setItem('localkart_user_location', JSON.stringify(updated));

      // Update recent locations array (max 5, no duplicates by area+city)
      const savedRecents = localStorage.getItem('localkart_recent_locations');
      let recentsList = savedRecents ? JSON.parse(savedRecents) : [];
      
      recentsList = recentsList.filter(
        (item) => !(item.area === updated.area && item.city === updated.city)
      );
      recentsList.unshift(updated);
      recentsList = recentsList.slice(0, 5);

      setRecentLocations(recentsList);
      localStorage.setItem('localkart_recent_locations', JSON.stringify(recentsList));
    } catch (e) {
      console.error('Error persisting location:', e);
    }

    if (triggerToast && updated.area) {
      showToastNotification(updated.area, updated.city);
    }
  }, []);

  // GPS Geolocation Detector
  const detectGpsLocation = useCallback(async (silentOnFail = false) => {
    if (!navigator.geolocation) {
      const err = 'Geolocation is not supported by your browser';
      setLocationError(err);
      if (!silentOnFail) setIsLocationPickerOpen(true);
      return false;
    }

    setIsDetecting(true);
    setLocationError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          let area = 'Current GPS Location';
          let city = 'Ara';
          let pincode = '802301';

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            if (res.ok) {
              const data = await res.json();
              if (data && data.address) {
                city = data.address.city || data.address.town || data.address.state_district || 'Ara';
                area =
                  data.address.suburb ||
                  data.address.neighbourhood ||
                  data.address.road ||
                  data.address.residential ||
                  'Current Location';
                pincode = data.address.postcode || '802301';
              }
            }
          } catch (err) {
            console.log('Reverse geocode fallback used:', err);
          }

          const gpsLoc = {
            lat,
            lng,
            city,
            area,
            pincode,
            isGps: true
          };

          saveAndApplyLocation(gpsLoc, true);
          setIsDetecting(false);
          setIsLocationPickerOpen(false);
          resolve(true);
        },
        (error) => {
          setIsDetecting(false);
          let errText = 'Location permission denied. Please select location manually.';
          if (error.code === error.POSITION_UNAVAILABLE) {
            errText = 'Location information unavailable.';
          } else if (error.code === error.TIMEOUT) {
            errText = 'Location request timed out.';
          }
          setLocationError(errText);

          // If GPS denied/failed, open location picker modal
          setIsLocationPickerOpen(true);
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }, [saveAndApplyLocation]);

  // First Visit & Saved Location Priority Resolution
  useEffect(() => {
    // Read recent locations
    try {
      const savedRecents = localStorage.getItem('localkart_recent_locations');
      if (savedRecents) {
        setRecentLocations(JSON.parse(savedRecents));
      }
    } catch (e) {
      console.error('Error loading recent locations:', e);
    }

    // Check Priority:
    // 1 & 2: Logged-in user's saved location stored in localStorage
    // 3: Browser localStorage
    try {
      const saved = localStorage.getItem('localkart_user_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.lat && parsed.lng) {
          setLocation({ ...parsed, isLoaded: true });
          return; // Saved location exists: load immediately, do NOT ask again
        }
      }
    } catch (e) {
      console.error('Error loading saved location:', e);
    }

    // Priority 4: No saved location exists -> Automatically request browser geolocation!
    detectGpsLocation(true);
  }, [detectGpsLocation]);

  // Handle manual/click selection
  const selectLocation = (selectedLoc) => {
    const full = selectedLoc.fullAddress || 
      `${selectedLoc.houseNo ? selectedLoc.houseNo + ', ' : ''}${selectedLoc.street || selectedLoc.area || ''}${selectedLoc.landmark ? ', Near ' + selectedLoc.landmark : ''}, ${selectedLoc.city || 'Ara'} - ${selectedLoc.pincode || '802301'}`;

    saveAndApplyLocation({
      ...selectedLoc,
      fullAddress: full,
      isGps: Boolean(selectedLoc.isGps)
    }, true);
    setIsLocationPickerOpen(false);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        recentLocations,
        detectGpsLocation,
        selectLocation,
        isDetecting,
        locationError,
        isLocationPickerOpen,
        setIsLocationPickerOpen,
        toast
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
