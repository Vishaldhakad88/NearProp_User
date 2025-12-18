// SimilarListings.js (Cards)
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightAndDownLeftFromCenter, faHeart, faSquarePlus, faBed, faShower, faCar, faUser, faPaperclip } from '@fortawesome/free-solid-svg-icons';

const SimilarListings = ({ listings, images, property }) => (
  <div className="card-grid">
    {listings.map((listing, index) => (
      <div key={index} className="landing-property-card">
        <div className="landing-image-container">
          <img src={listing.image || images[0]} alt="Similar" />
          <span className="landing-label landing-featured">{listing.featured ? 'FEATURED' : ''}</span>
          <span className="landing-label landing-for-sale">{listing.status === 'AVAILABLE' ? 'FOR RENT' : listing.status}</span>
          <div className="landing-overlay-icons">
            <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
            <FontAwesomeIcon icon={faHeart} />
            <FontAwesomeIcon icon={faSquarePlus} />
          </div>
          <div className="landing-overlay-icons-left">₹{listing.price}/mo</div>
        </div>
        <div className="landing-property-info">
          <h2>{listing.title}</h2>
          <div className="landing-location">{property.address}</div>
          <div className="landing-details">
            <span><FontAwesomeIcon icon={faBed} /> {listing.beds}</span>
            <span><FontAwesomeIcon icon={faShower} /> {listing.bathrooms}</span>
            <span><FontAwesomeIcon icon={faCar} /> {listing.parking}</span>
          </div>
          <div className="landing-type">{listing.type}</div>
          <div className="landing-footer">
            <span><FontAwesomeIcon icon={faUser} /> {listing.agent?.name}</span>
            <span><FontAwesomeIcon icon={faPaperclip} /> {listing.listedDate}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default SimilarListings;