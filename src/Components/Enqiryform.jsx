import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Enquiryform.css';

const API_CONFIG = {
  baseUrl: 'https://api.nearprop.com',
  apiPrefix: 'api',
};

const GOOGLE_MAPS_API_KEY = 'AIzaSyAepBinSy2JxyEvbidFz_AnFYFsFlFqQo4';

const getToken = () => {
  try {
    const authData = localStorage.getItem('authData');
    if (!authData) {
      console.warn('No authData found in localStorage');
      return null;
    }
    const parsedData = JSON.parse(authData);
    const token = parsedData.token || null;
    console.log('Retrieved token:', token ? 'Token exists' : 'No token found');
    return token;
  } catch (err) {
    console.error('Error parsing authData:', err.message);
    return null;
  }
};

function Enquiryform() {
  const [inquiryFormData, setInquiryFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    infoType: '',
    propertyType: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    minSize: '',
    state: '',
    city: '',
    area: '',
    zipCode: '',
    districtId: '',
    latitude: '',
    longitude: '',
    message: '',
    gdprConsent: false,
  });
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  // Fetch districts on component mount
  useEffect(() => {
    const fetchDistricts = async () => {
      setIsLocationLoading(true);
      setLocationError('');
      try {
        const token = getToken();
        if (!token) throw new Error('No authentication token found. Please log in.');
        const response = await axios.get(`${API_CONFIG.baseUrl}/${API_CONFIG.apiPrefix}/property-districts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDistricts(response.data);
        const uniqueStates = [...new Set(response.data.map(item => item.state))].sort();
        setStates(uniqueStates);
        setFilteredDistricts([]);
      } catch (err) {
        console.error('Error fetching districts:', err);
        setLocationError('Failed to load location data. Please select manually.');
      } finally {
        setIsLocationLoading(false);
      }
    };
    fetchDistricts();
  }, []);

  // Filter districts when state changes
  useEffect(() => {
    if (inquiryFormData.state) {
      const filtered = districts.filter(district => district.state === inquiryFormData.state);
      setFilteredDistricts(filtered);
      setInquiryFormData(prev => ({ ...prev, districtId: '', city: '', zipCode: '' }));
    } else {
      setFilteredDistricts([]);
    }
  }, [inquiryFormData.state, districts]);

  // Fetch current location
  const getCurrentLocation = async (lat, lng) => {
    try {
      setIsLocationLoading(true);
      setLocationError('');
      const googleResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      if (googleResponse.data.status === 'OK') {
        const results = googleResponse.data.results[0];
        let districtName = '', stateName = '', cityName = '', zipCode = '';
        const addressComponents = results.address_components;
        for (const component of addressComponents) {
          if (component.types.includes('administrative_area_level_3')) districtName = component.long_name;
          else if (!districtName && component.types.includes('administrative_area_level_2')) districtName = component.long_name;
          if (component.types.includes('administrative_area_level_1')) stateName = component.long_name;
          if (component.types.includes('locality')) cityName = component.long_name;
          if (component.types.includes('postal_code')) zipCode = component.long_name;
        }
        setInquiryFormData(prev => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString(),
          state: stateName,
          city: cityName,
          zipCode: zipCode,
        }));
        const token = getToken();
        try {
          const districtsResponse = await axios.get(
            `${API_CONFIG.baseUrl}/${API_CONFIG.apiPrefix}/property-districts`,
            { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
          );
          const districts = districtsResponse.data;
          const matchingDistrict = districts.find(
            district => districtName.toLowerCase() === district.name?.toLowerCase() || districtName.toLowerCase() === district.city?.toLowerCase()
          );
          if (matchingDistrict) {
            setInquiryFormData(prev => ({
              ...prev,
              districtId: matchingDistrict.id,
              city: matchingDistrict.city,
              zipCode: matchingDistrict.pincode,
              state: matchingDistrict.state,
            }));
            setFilteredDistricts(districts.filter(district => district.state === matchingDistrict.state));
          } else {
            setLocationError('Could not match your location to a district. Please select manually.');
          }
        } catch (districtError) {
          console.error('District fetch for location error:', districtError.response || districtError);
          setLocationError('Error fetching district data. Please select manually.');
        }
      } else {
        setLocationError('Unable to fetch location details. Please try again or select manually.');
      }
    } catch (error) {
      console.error('Location fetch error:', error.response || error);
      setLocationError('Error fetching location. Please try again or select manually.');
    } finally {
      setIsLocationLoading(false);
    }
  };

  // Manual location fetch trigger
  const handleUseMyLocation = () => {
    const token = getToken();
    if (!token) {
      setLocationError('Please log in to access location features.');
      return;
    }
    if (navigator.geolocation) {
      setIsLocationLoading(true);
      setLocationError('');
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          getCurrentLocation(latitude, longitude);
        },
        error => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Error fetching location';
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = 'Location access denied. Please enable location permissions in your browser settings.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = 'Location information is unavailable. Please try again or select manually.';
          } else if (error.code === error.TIMEOUT) {
            errorMessage = 'Location request timed out. Please check your network or GPS settings and try again.';
          }
          setLocationError(errorMessage);
          setIsLocationLoading(false);
        },
        { timeout: 30000, enableHighAccuracy: true, maximumAge: 0 } // Increased timeout to 30s
      );
    } else {
      setLocationError('Geolocation not supported by your browser. Please select manually.');
      setIsLocationLoading(false);
    }
  };

  // Handle form input changes
  const handleInquiryChange = e => {
    const { name, value, type, checked } = e.target;
    setInquiryFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Handle district selection
  const handleDistrictSelect = e => {
    const selectedDistrictName = e.target.value;
    const district = filteredDistricts.find(d => d.name === selectedDistrictName);
    setInquiryFormData(prev => ({
      ...prev,
      districtId: district ? district.id : '',
      city: district ? district.city : '',
      zipCode: district ? district.pincode : '',
    }));
  };

  // Handle form submission
  const handleInquirySubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = getToken();
      if (!token) throw new Error('No authentication token found. Please log in.');
      if (!inquiryFormData.gdprConsent) {
        setError('Please consent to data storage before submitting.');
        setIsLoading(false);
        return;
      }
      const requiredFields = ['name', 'email', 'mobileNumber', 'propertyType', 'state', 'districtId'];
      const newErrors = {};
      for (const field of requiredFields) {
        if (!inquiryFormData[field]) newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').trim()} is required`;
      }
      if (Object.keys(newErrors).length > 0) {
        setError('Please fill all required fields.');
        setIsLoading(false);
        return;
      }
      const validInfoTypes = ['RENT', 'PURCHASE', 'SELL'];
      if (inquiryFormData.infoType && !validInfoTypes.includes(inquiryFormData.infoType)) {
        setError('Please select a valid inquiry type (Rent, Purchase, or Sell).');
        setIsLoading(false);
        return;
      }
      await axios.post(
        `${API_CONFIG.baseUrl}/${API_CONFIG.apiPrefix}/inquiries`,
        {
          name: inquiryFormData.name,
          email: inquiryFormData.email,
          mobileNumber: inquiryFormData.mobileNumber,
          infoType: inquiryFormData.infoType || 'RENT',
          propertyType: inquiryFormData.propertyType,
          maxPrice: parseFloat(inquiryFormData.maxPrice) || 0,
          bedrooms: parseInt(inquiryFormData.bedrooms) || 0,
          bathrooms: parseInt(inquiryFormData.bathrooms) || 0,
          minSize: inquiryFormData.minSize || '',
          state: inquiryFormData.state || '',
          city: inquiryFormData.city || '',
          area: inquiryFormData.area || '',
          zipCode: inquiryFormData.zipCode || '',
          districtId: parseInt(inquiryFormData.districtId) || 0,
          latitude: parseFloat(inquiryFormData.latitude) || 0,
          longitude: parseFloat(inquiryFormData.longitude) || 0,
          message: inquiryFormData.message || '',
        },
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );
      setSuccess('Inquiry submitted successfully!');
      setInquiryFormData({
        name: '',
        email: '',
        mobileNumber: '',
        infoType: '',
        propertyType: '',
        maxPrice: '',
        bedrooms: '',
        bathrooms: '',
        minSize: '',
        state: '',
        city: '',
        area: '',
        zipCode: '',
        districtId: '',
        latitude: '',
        longitude: '',
        message: '',
        gdprConsent: false,
      });
      setFilteredDistricts([]);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      const errorMessage = error.response?.data?.message || 'Please try again.';
      setError(`Failed to submit inquiry: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="inquiry-form-container">
      <h2 className="inquiry-form-title">Property Enquiry</h2>
      <p className="inquiry-form-subheading">Find your perfect property with Nearprop.</p>
      {success && <div className="inquiry-form-success">{success}</div>}
      {error && <div className="inquiry-form-error">{error}</div>}
      <form onSubmit={handleInquirySubmit} className="inquiry-form-form">
        {/* Inquiry Type & Property Type */}
        <div className="inquiry-form-row">
          <div className="inquiry-form-group">
            <label className="inquiry-form-label">Inquiry Type</label>
            <select
              name="infoType"
              value={inquiryFormData.infoType}
              onChange={handleInquiryChange}
              className="inquiry-form-select"
            >
              <option value="">Select Type</option>
              <option value="RENT">Rent</option>
              <option value="PURCHASE">Purchase</option>
              <option value="SELL">Sell</option>
            </select>
          </div>
          <div className="inquiry-form-group">
            <label className="inquiry-form-label">Property Type</label>
            <select
              name="propertyType"
              value={inquiryFormData.propertyType}
              onChange={handleInquiryChange}
              className="inquiry-form-select"
              required
            >
              <option value="">Select Property</option>
              <option value="APARTMENT">Apartment</option>
              <option value="VILLA">Villa</option>
              <option value="OFFICE">Office</option>
              <option value="HOTEL">Hotel</option>
              <option value="BANQUET_HALL">Banquet Hall</option>
            </select>
          </div>
        </div>

        {/* Name */}
        <div className="inquiry-form-group">
          <label className="inquiry-form-label">Name</label>
          <input
            type="text"
            name="name"
            value={inquiryFormData.name}
            onChange={handleInquiryChange}
            placeholder="Enter your name"
            className="inquiry-form-input"
            required
          />
        </div>

        {/* Mobile & Email */}
        <div className="inquiry-form-row">
          <div className="inquiry-form-group">
            <label className="inquiry-form-label">Mobile</label>
            <input
              type="number"
              name="mobileNumber"
              value={inquiryFormData.mobileNumber}
              onChange={handleInquiryChange}
              placeholder="Enter mobile number"
              className="inquiry-form-input"
              required
            />
          </div>
          <div className="inquiry-form-group">
            <label className="inquiry-form-label">Email</label>
            <input
              type="email"
              name="email"
              value={inquiryFormData.email}
              onChange={handleInquiryChange}
              placeholder="Enter email address"
              className="inquiry-form-input"
              required
            />
          </div>
        </div>

        {/* State & City */}
        <div className="inquiry-form-row">
          <div className="inquiry-form-group">
            <label className="inquiry-form-label">Location</label>
            
            {locationError && <div className="inquiry-form-error">{locationError}</div>}
            <select
              name="state"
              value={inquiryFormData.state}
              onChange={handleInquiryChange}
              className="inquiry-form-select"
              required
            >
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
         <div className="inquiry-form-group">
            <label className="inquiry-form-label">District</label>
            <select
              name="district"
              value={filteredDistricts.find(d => d.id === inquiryFormData.districtId)?.name || ''}
              onChange={handleDistrictSelect}
              disabled={!inquiryFormData.state}
              className="inquiry-form-select inquiry-form-select-disabled"
              required
            >
              <option value="">Select District</option>
              {filteredDistricts.map(district => (
                <option key={district.id} value={district.name}>{district.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* District & Zip */}
        <div className="inquiry-form-row">
          
           <div className="inquiry-form-group">
            <label className="inquiry-form-label">City</label>
            <input
              type="text"
              name="city"
              value={inquiryFormData.city}
              onChange={handleInquiryChange}
              placeholder="City"
              readOnly
              className="inquiry-form-input inquiry-form-input-readonly"
            />
          </div>
          <div className="inquiry-form-group">
            <label className="inquiry-form-label">Zip</label>
            <input
              type="text"
              name="zipCode"
              value={inquiryFormData.zipCode}
              onChange={handleInquiryChange}
              placeholder="Zip code"
              readOnly
              className="inquiry-form-input inquiry-form-input-readonly"
            />
          </div>
        </div>

        {/* Max Price & Min Size */}
        <div className="inquiry-form-row">
          <div className="inquiry-form-group">
            <label className="inquiry-form-label">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              value={inquiryFormData.maxPrice}
              onChange={handleInquiryChange}
              placeholder="Enter max price"
              className="inquiry-form-input"
            />
          </div>
          <div className="inquiry-form-group">
            <label className="inquiry-form-label">Min Size (sq ft)</label>
            <input
              type="text"
              name="minSize"
              value={inquiryFormData.minSize}
              onChange={handleInquiryChange}
              placeholder="Enter min size"
              className="inquiry-form-input"
            />
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="inquiry-form-row">
          <div className="inquiry-form-group">
            <label className="inquiry-form-label">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={inquiryFormData.bedrooms}
              onChange={handleInquiryChange}
              placeholder="Number of bedrooms"
              className="inquiry-form-input"
            />
          </div>
          <div className="inquiry-form-group">
            <label className="inquiry-form-label">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={inquiryFormData.bathrooms}
              onChange={handleInquiryChange}
              placeholder="Number of bathrooms"
              className="inquiry-form-input"
            />
          </div>
        </div>

        {/* Message */}
        <div className="inquiry-form-group">
          <label className="inquiry-form-label">Message</label>
          <textarea
            name="message"
            value={inquiryFormData.message}
            onChange={handleInquiryChange}
            placeholder="Enter your message"
            rows="3"
            className="inquiry-form-textarea"
          ></textarea>
        </div>

        {/* GDPR Consent */}
        <div className="inquiry-form-checkbox">
          <input
            type="checkbox"
            id="gdpr"
            name="gdprConsent"
            checked={inquiryFormData.gdprConsent}
            onChange={handleInquiryChange}
            className="inquiry-form-checkbox-input"
            required
          />
          <label htmlFor="gdpr" className="inquiry-form-label-checkbox">
            I consent to data storage and processing
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="inquiry-form-button"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit Inquiry'}
        </button>
      </form>
    </div>
  );
}

export default Enquiryform;