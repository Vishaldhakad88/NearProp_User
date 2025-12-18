import axios from 'axios';

export const baseurl = 'https://api.nearprop.com'; // Replace with actual base URL

export const getAuthData = () => {
  const authData = localStorage.getItem('authData');
  if (authData) {
    try {
      return JSON.parse(authData);
    } catch (err) {
      console.error('Error parsing authData:', err);
      return null;
    }
  }
  return null;
};

export const getToken = () => {
  const authData = getAuthData();
  return authData?.token || null;
};

export const fetchDistricts = async (setDistricts, setStates) => {
  try {
    const token = getToken();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };
    const res = await axios.get(`${baseurl}/property-districts`, config);
    const districtData = res.data || [];
    setDistricts(districtData);
    const uniqueStates = [...new Set(districtData.map((district) => district.state))].sort();
    setStates(uniqueStates);
  } catch (error) {
    console.error('District fetch error:', error.response || error);
  }
};

export const getCurrentLocation = async (lat, lng, setCurrentLocation) => {
  try {
    const googleResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAepBinSy2JxyEvbidFz_AnFYFsFlFqQo4`
    );

    if (googleResponse.data.status === 'OK') {
      const addressComponents = googleResponse.data.results[0].address_components;

      let city = '';
      let state = '';
      let districtName = '';

      for (const component of addressComponents) {
        if (component.types.includes('locality')) {
          city = component.long_name;
        } else if (!city && component.types.includes('administrative_area_level_2')) {
          city = component.long_name;
        } else if (!city && component.types.includes('administrative_area_level_3')) {
          city = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          state = component.long_name;
        }
        if (component.types.includes('administrative_area_level_3')) {
          districtName = component.long_name;
        } else if (component.types.includes('administrative_area_level_2')) {
          districtName = component.long_name;
        }
      }

      if (city.toLowerCase().includes('district')) {
        city = city.replace(/ District$/i, '').trim();
      }

      const formattedLocation = city && state ? `${city}, ${state}` : city || state || 'Location not found';
      setCurrentLocation(formattedLocation);

      const token = getToken();
      if (token && (city || districtName)) {
        try {
          const districtsResponse = await axios.get(`${baseurl}/property-districts`, {
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          });
          const districts = districtsResponse.data;

          const matchingDistrict = districts.find(
            (district) =>
              (city && city.toLowerCase() === district.name?.toLowerCase()) ||
              (city && city.toLowerCase() === district.city?.toLowerCase()) ||
              (districtName && districtName.toLowerCase() === district.name?.toLowerCase())
          );

          if (matchingDistrict) {
            const locationPayload = {
              latitude: lat,
              longitude: lng,
              districtId: matchingDistrict.id,
            };

            const locationRes = await axios.post(`${baseurl}/v1/users/location`, locationPayload, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            });
            console.log('Location update response:', locationRes.data);
          }
        } catch (districtError) {
          console.error('District fetch for location error:', districtError.response || districtError);
        }
      }
    } else {
      setCurrentLocation('Location not found');
    }
  } catch (error) {
    console.error('Location fetch error:', error.response || error);
    setCurrentLocation('Location not found');
  }
};

export const getTrimmedLocation = (location) => {
  if (!location) return 'Location not found';
  return location.length > 50 ? location.slice(0, 50) + '...' : location;
};