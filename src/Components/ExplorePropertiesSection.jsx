
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faShower, faCar, faUser, faPaperclip, faHeart, faComment, faStar } from '@fortawesome/free-solid-svg-icons';

const ExplorePropertiesSection = ({ allProperties, handleToggleFavorite }) => {
  return (
    <section className="city-section">
      <h2>Explore Properties</h2>
      <p className="subheading">Discover vibrant neighborhoods and top-rated properties where lifestyle meets opportunity. From bustling urban centers to peaceful suburbs, find the perfect place to call home.</p>
      <div className="property-grid">
        {allProperties.slice(0, 6).map((property, index) => (
          <Link to={`/propertySell/${property.id || index}`} key={property.id || index} className="property-card-link">
            <div className="landing-property-card">
              <div className="landing-image-container">
                <img
                  src={property.imageUrls && property.imageUrls[0] ? property.imageUrls[0] : ''}
                  alt={property.title || 'Property'}
                />
                {property.featured && <span className="landing-label landing-featured">FEATURED</span>}
                {property.status && (
                  <span className={`landing-label landing-${property.status.toLowerCase().replace('_', '-')}`}>
                    {property.status.replace('_', ' ')}
                  </span>
                )}
                <div className="landing-overlay-icons">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggleFavorite(e, property.id || index, property.favorite);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={property.favorite ? 'liked' : ''}
                    />
                    {property.favoriteCount || property.likes || 0}
                  </button>
                  <span>
                    <FontAwesomeIcon icon={faComment} />
                    {property.reelCount || property.reviews || 0}
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faStar} className="rating-star" />
                    {property.rating || 'N/A'}
                  </span>
                </div>
                <div className="landing-overlay-icons-left">
                  <div>
                    {typeof property.price === 'number' ? `₹${property.price.toLocaleString('en-IN')}` : property.price || 'Price on Request'}
                    <br />
                    <span>{property.area && property.price ? `₹${Math.round(property.price / property.area)}/Sq Ft` : 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div className="landing-property-info">
                <h2 className="landing">{property.title || 'Untitled Property'}</h2>
                <div className="landing-location">{property.address || property.location || 'Location not specified'}</div>
                <div className="landing-details">
                  <span><FontAwesomeIcon icon={faBed} /> {property.bedrooms || property.beds || 'N/A'}</span>
                  <span><FontAwesomeIcon icon={faShower} /> {property.bathrooms || property.baths || 'N/A'}</span>
                  <span><FontAwesomeIcon icon={faCar} /> {property.garages || property.parking || 'N/A'}</span>
                  <span>{property.area ? `${property.area} ${property.sizePostfix || 'sq.ft.'}` : 'N/A'}</span>
                </div>
                <div className="landing-type text-dark"><strong>{property.type || 'Property'}</strong></div>
                <div className="landing-footer">
                  <span><FontAwesomeIcon icon={faUser} /> {property.owner?.name || property.agent || 'Unknown Agent'}</span>
                  <span><FontAwesomeIcon icon={faPaperclip} /> {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : property.posted || 'N/A'}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="explore-more">
        <Link to="/properties" className="explore-more-btn">Explore More</Link>
      </div>
    </section>
  );
};

export default ExplorePropertiesSection;
