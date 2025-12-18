import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faShower, faCar, faHeart, faComment, faStar, faUser, faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import FilterSection from './FilterSection';
import './FilteredProperties.css';

// Base URLs for APIs
const ROOM_API_BASE = 'https://pg-hostel.nearprop.com';
const HOTEL_BANQUET_BASE = 'http://3.111.155.28:5002';
const PROPERTY_API_BASE = 'http://13.234.110.204:3003';

// Retrieve authentication token from localStorage
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

function FilteredProperties() {
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    propertyType: 'Room',
    city: '',
    state: '',
    gender: '',
    sharingType: '',
    priceRange: [0, 125000],
    title: '',
    sortBy: 'createdAt-desc',
    availability: '',
    capacity: '',
  });

  // Initialize formData from URL query parameters and fetch properties
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    console.log("this query",queryParams);
    const priceRange = queryParams.get('priceRange')?.split('-').map(Number) || [0, 125000];
    setFormData({
      propertyType: queryParams.get('propertyType') || 'Room',
      city: queryParams.get('city') || '',
      state: queryParams.get('state') || '',
      gender: queryParams.get('gender') || '',
      sharingType: queryParams.get('sharingType') || '',
      priceRange: priceRange.length === 2 && !isNaN(priceRange[0]) && !isNaN(priceRange[1]) ? priceRange : [0, 125000],
      title: queryParams.get('title') || '',
      sortBy: queryParams.get('sortBy') || 'createdAt-desc',
      availability: queryParams.get('availability') || '',
      capacity: queryParams.get('capacity') || '',
    });
    setCurrentPage(parseInt(queryParams.get('page')) || 0);
  }, [location.search]);

  // Fetch properties when formData or currentPage changes
  useEffect(() => {
    fetchProperties();
  }, [formData, currentPage]);

  // Client-side filtering for unsupported parameters
  const applyClientSideFilters = (props) => {
    let filtered = props;

    // Filter by state
    if (formData.state) {
      filtered = filtered.filter(p => 
        (p.location?.state?.toLowerCase() === formData.state.toLowerCase() || 
         p.state?.toLowerCase() === formData.state.toLowerCase() || 
         false)
      );
    }

    // Filter by city
    if (formData.city) {
      filtered = filtered.filter(p => 
        (p.location?.city?.toLowerCase() === formData.city.toLowerCase() || 
         p.city?.toLowerCase() === formData.city.toLowerCase() || 
         false)
      );
    }

    // Filter by price
    if (formData.priceRange[0] > 0 || formData.priceRange[1] < 125000) {
      filtered = filtered.filter(p => 
        (p.lowestPrice || p.price || p.pricePerEvent || 0) >= formData.priceRange[0] && 
        (p.lowestPrice || p.price || p.pricePerEvent || 0) <= formData.priceRange[1]
      );
    }

    // Filter by title
    if (formData.title) {
      filtered = filtered.filter(p => 
        (p.name?.toLowerCase().includes(formData.title.toLowerCase()) || 
         p.title?.toLowerCase().includes(formData.title.toLowerCase()) || 
         false)
      );
    }

    // Filter by availability
    if (formData.availability === 'Immediate') {
      filtered = filtered.filter(p => p.hasAvailability !== false || p.isAvailable !== false);
    }

    // Filter by capacity (Banquet Hall only)
    if (formData.capacity && formData.propertyType === 'Banquet Hall') {
      filtered = filtered.filter(p => {
        const cap = p.capacity || 0;
        if (formData.capacity === '50-100') return cap > 50 && cap <= 100;
        if (formData.capacity === '100-200') return cap > 100 && cap <= 200;
        if (formData.capacity === '200-500') return cap > 200 && cap <= 500;
        if (formData.capacity === '500+') return cap > 500;
        return true;
      });
    }

    // Apply sorting
    if (formData.sortBy === 'createdAt-desc') {
      filtered = filtered.sort((a, b) => new Date(b.createdAt || new Date()) - new Date(a.createdAt || new Date()));
    }
    if (formData.sortBy === 'createdAt-asc') {
      filtered = filtered.sort((a, b) => new Date(a.createdAt || new Date()) - new Date(b.createdAt || new Date()));
    }

    return filtered;
  };

  // Fetch properties from API
  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint;
      let queryParamsString = '';
      if (formData.propertyType === 'Room') {
        endpoint = `${ROOM_API_BASE}/api/public/properties`;
        const queryParams = new URLSearchParams({
          city: formData.city || '',
          minPrice: formData.priceRange[0],
          maxPrice: formData.priceRange[1],
          sortBy: formData.sortBy.split('-')[0],
          direction: formData.sortBy.split('-')[1]?.toUpperCase() || 'DESC',
          gender: formData.gender || '',
          sharingType: formData.sharingType || '',
          availabilityStatus: formData.availability || '',
        });
        queryParamsString = queryParams.toString();
      } else if (formData.propertyType === 'Hotel') {
        endpoint = `${HOTEL_BANQUET_BASE}/api/hotels`;
      } else if (formData.propertyType === 'Banquet Hall') {
        endpoint = `${HOTEL_BANQUET_BASE}/api/banquet-halls`;
      } else {
        throw new Error('Invalid property type');
      }

      const auth = getToken();
      const headers = auth?.token
        ? { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/json' };

      const response = await fetch(`${endpoint}${queryParamsString ? `?${queryParamsString}` : ''}`, { headers });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${formData.propertyType.toLowerCase()}s - Status: ${response.status}`);
      }

      const data = await response.json();

      let rawProperties = [];
      if (formData.propertyType === 'Room') {
        if (!data.success || !Array.isArray(data.properties)) throw new Error('Invalid Room API response');
        rawProperties = data.properties;
      } else if (formData.propertyType === 'Hotel') {
        if (!data.success || !Array.isArray(data.data?.hotels)) throw new Error('Invalid Hotel API response');
        rawProperties = data.data.hotels;
      } else if (formData.propertyType === 'Banquet Hall') {
        if (!data.success || !Array.isArray(data.data?.banquetHalls)) throw new Error('Invalid Banquet Hall API response');
        rawProperties = data.data.banquetHalls;
      }

      // Apply client-side filters
      rawProperties = applyClientSideFilters(rawProperties);

      // Handle pagination
      const itemsPerPage = 10;
      setTotalPages(Math.max(1, Math.ceil(rawProperties.length / itemsPerPage)));
      const paginatedProperties = rawProperties.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

      // Map properties to display format
      const mappedProperties = paginatedProperties.map(property => ({
        id: formData.propertyType === 'Room' ? property.id : formData.propertyType === 'Hotel' ? property.hotelId : property.banquetHallId,
        title: property.name || property.title || 'Untitled',
        address: formData.propertyType === 'Room'
          ? `${property.location?.address || 'N/A'}, ${property.location?.city || 'N/A'}, ${property.location?.state || 'N/A'}`
          : `${property.city || 'N/A'}, ${property.state || 'N/A'}`,
        bedrooms: formData.propertyType === 'Room' ? property.totalRooms || 'N/A' : 'N/A',
        bathrooms: 'N/A',
        garages: 'N/A',
        area: formData.propertyType === 'Banquet Hall'
          ? `${property.capacity || 'N/A'} capacity`
          : formData.propertyType === 'Room'
            ? `${property.totalBeds || 0} beds`
            : 'N/A',
        price: formData.propertyType === 'Room'
          ? property.lowestPrice || 0
          : formData.propertyType === 'Hotel'
            ? (property.subscriptions?.[0]?.finalPrice || 0)
            : property.pricePerEvent || 0,
        imageUrls: Array.isArray(property.images) && property.images.length > 0 ? property.images : ['https://via.placeholder.com/300'],
        type: formData.propertyType,
        status: formData.propertyType === 'Room'
          ? (property.hasAvailability ? 'AVAILABLE' : 'NOT_AVAILABLE')
          : formData.propertyType === 'Hotel'
            ? (property.isAvailable ? 'AVAILABLE' : 'NOT_AVAILABLE')
            : 'AVAILABLE',
        createdAt: property.createdAt || new Date().toISOString(),
        owner: { name: formData.propertyType === 'Room' ? (property.landlordInfo?.name || 'Unknown') : 'Unknown' },
        favorite: false,
        favoriteCount: 0,
        reelCount: 0,
        rating: formData.propertyType === 'Room' ? (property.ratingSummary?.averageRating || 'N/A') : 'N/A',
      }));

      setFilteredProperties(mappedProperties);
    } catch (err) {
      setError(`Error fetching properties: ${err.message}`);
      setFilteredProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (formData.propertyType && formData.propertyType !== 'Property Type') {
      queryParams.append('propertyType', formData.propertyType);
    }
    if (formData.city && formData.city !== 'All Cities') {
      queryParams.append('city', formData.city);
    }
    if (formData.state) {
      queryParams.append('state', formData.state);
    }
    if (formData.gender && formData.propertyType === 'Room') {
      queryParams.append('gender', formData.gender);
    }
    if (formData.sharingType && formData.propertyType === 'Room') {
      queryParams.append('sharingType', formData.sharingType);
    }
    if (formData.priceRange && Array.isArray(formData.priceRange)) {
      queryParams.append('priceRange', `${formData.priceRange[0]}-${formData.priceRange[1]}`);
    }
    if (formData.title) {
      queryParams.append('title', formData.title);
    }
    if (formData.availability) {
      queryParams.append('availability', formData.availability);
    }
    if (formData.capacity && formData.propertyType === 'Banquet Hall') {
      queryParams.append('capacity', formData.capacity);
    }
    if (formData.sortBy && formData.sortBy !== 'createdAt-desc') {
      queryParams.append('sortBy', formData.sortBy);
    }
    queryParams.append('page', '0');
    navigate(`/filtered-properties?${queryParams.toString()}`);
    setCurrentPage(0);
  };

  // Remove a filter
  const handleRemoveFilter = (key) => {
    const queryParams = new URLSearchParams(location.search);
    if (key === 'priceRange') {
      queryParams.delete('priceRange');
      setFormData((prev) => ({ ...prev, priceRange: [0, 125000] }));
    } else {
      queryParams.delete(key);
      setFormData((prev) => ({ ...prev, [key]: '' }));
    }
    navigate(`/filtered-properties?${queryParams.toString()}`);
  };

  // Change page
  const handlePageChange = (page) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('page', page);
    navigate(`/filtered-properties?${queryParams.toString()}`);
  };

  // Toggle favorite status
  const handleToggleFavorite = async (e, propertyId, isFavorite) => {
    e.preventDefault();
    e.stopPropagation();
    const auth = getToken();
    if (!auth?.token) {
      setError('Please log in to manage favorites');
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }

    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await fetch(`${PROPERTY_API_BASE}/api/public/favorites/${propertyId}`, {
        method,
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorMessages = {
          401: 'Authentication failed. Please log in again.',
          403: 'Access denied to manage favorites.',
          404: isFavorite ? 'Favorite not found.' : 'Property not found.',
          500: 'Server error. Please try again later.',
        };
        throw new Error(errorMessages[response.status] || `Failed to ${isFavorite ? 'remove' : 'add'} favorite`);
      }

      setFilteredProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId ? { ...p, favorite: !isFavorite, favoriteCount: p.favoriteCount + (isFavorite ? -1 : 1) } : p
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Navigate to property details
  const handlePropertyClick = (e, id, type) => {
    e.preventDefault();
    const auth = getToken();
    const targetPath = type === 'Room' ? `/Pgandhostel/${id}` : `/HotelAndBanquetDetails/${id}`;
    if (!auth?.token) {
      navigate('/login', { state: { from: targetPath } });
    } else {
      navigate(targetPath, { state: { type } });
    }
  };

  // Render active filter tags
  const renderActiveFilters = () => {
    const activeFilters = [];
    if (formData.propertyType !== 'Room') activeFilters.push({ key: 'propertyType', value: formData.propertyType });
    if (formData.city) activeFilters.push({ key: 'city', value: formData.city });
    if (formData.state) activeFilters.push({ key: 'state', value: formData.state });
    if (formData.gender && formData.propertyType === 'Room') activeFilters.push({ key: 'gender', value: formData.gender });
    if (formData.sharingType && formData.propertyType === 'Room') activeFilters.push({ key: 'sharingType', value: formData.sharingType });
    if (formData.priceRange[0] > 0 || formData.priceRange[1] < 125000) {
      activeFilters.push({ key: 'priceRange', value: `₹${formData.priceRange[0].toLocaleString('en-IN')} - ₹${formData.priceRange[1].toLocaleString('en-IN')}` });
    }
    if (formData.title) activeFilters.push({ key: 'title', value: formData.title });
    if (formData.availability) activeFilters.push({ key: 'availability', value: formData.availability });
    if (formData.capacity && formData.propertyType === 'Banquet Hall') activeFilters.push({ key: 'capacity', value: formData.capacity });
    if (formData.sortBy !== 'createdAt-desc') {
      activeFilters.push({ key: 'sortBy', value: formData.sortBy === 'createdAt-asc' ? 'Oldest' : 'Newest' });
    }

    return (
      <div className="abort-active-filters">
        {activeFilters.length > 0 && (
          <button
            className="abort-clear-all-btn"
            onClick={() => {
              setFormData({
                propertyType: 'Room',
                city: '',
                state: '',
                gender: '',
                sharingType: '',
                priceRange: [0, 125000],
                title: '',
                sortBy: 'createdAt-desc',
                availability: '',
                capacity: '',
              });
              navigate('/filtered-properties?page=0');
            }}
          >
            Clear All
          </button>
        )}
        <AnimatePresence>
          {activeFilters.map(({ key, value }) => (
            <motion.span
              key={key}
              className="abort-filter-tag"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {value}
              <FontAwesomeIcon
                icon={faTimes}
                className="abort-remove-filter"
                onClick={() => handleRemoveFilter(key)}
              />
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  // Render pagination controls
  const renderPagination = () => {
    const pages = Array.from({ length: totalPages }, (_, i) => i);
    return (
      <div className="abort-pagination">
        <button
          className="abort-pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        {pages.map((page) => (
          <button
            key={page}
            className={`abort-pagination-btn ${currentPage === page ? 'abort-active' : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page + 1}
          </button>
        ))}
        <button
          className="abort-pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>
    );
  };

  // Main render
  return (
    <div className="abort-filtered-properties">
      <div className="abort-container">
        <h1>Filtered Properties</h1>
        <p className="abort-subheading">Browse PGs, hostels, hotels, and banquet halls matching your search criteria.</p>
        <div className="abort-content-wrapper">
          <div className="abort-filter-sidebar">
            <FilterSection
              formData={formData}
              setFormData={setFormData}
              handleSearch={handleSearch}
            />
          </div>
          <div className="abort-main-content">
            <AnimatePresence>
              {renderActiveFilters()}
            </AnimatePresence>
            {loading && (
              <div className="abort-spinner">
                <div style={{ display: 'inline-block', width: '64px', height: '64px', border: '5px solid #f3f3f3', borderTop: '5px solid #ff3e6c', borderRadius: '50%', animation: 'abort-spin 1s linear infinite' }}></div>
              </div>
            )}
            {error && (
              <div className="abort-error">
                {error}
                <button onClick={fetchProperties}>Retry</button>
              </div>
            )}
            <div className="abort-property-grid">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={(e) => handlePropertyClick(e, property.id, property.type)}
                  >
                    <div className="abort-landing-property-card">
                      <div className="abort-landing-image-container">
                        <img
                          src={property.imageUrls[0]}
                          alt={property.title}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
                        />
                        {property.status && (
                          <span className={`abort-landing-label abort-landing-${property.status.toLowerCase().replace('_', '-')}`}>
                            {property.status.replace('_', ' ')}
                          </span>
                        )}
                        <div className="abort-landing-overlay-icons">
                          <label
                            onClick={(e) => handleToggleFavorite(e, property.id, property.favorite)}
                          >
                            <FontAwesomeIcon
                              icon={faHeart}
                              className={property.favorite ? 'abort-liked' : ''}
                            />
                            {property.favoriteCount}
                          </label>
                          <span>
                            <FontAwesomeIcon icon={faComment} />
                            {property.reelCount}
                          </span>
                          <span>
                            <FontAwesomeIcon icon={faStar} className="abort-rating-star" />
                            {property.rating}
                          </span>
                        </div>
                        <div className="abort-landing-overlay-icons-left">
                          <div>
                            {typeof property.price === 'number' ? `₹${property.price.toLocaleString('en-IN')}${property.type === 'Hotel' ? '/night' : property.type === 'Banquet Hall' ? '/event' : ''}` : 'Price on Request'}
                          </div>
                        </div>
                      </div>
                      <div className="abort-landing-property-info">
                        <h2>{property.title}</h2>
                        <div className="abort-landing-location">{property.address}</div>
                        <div className="abort-landing-details">
                          <span><FontAwesomeIcon icon={faBed} /> {property.bedrooms} {property.type === 'Room' ? 'Rooms' : property.type === 'Hotel' ? 'Beds' : 'N/A'}</span>
                          <span><FontAwesomeIcon icon={faShower} /> {property.bathrooms}</span>
                          <span><FontAwesomeIcon icon={faCar} /> {property.garages}</span>
                          <span>{property.area}</span>
                        </div>
                        <div className="abort-landing-type"><strong>{property.type}</strong></div>
                        <div className="abort-landing-footer">
                          <span><FontAwesomeIcon icon={faUser} /> {property.owner.name}</span>
                          <span><FontAwesomeIcon icon={faPaperclip} /> {new Date(property.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                !loading && (
                  <p className="abort-no-results">
                    No properties match your criteria. Try adjusting your filters or broadening your search.
                  </p>
                )
              )}
            </div>
            {totalPages > 1 && renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilteredProperties;