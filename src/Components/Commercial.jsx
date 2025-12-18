import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faCar, faGear, faHeart, faPaperclip, faShower, faSquarePlus, faUpRightAndDownLeftFromCenter, faUser } from '@fortawesome/free-solid-svg-icons';
import './Residential.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const API_CONFIG = {
  baseUrl: 'https://api.nearprop.com',
  apiPrefix: 'api',
};

function Commercial() {
  const [dropdown1Open, setDropdown1Open] = useState(false);
  const [dropdown2Open, setDropdown2Open] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCategorySelect = (value) => {
    setSelectedCategory(value);
    setDropdown1Open(false);
  };

  const handleCitySelect = (value) => {
    setSelectedCity(value);
    setDropdown2Open(false);
  };

  // Retrieve authData from localStorage
  const getAuthData = () => {
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

  // Retrieve token from authData
  const getToken = () => {
    const authData = getAuthData();
    const token = authData ? authData.token : null;
    console.log('Retrieved token:', token ? 'Valid token' : 'No token found');
    return token;
  };

  // Fetch properties from API and filter for commercial
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = getToken();
        if (!token) {
          console.log('No token found, redirecting to login');
          navigate('/login');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        };

        console.log('Fetching properties with token:', token);
        const response = await axios.get(
          `${API_CONFIG.baseUrl}/${API_CONFIG.apiPrefix}/properties?latitude=28.6139&longitude=77.2090&radius=5000`,
          config
        );

        console.log('API Response:', response.data);

        // Filter for commercial properties
        const commercialTypes = ['Commercial', 'Office', 'Shop'];
        const commercialProperties = (response.data.data || []).filter(property =>
          commercialTypes.includes(property.propertyType)
        );
        console.log('Filtered Commercial Properties:', commercialProperties);
        setProperties(commercialProperties);
        setLoading(false);
      } catch (err) {
        const errorMessage = err.response
          ? err.response.status === 403
            ? 'Access denied: Invalid token or insufficient permissions. Redirecting to login.'
            : err.response.status === 401
            ? 'Unauthorized: Session expired. Redirecting to login.'
            : `${err.response.data.message || err.response.statusText} (Status: ${err.response.status})`
          : err.request
          ? 'No response from server. Check network or server status.'
          : err.message;
        console.error('Fetch error:', err, err.response?.data);
        setError(errorMessage);
        setLoading(false);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          console.log('Authentication error, clearing authData and redirecting to login');
          localStorage.removeItem('authData');
          navigate('/login');
        }
      }
    };

    fetchProperties();
  }, [navigate]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.nearp-dropdown')) {
        setDropdown1Open(false);
        setDropdown2Open(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <div className="modern-breadcrumb">
        <div className="modern-container">
          {/* <span className="modern-back"><i className="fas fa-angle-left"></i> Back to Search <i className="fas fa-home"></i> /Home/ Grid Default</span> */}
        </div>
      </div>

      <div className="commercial-title">
        Commercial
      </div>

      <div className="blog-main-container">
        <div className="blog-left-section card-wrapper">
          {loading && <p>Loading properties...</p>}
          {error && (
            <p>
              {error.includes('401') || error.includes('403') ? (
                <>
                  Error: {error} <a href="/login">Click here to log in with an appropriate account</a>
                </>
              ) : (
                `Error: ${error}`
              )}
            </p>
          )}
          {!loading && !error && properties.length === 0 && <p>No commercial properties found.</p>}
          {properties.map((property) => (
            <Link to={`/propertysell/${property.id}`} className="" key={property.id}>
              <div className="landing-property-card">
                <div className="landing-image-container">
                  <img 
                    src={property.image ? `${API_CONFIG.baseUrl}${property.image}` : 'https://img.freepik.com/free-photo/modern-office-building_23-2148838468.jpg'} 
                    alt={property.title || 'Property'} 
                    onError={(e) => {
                      console.log(`Failed to load image for property ${property.id}: ${property.image}`);
                      e.target.src = 'https://img.freepik.com/free-photo/modern-office-building_23-2148838468.jpg';
                    }}
                  />
                  <span className="landing-label landing-featured">FEATURED</span>
                  <span className="landing-label landing-for-sale">{property.status || 'FOR SALE'}</span>
                  <div className="landing-overlay-icons">
                    <FontAwesomeIcon className='landing-overlay-icons-i' icon={faUpRightAndDownLeftFromCenter} />
                    <FontAwesomeIcon className='landing-overlay-icons-i' icon={faHeart} />
                    <FontAwesomeIcon className='landing-overlay-icons-i' icon={faSquarePlus} />
                  </div>
                  <div className="landing-overlay-icons-left">
                    <div className="">
                      ${property.price?.toLocaleString() || 'N/A'}<br />
                      <span className="">{property.pricePerSqFt ? `$${property.pricePerSqFt}/Sq Ft` : 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="landing-property-info">
                  <h2 className="landing">{property.title || 'Property'}</h2>
                  <div className="landing-location">{property.location || 'Unknown Location'}</div>
                  <div className="landing-details">
                    <span><FontAwesomeIcon icon={faBed} /> {property.bedrooms || 'N/A'}</span>
                    <span><FontAwesomeIcon icon={faShower} /> {property.bathrooms || 'N/A'}</span>
                    <span><FontAwesomeIcon icon={faCar} /> {property.parking || 'N/A'}</span>
                    <span>{property.area || 'N/A'} Sq Ft</span>
                  </div>
                  <div className="landing-type text-dark"><strong>{property.propertyType || 'COMMERCIAL'}</strong></div>
                  <div className="landing-footer">
                    <span><FontAwesomeIcon icon={faUser} /> {property.agentName || 'Unknown Agent'}</span>
                    <span><FontAwesomeIcon icon={faPaperclip} /> {property.listedDate || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="residential-blog-right-sidebar">
          <aside className="residential">
            <div className="residential featured-listing">
              <h3>Nearprop Trusted</h3>
              <div className="residential featured-card">
                <img src="https://img.freepik.com/free-photo/modern-office-building_23-2148838468.jpg" alt="Featured" />
                <p>$1,500,000</p>
                <p>8205 Pom Ave, Miami, FL 33176</p>
              </div>
            </div>
            <div className="residential featured-listing">
              <h3>Featured Listings</h3>
              <div className="residential featured-card">
                <img src="https://img.freepik.com/free-photo/modern-office-building_23-2148838468.jpg" alt="Featured" />
                <p>$1,500,000</p>
                <p>8205 Pom Ave, Miami, FL 33176</p>
              </div>
            </div>
            <div className="residential featured-listing">
              <h3>Featured Listings</h3>
              <div className="residential featured-card">
                <img src="https://img.freepik.com/free-photo/modern-office-building_23-2148838468.jpg" alt="Featured" />
                <p>$1,500,000</p>
                <p>8205 Pom Ave, Miami, FL 33176</p>
              </div>
            </div>
            <div className="residential featured-listing">
              <h3>Featured Listings</h3>
              <div className="residential featured-card">
                <img src="https://img.freepik.com/free-photo/modern-office-building_23-2148838468.jpg" alt="Featured" />
                <p>$1,500,000</p>
                <p>8205 Pom Ave, Miami, FL 33176</p>
              </div>
            </div>
            <div className="residential featured-listing">
              <h3>Featured Listings</h3>
              <div className="residential featured-card">
                <img src="https://img.freepik.com/free-photo/modern-office-building_23-2148838468.jpg" alt="Featured" />
                <p>$1,500,000</p>
                <p>8205 Pom Ave, Miami, FL 33176</p>
              </div>
            </div>

            <div className="residential property-type">
              <h3>Property Type</h3>
              <ul>
                <li>Commercial</li>
                <li>Office</li>
                <li>Shop</li>
                <li>Residential</li>
                <li>Apartment</li>
                <li>Single Family Home</li>
                <li>Studio</li>
                <li>Villa</li>
              </ul>
            </div>

            <div className="residential cities">
              <h3>Cities</h3>
              <ul>
                <li>Miami</li>
                <li>Los Angeles</li>
                <li>Chicago</li>
                <li>New York</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

export default Commercial;