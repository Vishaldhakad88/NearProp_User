// ImageSlider.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faImage, faLocationDot } from '@fortawesome/free-solid-svg-icons';

const ImageSlider = ({ mainImage, setMainImage, currentIndex, setCurrentIndex, viewMode, setViewMode, images, property }) => {
  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setMainImage(images[currentIndex]);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setMainImage(images[currentIndex]);
  };

  const handleImageClick = (img, index) => {
    setMainImage(img);
    setCurrentIndex(index);
    setViewMode('image');
  };

  return (
    <div className="image-slider">
      <button className="property-nav left" onClick={handlePrev}>‹</button>
      <div className="main-image-wrapper">
        {viewMode === 'image' && <img src={mainImage} alt="PG/Hostel" className="main-image" />}
        {viewMode === 'map' && (
          <iframe src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`} />
        )}
        {viewMode === 'location' && (
          <iframe src={`https://www.google.com/maps?q=${encodeURIComponent(property.address)}&output=embed`} />
        )}
        <div className="image-icon-row abk">
          <div className={`icon-btn ${viewMode === 'map' ? 'active' : ''}`} onClick={() => setViewMode('map')}><FontAwesomeIcon icon={faMap} /></div>
          <div className={`icon-btn ${viewMode === 'image' ? 'active' : ''}`} onClick={() => setViewMode('image')}><FontAwesomeIcon icon={faImage} /></div>
          <div className={`icon-btn ${viewMode === 'location' ? 'active' : ''}`} onClick={() => setViewMode('location')}><FontAwesomeIcon icon={faLocationDot} /></div>
        </div>
      </div>
      <button className="property-nav right" onClick={handleNext}>›</button>
      <div className="thumbs">
        {images.map((img, index) => (
          <img key={index} src={img} alt={`Thumbnail ${index}`} className={`thumb ${index === currentIndex ? 'active' : ''}`} onClick={() => handleImageClick(img, index)} />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;