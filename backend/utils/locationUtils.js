/**
 * Haversine formula to calculate the distance between two coordinates in Kilometers
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Distance in kilometers (rounded to 1 decimal place)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return 0;
  }

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}

function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Estimates delivery time window based on distance in KM
 * @param {number} distanceKm 
 * @returns {{ deliveryTime: string, isDeliverable: boolean }}
 */
function estimateDeliveryTime(distanceKm) {
  if (distanceKm <= 1.0) {
    return { deliveryTime: '10-15 mins', isDeliverable: true };
  } else if (distanceKm <= 3.0) {
    return { deliveryTime: '15-20 mins', isDeliverable: true };
  } else if (distanceKm <= 5.0) {
    return { deliveryTime: '20-30 mins', isDeliverable: true };
  } else if (distanceKm <= 8.0) {
    return { deliveryTime: '30-45 mins', isDeliverable: true };
  } else {
    return { deliveryTime: 'Unavailable', isDeliverable: false };
  }
}

/**
 * Enriches a store or product entity with distance and delivery time metrics
 * @param {Object} entity 
 * @param {number} userLat 
 * @param {number} userLng 
 * @param {number} storeLat 
 * @param {number} storeLng 
 * @returns {Object}
 */
function attachLocationMetrics(entity, userLat, userLng, storeLat, storeLng) {
  const distanceKm = calculateDistance(userLat, userLng, storeLat, storeLng);
  const { deliveryTime, isDeliverable } = estimateDeliveryTime(distanceKm);
  return {
    ...entity,
    distanceKm,
    deliveryTime,
    isDeliverable
  };
}

export {
  calculateDistance,
  estimateDeliveryTime,
  attachLocationMetrics
};
