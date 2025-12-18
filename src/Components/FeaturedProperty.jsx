import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faHeart as faHeartSolid,
  faHeart as faHeartRegular,
  faHome,
  faRulerCombined,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Local fallback images
import Apartment from '../assets/A-1.avif';
import Apartment2 from '../assets/c-2.avif';
import Apartment3 from '../assets/apartment.avif';
import Apartment4 from '../assets/studio.jpg';
import Apartment6 from '../assets/penthouse.avif';
import Apartment7 from '../assets/villa.avif';

const fallbackImages = [Apartment, Apartment2, Apartment3, Apartment4, Apartment6, Apartment7];

const API_CONFIG = {
  baseUrl: 'https://api.nearprop.com',
  apiPrefix: 'api',
};

// Get auth token and user ID from localStorage
const getToken = () => {
  try {
    const authData = localStorage.getItem('authData');
    if (!authData) {
      console.log('No authData found in localStorage');
      return null;
    }
    const parsedData = JSON.parse(authData);
    return { token: parsedData.token || null, userId: parsedData.userId || null };
  } catch (err) {
    console.error('Error parsing authData:', err.message);
    return null;
  }
};

// Get user location from localStorage
const getUserLocation = () => {
  try {
    const locationData = localStorage.getItem('myLocation');
    if (!locationData) {
      console.log('No myLocation found in localStorage');
      return null;
    }
    const parsedLocation = JSON.parse(locationData);
    if (!parsedLocation.latitude || !parsedLocation.longitude) {
      console.error('Invalid myLocation data: missing latitude or longitude');
      return null;
    }
    console.log('User location retrieved:', parsedLocation);
    return {
      latitude: parsedLocation.latitude,
      longitude: parsedLocation.longitude,
    };
  } catch (err) {
    console.error('Error parsing myLocation:', err.message);
    return null;
  }
};

// Calculate distance between two coordinates
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function FeaturedProperty() {
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { baseUrl, apiPrefix } = API_CONFIG;

  // Check favorite status for a property
  const checkFavoriteStatus = async (propertyId, token) => {
    try {
      const response = await fetch(`${baseUrl}/${apiPrefix}/favorites/${propertyId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) return false;

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) return false;

      const data = await response.json();
      return data.isFavorite || data.favorite || false;
    } catch (err) {
      console.error('Check Favorite error:', err.message);
      return false;
    }
  };

  // Fetch featured properties
  const fetchProperties = async () => {
    try {
      setLoadingFeatured(true);
      setError(null);

      const auth = getToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(auth?.token && { Authorization: `Bearer ${auth.token}` }),
      };

      const endpoint = `${baseUrl}/${apiPrefix}/properties/featured`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(endpoint, {
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error: ${response.status} - ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format: Expected JSON');
      }

      const data = await response.json();
      let propertiesData = data.content || data.data || data || [];

      if (!Array.isArray(propertiesData)) {
        console.warn('Properties data is not an array:', propertiesData);
        propertiesData = [];
      }

      // Get user location
      const userLocation = getUserLocation();

      const propertiesWithFavorites = await Promise.all(
        propertiesData
          .filter((property) => property.active === true)
          .map(async (property) => {
            const distance = userLocation && property.latitude && property.longitude
              ? getDistanceFromLatLonInKm(
                  userLocation.latitude,
                  userLocation.longitude,
                  property.latitude,
                  property.longitude
                )
              : null;

            return {
              id: property.id || property._id,
              title: property.title || 'Untitled Property',
              type: property.type || 'Property',
              status: property.status || 'FOR_SALE', // Use status instead of listingType
              price: property.price
                ? `₹${property.price.toLocaleString('en-IN')}`
                : 'Price on Request',
              area: property.area
                ? `${property.area} ${property.sizePostfix || 'sq.ft.'}`
                : 'N/A',
              address: property.address || 'Location not specified',
              city: property.city || 'N/A',
              latitude: property.latitude || null,
              longitude: property.longitude || null,
              owner: { name: property.owner?.name || 'Unknown Agent' },
              imageUrls:
                property.imageUrls && property.imageUrls.length > 0
                  ? property.imageUrls
                  : [fallbackImages[0]],
              featured: property.featured || false,
              favorite: auth?.token
                ? await checkFavoriteStatus(property.id || property._id, auth.token)
                : false,
              approved: property.approved || false,
              active: property.active || false,
              distance: distance,
            };
          })
      );

      // Sort by distance if user location is available (nearest first)
      let sortedProperties = propertiesWithFavorites;
      if (userLocation) {
        sortedProperties = propertiesWithFavorites.sort((a, b) => {
          if (a.distance === null && b.distance === null) return 0;
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });
        console.log('Sorted featured properties by distance:', sortedProperties.map(p => ({ title: p.title, distance: p.distance })));
      }

      setFeaturedProperties(sortedProperties);
    } catch (err) {
      console.error('Fetch featured properties error:', err.message);
      let errorMsg = 'Failed to load properties. Please try again later.';
      if (err.name === 'AbortError') {
        errorMsg = 'Request timed out. Please check your connection and try again.';
      } else if (err.message.includes('HTTP error')) {
        errorMsg = `Server error: ${err.message}`;
      } else if (err.message.includes('fetch')) {
        errorMsg = 'Network error: Unable to connect to the server. Please check your internet connection.';
      }
      setError(errorMsg);
      setFeaturedProperties([]);
    } finally {
      setLoadingFeatured(false);
    }
  };

  // Toggle favorite status
  const handleToggleFavorite = async (e, propertyId, isFavorite) => {
    e.preventDefault();
    e.stopPropagation();
    const auth = getToken();
    if (!auth?.token) {
      setError('Please log in to manage favorites');
      navigate('/login', { state: { from: `/propertySell/${propertyId}` } });
      return;
    }

    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await fetch(`${baseUrl}/${apiPrefix}/favorites/${propertyId}`, {
        method,
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: auth.userId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle favorite: ${response.status}`);
      }

      setFeaturedProperties((prev) =>
        prev.map((property) =>
          property.id === propertyId ? { ...property, favorite: !isFavorite } : property
        )
      );
    } catch (err) {
      console.error('Toggle Favorite error:', err.message);
      setError(err.message);
    }
  };

  // Determine property status (kept for potential future use, not displayed)
  const getStatus = (property) => {
    if (!property.approved) return 'Pending Verification';
    if (!property.active) return 'Expired';
    if (property.status === 'SOLD') return 'Sold';
    return 'Active';
  };

  // Generate tags for property (kept for potential future use, not displayed)
  const getTags = (property) => {
    const tags = [];
    if (property.approved) tags.push('Aadhaar Verified');
    if (property.active) tags.push('Subscription Active');
    else tags.push('Subscription Expired');
    if (property.status === 'SOLD') tags.push('Sold');
    if (!property.approved) tags.push('Not Aadhaar Verified');
    if (property.featured) tags.push('Featured');
    return tags;
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Check if user location is available
  const userLocation = getUserLocation();

  return (
    <div style={{  background: '#f2f4f8' }} className=" myclass">
      <h2 style={{ textAlign: 'center', fontSize: 32, color: 'darkcyan' }}>
        Discover Our Featured Listings
      </h2>
      <p style={{ textAlign: 'center', maxWidth: 800, margin: '10px auto' }}>
        Explore our curated selection of premium properties, showcasing the best
        in residential and commercial real estate.
      </p>
      {loadingFeatured && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div
            style={{
              border: '4px solid #f3f3f3',
              borderTop: '4px solid darkcyan',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite',
              margin: 'auto',
            }}
          ></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      {error && (
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          <p>{error}</p>
          <button
            onClick={fetchProperties}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: 'darkcyan',
              backgroundColor: '#fff',
              border: '2px solid darkcyan',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}
      {!loadingFeatured && !error && (
        <>
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            loop
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 15 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1200: { slidesPerView: 3, spaceBetween: 25 },
            }}
            style={{ padding: '40px 0' }}
          >
            {featuredProperties.map((property) => {
              return (
                <SwiperSlide key={property.id}>
                  <Link
                    to={`/propertySell/${property.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div
                      style={{
                        background: '#fff',
                        borderRadius: 12,
                        overflow: 'hidden',
                        boxShadow: '0 6px 25px rgba(0,0,0,0.12)',
                        cursor: 'pointer',
                        position: 'relative',
                        minHeight: 450,
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      {/* Image */}
                      <div style={{ position: 'relative', height: 260 }}>
                        <img
                          src={
                            property.imageUrls[0].startsWith('http')
                              ? property.imageUrls[0]
                              : `${baseUrl}${property.imageUrls[0]}`
                          }
                          alt={property.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            e.target.src = fallbackImages[0];
                          }}
                        />
                        {/* Status (For Rent or For Sale) - Top Right */}
                        <div
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            background: property.status === 'FOR_RENT' ? '#28a745' : '#007bff',
                            color: '#fff',
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 'bold',
                            zIndex: 10,
                          }}
                        >
                          {property.status === 'FOR_RENT' ? 'For Rent' : 'For Sale'}
                        </div>
                        {/* Favorite Icon - Below Status */}
                        <div
                          style={{
                            position: 'absolute',
                            top: 34, // Positioned below the status tag
                            right: 10,
                            cursor: 'pointer',
                            zIndex: 10,
                          }}
                          onClick={(e) => handleToggleFavorite(e, property.id, property.favorite)}
                        >
                          <FontAwesomeIcon
                            icon={property.favorite ? faHeartSolid : faHeartRegular}
                            style={{ color: property.favorite ? 'red' : 'white' }}
                          />
                        </div>
                        {/* Price box - Bottom Left */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 30,
                            left: 10,
                            background: 'rgba(0,0,0,0.7)',
                            color: '#fff',
                            padding: '6px 12px',
                            borderRadius: 6,
                            fontWeight: 'bold',
                          }}
                        >
                          {property.price}
                        </div>
                      </div>

                      {/* Details */}
                      <div style={{ padding: 16, flex: 1 }}>
                        <h3 style={{ fontSize: 20, fontWeight: '600', marginBottom: 6 }}>
                          {property.title}
                        </h3>
                        <p style={{ fontSize: 14, color: '#777', marginBottom: 12 }}>
                          <FontAwesomeIcon icon={faMapMarkerAlt} /> {property.address}, {property.city}
                          {property.distance !== null && (
                            <span style={{ fontWeight: 'bold', color: '#0e7490' }}>
                              {' - '}{property.distance?.toFixed(2)} km away
                            </span>
                          )}
                        </p>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 8,
                            fontSize: 13,
                            color: '#444',
                          }}
                        >
                          <span>
                            <FontAwesomeIcon icon={faHome} /> {property.type}
                          </span>
                          <span>
                            <FontAwesomeIcon icon={faUser} /> {property.owner.name}
                          </span>
                          <span>
                            <FontAwesomeIcon icon={faRulerCombined} /> {property.area}
                          </span>
                          <span>
                            <FontAwesomeIcon icon={faMapMarkerAlt} /> {property.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
          {/* Custom Navigation Styles */}
          <style>{`
            .swiper-button-prev,
            .swiper-button-next {
              width: 30px;
              height: 30px;
              background-color: #fff;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
              color: darkcyan;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .swiper-button-prev:hover,
            .swiper-button-next:hover {
              background-color: darkcyan;
              color: #fff;
              transform: scale(1.1);
            }
            .swiper-button-prev::after,
            .swiper-button-next::after {
              font-size: 14px;
              font-weight: bold;
            }
            .swiper-button-prev {
              left: 10px;
            }
            .swiper-button-next {
              right: 10px;
            }
            .swiper-button-disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
          `}</style>
          {/* Show All Properties Button */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            <button
              onClick={() => navigate('/properties')}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'darkcyan',
                backgroundColor: '#fff',
                border: '2px solid darkcyan',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease, color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'darkcyan';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.color = 'darkcyan';
              }}
            >
              Show All Properties
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default FeaturedProperty;