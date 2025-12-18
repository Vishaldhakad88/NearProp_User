// src/utils/locationService.js
export const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Geolocation not supported');
    }
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });

export const fetchDistrictIdFromGoogle = async (lat, lng, apiKey) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
  );
  const data = await response.json();
//   console.log('📍 Geolocation response:', data);

  if (!data.results || !data.results.length) {
    throw new Error('No location results found');
  }

  const districtComponent = data.results[0].address_components.find((comp) =>
    comp.types.includes('administrative_area_level_2')
  );

  const districtName = districtComponent?.long_name || 'Unknown District';

  return { districtName };
};


