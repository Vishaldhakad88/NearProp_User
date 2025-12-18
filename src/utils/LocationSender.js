// src/components/LocationSender.js
import React, { useEffect } from 'react';
import { fetchDistrictIdFromGoogle, getCurrentPosition } from '../utils/locationService';
import axios from 'axios';

const GOOGLE_MAP_KEY = 'AIzaSyAepBinSy2JxyEvbidFz_AnFYFsFlFqQo4'; // Replace with your real key

const LocationSender = ({ onLocationFetched }) => {
  const token = localStorage.getItem('token');
console.log('ritiikkkkkkkkkkk:', token);
  // Fetch all districts with Authorization
  const fetchDistricts = async (lat, lon) => {
            const token = getToken();
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'Authorization': `Bearer ${token}` }),
                    },
                };
                const response = await axios.get(`${baseurl}/api/property-districts`, config);
                console.log('Districts API response:', response.data);

                // For simplicity, we'll pick the first active district from the response
                // In a real scenario, match lat/lon with pincode or use a reverse geocoding service
                const districts = response.data;
                const matchedDistrict = districts.find(d => d.active) || { name: 'Unknown District' };
                localStorage.setItem('district_name', matchedDistrict.name);
                onLocationFetched(matchedDistrict.name);
            } catch (error) {
                console.error('Failed to fetch districts:', error);
              
                onLocationFetched('Unknown District');
            }
        };

  useEffect(() => {
    const sendLocation = async () => {
      try {
        if (!token) return;

        const position = await getCurrentPosition();
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        localStorage.setItem('user_lat', lat);
        localStorage.setItem('user_lng', lng);

        const { districtName } = await fetchDistrictIdFromGoogle(lat, lng, GOOGLE_MAP_KEY);
        const districts = await fetchAllDistricts();

        let districtId = 0;
        let matchedDistrictName = districtName;

        const match = districts.find(
          (d) =>
            d.name.toLowerCase().includes(districtName.toLowerCase()) ||
            districtName.toLowerCase().includes(d.name.toLowerCase())
        );

        if (match) {
          districtId = match.id;
          matchedDistrictName = match.name;
        } else {
          console.warn(`⚠️ District "${districtName}" not matched. Using districtId = 0`);
        }

        localStorage.setItem('district_name', matchedDistrictName);
        if (onLocationFetched) onLocationFetched(matchedDistrictName);

        try {
          const res = await axios.post(
            'http://13.126.35.188:8080/api/v1/users/location',
            {
              latitude: lat,
              longitude: lng,
              districtId,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log('✅ Location successfully sent to backend:', res.data);
        } catch (axiosError) {
          console.error('❌ Failed to send location to backend:', axiosError?.response?.data || axiosError.message);
        }
      } catch (error) {
        console.error('❌ Location processing failed:', error || error);
      }
    };

    sendLocation();
  }, [token, onLocationFetched]);

  return null;
};

export default LocationSender;
