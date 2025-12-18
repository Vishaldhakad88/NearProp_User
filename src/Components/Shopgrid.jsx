import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './LandingPage.css';
import Apartment from '../assets/A-1.avif';
import Apartment2 from '../assets/c-2.avif';
import Apartment3 from '../assets/apartment.avif';
import Apartment4 from '../assets/studio.jpg';
import Apartment6 from '../assets/penthouse.avif';
import Apartment7 from '../assets/villa.avif';

function Shopgrid() {
  const navigate = useNavigate();

  const handlePropertyClick = (propertyType) => {
    // Map display names to database-compatible types
    const typeMap = {
      'Apartment': 'APARTMENT',
      'Plot': 'PLOT',
      'Single Family Home': 'SINGLE_FAMILY_HOME',
      'Office Space': 'OFFICE_SPACE',
      'Villa': 'VILLA',
      'Multi Family Home': 'MULTI_FAMILY_HOME',
    };
    navigate(`/properties?type=${encodeURIComponent(typeMap[propertyType] || propertyType)}`);
  };

  return (
    <>
      <section className="p-5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="shopgrid">
          <div className="shoprow">
            <div className="shopstack">
              <div className="shopcard shopcard-small shopcard-text shopcard-text" onClick={() => navigate('/residential')} style={{ cursor: 'pointer' }}>
                <div>
                  <h2 className="text-dark">Residential</h2>
                  <p className="text-dark">Explore a wide range of residential properties including apartments, single-family homes, villas, and multi-family homes. Find your perfect home tailored to your lifestyle and budget.</p>
                  <div className="shopunderline"></div>
                </div>
              </div>
              <div className="landing-image-container" style={{ position: 'relative' }} onClick={() => handlePropertyClick('Apartment')}>
                <img src={Apartment} alt="Apartment" />
                <span className="property-count text-light"><br />Apartment</span>
                <span className="more-details">MORE DETAILS</span>
              </div>
            </div>
            <div className="shopcard shopcard-large" style={{ backgroundImage: `url(${Apartment2})` }} onClick={() => handlePropertyClick('Plot')}>
              <div className="shopcontent">
                <span className="property-count text-light"><br />Plot</span>
                <p>MORE DETAILS</p>
              </div>
            </div>
            <div className="shopstack">
              <div className="shopcard shopcard-small" style={{ backgroundImage: `url(${Apartment3})` }} onClick={() => handlePropertyClick('Single Family Home')}>
                <div className="shopcontent">
                  <span className="property-count text-light"><br />Single Family Home</span>
                  <p>MORE DETAILS</p>
                </div>
              </div>
              <div className="shopcard shopcard-small" style={{ backgroundImage: `url(${Apartment4})` }} onClick={() => handlePropertyClick('Office Space')}>
                <div className="shopcontent">
                  <span className="property-count text-light"><br />Office Space</span>
                  <p>MORE DETAILS</p>
                </div>
              </div>
            </div>
          </div>
          <div className="shoprow mt-3">
            <div className="shopstack">
              <div className="shopcard shopcard-small shopcard-text shopcard-text" onClick={() => navigate('/commercialproperty')} style={{ cursor: 'pointer' }}>
                <div>
                  <h2 className="text-dark">Commercial</h2>
                  <p className="text-dark">Discover a variety of commercial properties including office spaces and retail units. Perfect for businesses looking to establish or expand their presence.</p>
                  <div className="shopunderline"></div>
                </div>
              </div>
            </div>
            <div className="shopcard shopcard-small" style={{ backgroundImage: `url(${Apartment6})` }} onClick={() => handlePropertyClick('Villa')}>
              <div className="shopcontent">
                <span className="property-count text-light"><br />Villa</span>
                <p>MORE DETAILS</p>
              </div>
            </div>
            <div className="shopcard shopcard-small" style={{ backgroundImage: `url(${Apartment7})` }} onClick={() => handlePropertyClick('Multi Family Home')}>
              <div className="shopcontent">
                <span className="property-count text-light"><br />Multi Family Home</span>
                <p>MORE DETAILS</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Shopgrid;