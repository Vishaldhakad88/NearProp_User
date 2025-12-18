import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faBuilding,
  faBuildingColumns,
  faHotel,
  faStar,
  faBed,
} from '@fortawesome/free-solid-svg-icons';
import './Demopage.css';

const Demopage = () => {
  const [formData, setFormData] = useState({
    propertyType: '',
    city: '',
    bedrooms: '',
    priceRange: '',
  });
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();

  const categories = [
    { key: 'rent', label: 'For Rent', icon: faHouse, color: '#2ecc71', path: '/forrent' },
    { key: 'sale', label: 'For Sale', icon: faHouse, color: '#3498db', path: '/forsell' },
    { key: 'apartment', label: 'Apartment', icon: faBuilding, color: '#9b59b6', path: '/apartment' },
    { key: 'plot', label: 'Plot', icon: faBuildingColumns, color: '#e74c3c', path: '/plot' },
    { key: 'hotel', label: 'Hotel', icon: faHotel, color: '#f1c40f', path: '/hotel' },
    { key: 'banquet', label: 'Banquet', icon: faStar, color: '#e67e22', path: '/banquet' },
    { key: 'pg', label: 'PG', icon: faBed, color: '#8e44ad', path: '/pg' },
    { key: 'hostel', label: 'Hostel', icon: faBed, color: '#16a085', path: '/hostel' },
  ];

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await new Promise((resolve) =>
          setTimeout(() => resolve(['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata']), 500)
        );
        setCities(response);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('Searching with:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="property-filter-container">
      {/* Navigation Tabs */}
      <div className="nav-tabs">
        {categories.map((category) => (
          <Link
            key={category.key}
            to={category.path}
            className={`nav-tab ${location.pathname === category.path ? 'active' : ''}`}
            style={{ color: category.color }}
            onClick={() => console.log(`Navigating to ${category.path}`)}
          >
            <FontAwesomeIcon icon={category.icon} style={{ marginRight: '8px' }} />
            {category.label}
          </Link>
        ))}
      </div>

      {/* Search Filters Form */}
      <form className="filters-form" onSubmit={handleSearch}>
        <div className="form-group">
          <label className="form-label">LOOKING FOR</label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleFormChange}
            disabled={isLoading}
          >
            <option value="">Select Property</option>
            <option value="APARTMENT">Apartment</option>
            <option value="VILLA">Villa</option>
            <option value="OFFICE">Office</option>
            <option value="HOTEL">Hotel</option>
            <option value="BANQUET">Banquet</option>
            <option value="CONDO">Condo</option>
            <option value="MULTI_FAMILY_HOME">Multi Family Home</option>
            <option value="SINGLE_FAMILY_HOME">Single Family Home</option>
            <option value="STUDIO">Studio</option>
            <option value="SHOP">Shop</option>
            <option value="PG">PG</option>
            <option value="HOSTEL">Hostel</option>
            <option value="PLOT">Plot</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">CITY</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleFormChange}
            disabled={isLoading}
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">PROPERTY SIZE</label>
          <select
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleFormChange}
            disabled={isLoading}
          >
            <option value="">Bedrooms</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4+ BHK</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">PRICE RANGE</label>
          <select
            name="priceRange"
            value={formData.priceRange}
            onChange={handleFormChange}
            disabled={isLoading}
          >
            <option value="">Select Price Range</option>
            <option value="10000-20000">Rs 10K-20K</option>
            <option value="30000-40000">Rs 30K-40K</option>
            <option value="50000-100000">Rs 50K-100K</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">&nbsp;</label>
          <button className="search-btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Icon Grid */}
      <div className="icon-grid">
        {categories.map((category) => (
          <div
            key={category.key}
            className={`icon-card ${category.key}`}
            style={{ backgroundColor: category.color }}
          >
            <FontAwesomeIcon icon={category.icon} style={{ marginRight: '8px' }} />
            {category.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Demopage;