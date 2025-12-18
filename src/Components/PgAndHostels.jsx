
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
  faRupeeSign,
  faRulerCombined,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import axios from 'axios';

const API_CONFIG = {
  baseUrl: 'https://pg-hostel.nearprop.com',
  apiPrefix: 'api/public',
};

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400';

function PgAndHostels() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { baseUrl, apiPrefix } = API_CONFIG;

  const getToken = () => {
    try {
      const authData = localStorage.getItem('authData');
      if (!authData) return null;
      const parsedData = JSON.parse(authData);
      return { token: parsedData.token || null, userId: parsedData.userId || null };
    } catch (err) {
      console.error('Error parsing authData:', err.message);
      return null;
    }
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const auth = getToken();
        const headers = auth?.token ? { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
        const response = await axios.get(`${baseUrl}/${apiPrefix}/properties`, { headers });
        const data = response.data;

        if (data.success) {
          const transformedProperties = data.properties.map(property => ({
            id: property.id,
            title: property.name || 'Untitled PG/Hostel',
            type: property.type || 'PG/Hostel',
            price: property.pricing?.beds?.min ? `₹${Number(property.pricing.beds.min).toLocaleString('en-IN')}/mo` : 'Price on request',
            area: 'N/A',
            address: property.location?.address || 'Location not specified',
            city: property.location?.city || 'N/A',
            owner: { name: property.landlord?.name || 'Unknown Agent' },
            imageUrls: property.images?.length > 0 ? property.images : [PLACEHOLDER_IMAGE],
            favorite: false,
            approved: true,
            active: property.availability?.hasAvailableRooms || property.availability?.hasAvailableBeds,
            status: (property.availability?.hasAvailableRooms || property.availability?.hasAvailableBeds) ? 'Active' : 'Expired',
          }));
          setProperties(transformedProperties);
        } else {
          throw new Error('API request unsuccessful');
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err.message || 'Failed to fetch properties');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleToggleFavorite = async (e, id, isFavorite) => {
    e.preventDefault();
    e.stopPropagation();
    const auth = getToken();
    if (!auth?.token) {
      setError('Please log in to manage favorites');
      navigate('/login', { state: { from: `/Pgandhostel/${id}` } });
      return;
    }

    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await axios({
        method,
        url: `${baseUrl}/${apiPrefix}/favorites/${id}`,
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status >= 200 && response.status < 300) {
        setProperties(properties.map(p =>
          p.id === id ? { ...p, favorite: !isFavorite } : p
        ));
      } else {
        throw new Error(`Failed to toggle favorite: ${response.status}`);
      }
    } catch (err) {
      console.error('Toggle Favorite error:', err.message);
      setError(err.message);
    }
  };

  const getAvailabilityStatus = (property) => {
    return property.active ? 'Available' : 'Unavailable';
  };

  const getTags = (property) => {
    const tags = [];
    if (property.approved) tags.push('Aadhaar Verified');
    if (property.active) tags.push('Subscription Active');
    else tags.push('Subscription Expired');
    if (property.status === 'SOLD') tags.push('Sold');
    if (!property.approved) tags.push('Not Aadhaar Verified');
    return tags;
  };

  return (
    <div style={{ padding: '40px 20px', background: '#f2f4f8' }}>
      <h2 style={{ textAlign: 'center', fontSize: 32, color: 'darkcyan' }}>
        Discover PG and Hostel
      </h2>
      <p style={{ textAlign: 'center', maxWidth: 800, margin: '10px auto' }}>
        Explore our curated selection of affordable PGs and hostels, ideal for students and working professionals seeking comfort and convenience.
      </p>
      {isLoading && <p style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Loading properties...</p>}
      {error && <p style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Error: {error}</p>}
      {!isLoading && !error && properties.length === 0 && <p style={{ textAlign: 'center', padding: '20px' }}>No properties found.</p>}
      {!isLoading && !error && properties.length > 0 && (
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
          {properties.map((property) => {
            const availabilityStatus = getAvailabilityStatus(property);
            const tags = getTags(property);
            return (
              <SwiperSlide key={property.id}>
                <Link
                  to={`/Pgandhostel/${property.id}`}
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
                            : `${API_CONFIG.baseUrl}${property.imageUrls[0]}`
                        }
                        alt={property.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                      />
                      {/* Availability Status - Top Left */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          background: availabilityStatus === 'Available' ? '#28a745' : '#dc3545',
                          color: '#fff',
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 'bold',
                          zIndex: 10,
                        }}
                      >
                        {availabilityStatus}
                      </div>
                      {/* Price box - Bottom Left */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 10,
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
                      {/* Favorite Icon - Top Right */}
                      {/* <div
                        style={{
                          position: 'absolute',
                          top: 10,
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
                      </div> */}
                    </div>

                    {/* Details */}
                    <div style={{ padding: 16, flex: 1 }}>
                      <h3 style={{ fontSize: 20, fontWeight: '600', marginBottom: 6 }}>
                        {property.title}
                      </h3>
                      <p style={{ fontSize: 14, color: '#777', marginBottom: 12 }}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} /> {property.address}, {property.city}
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

                      <div
                        style={{
                          marginTop: 12,
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 6,
                        }}
                      >
                        {tags.map((tag, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: '#eef3f7',
                              padding: '4px 10px',
                              borderRadius: 6,
                              fontSize: 12,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
}

export default PgAndHostels;
