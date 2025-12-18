import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import Apartment from '../../src/assets/A-1.avif';
import Apartment2 from '../../src/assets/c-2.avif';
import Apartment3 from '../../src/assets/apartment.avif';
import Apartment4 from '../../src/assets/studio.jpg';
import Apartment6 from '../../src/assets/penthouse.avif';
import Apartment7 from '../../src/assets/villa.avif';

const ShopSection = () => {
  return (
    <div className=''>
      <section className="p-5" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="shopgrid">
          <div className="shoprow">
            <div className="shopstack">
              <div className="shopcard shopcard-small shopcard-text">
                <div>
                  <h2 className='text-dark'>Residential</h2>
                  <p className='text-dark'>
                    Explore a wide range of homes, from cozy apartments to spacious villas,<br />
                    designed to suit your lifestyle and budget.<br />
                    Find your perfect living space today.
                  </p>
                  <div className="shopunderline"></div>
                </div>
              </div>
              <div className="landing-image-container" style={{ position: 'relative' }}>
                <img src={Apartment} alt="Property" />
                <span className="property-count text-light">23 Properties <br />Apartment</span>
                <span className="more-details">MORE DETAILS</span>
                <span className="play-icon">
                  <FontAwesomeIcon icon={faPlay} />
                </span>
              </div>
            </div>
            <div className="shopcard shopcard-large" style={{ backgroundImage: `url(${Apartment2})` }}>
              <div className="shopcontent">
                <span className="property-count text-light">7 Properties <br />Studio</span>
                <p>MORE DETAILS</p>
                <span className="play-icon">
                  <FontAwesomeIcon icon={faPlay} />
                </span>
              </div>
            </div>
            <div className="shopstack">
              <div className="shopcard shopcard-small" style={{ backgroundImage: `url(${Apartment3})` }}>
                <div className="shopcontent">
                  <span className="property-count text-light">12 Properties <br />Single Family Home</span>
                  <p>MORE DETAILS</p>
                  <span className="play-icon">
                    <FontAwesomeIcon icon={faPlay} />
                  </span>
                </div>
              </div>
              <div className="shopcard shopcard-small" style={{ backgroundImage: `url(${Apartment4})` }}>
                <div className="shopcontent">
                  <span className="property-count text-light">3 Properties <br />Office</span>
                  <p>MORE DETAILS</p>
                  <span className="play-icon">
                    <FontAwesomeIcon icon={faPlay} />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="shoprow mt-3">
            <div className="shopstack">
              <div className="shopcard shopcard-small shopcard-text">
                <div>
                  <h2 className='text-dark'>Commercial</h2>
                  <p className='text-dark'>
                    Discover premium commercial spaces, including offices and retail shops,<br />
                    tailored to boost your business growth.<br />
                    Invest in the perfect location now.
                  </p>
                  <div className="shopunderline"></div>
                </div>
              </div>
            </div>
            <div className="shopcard shopcard-small" style={{ backgroundImage: `url(${Apartment6})` }}>
              <div className="shopcontent">
                <span className="property-count text-light">2 Properties <br />Villa</span>
                <p>MORE DETAILS</p>
                <span className="play-icon">
                  <FontAwesomeIcon icon={faPlay} />
                </span>
              </div>
            </div>
            <div className="shopcard shopcard-small" style={{ backgroundImage: `url(${Apartment7})` }}>
              <div className="shopcontent">
                <span className="property-count text-light">5 Properties <br />Duplex</span>
                <p>MORE DETAILS</p>
                <span className="play-icon">
                  <FontAwesomeIcon icon={faPlay} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopSection;