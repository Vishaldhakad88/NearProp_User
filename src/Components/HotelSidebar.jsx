import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faEnvelope, faChevronLeft, faChevronRight, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faInstagram, faFacebookF, faYoutube } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import './HotelSidebar.css';

const AD_API_CONFIG = {
  baseUrl: 'https://api.nearprop.com',
  apiPrefix: 'api/v1',
};

const FALLBACK_AD = [
  {
    id: 1,
    title: "Luxury Hotel in Ujjain",
    description: "Experience a luxurious stay with world-class amenities and scenic views",
    bannerImageUrl: "/hotel.jpg",
    phoneNumber: "+91 91551 05666",
    whatsappNumber: "+91 91551 05666",
    emailAddress: "bookings@ujjainhotel.com",
    targetLocation: "Ujjain",
    validUntil: "2025-12-31T23:59:59",
    createdBy: { name: "Hotel Administrator" },
  },
];

const DEFAULT_AD_IMAGE = '/assets/default-hotel-ad.png';

const HotelSidebar = ({ propertyId, propertyTitle, owner, propertydata }) => {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formError, setFormError] = useState(null);
  const [advertisements, setAdvertisements] = useState([]);
  const [adsLoading, setAdsLoading] = useState(true);
  const [adsError, setAdsError] = useState(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isAdHovered, setIsAdHovered] = useState(false);
  const adSectionRef = useRef(null);

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

  // Fetch advertisements
  const fetchAdvertisements = async () => {
    try {
      setAdsLoading(true);
      setAdsError(null);
      const token = getToken()?.token;
      const districtName = (propertydata?.districtName || 'Ujjain').replace(/[^a-zA-Z\s]/g, '');
      const response = await axios.get(
        `${AD_API_CONFIG.baseUrl}/${AD_API_CONFIG.apiPrefix}/advertisements`,
        {
          params: {
            page: 0,
            size: 10,
            sortBy: "createdAt",
            direction: "DESC",
            targetLocation: districtName,
            type: 'hotel',
          },
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      let ads = response.data.content || response.data;
      const filteredAds = ads.filter(ad => ad.targetLocation?.toLowerCase() === districtName.toLowerCase());
      if (filteredAds.length === 0) {
        console.warn(`No hotel advertisements found for district: ${districtName}`);
        setAdvertisements(FALLBACK_AD);
        setAdsError(`No hotel advertisements available for ${districtName}.`);
      } else {
        setAdvertisements(filteredAds);
      }
    } catch (err) {
      console.error('Advertisement fetch error:', err.message);
      setAdsError(`Failed to load hotel advertisements: ${err.message}`);
      setAdvertisements(FALLBACK_AD);
    } finally {
      setAdsLoading(false);
    }
  };

  useEffect(() => {
    if (propertydata?.districtName) {
      fetchAdvertisements();
    }
  }, [propertydata?.districtName]);

  useEffect(() => {
    if (advertisements && advertisements.length > 1 && !isAdHovered) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % advertisements.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [advertisements, isAdHovered]);

  const handlePrevAd = () => {
    setCurrentAdIndex((prevIndex) => (prevIndex - 1 + advertisements.length) % advertisements.length);
  };

  const handleNextAd = () => {
    setCurrentAdIndex((prevIndex) => (prevIndex + 1) % advertisements.length);
  };

  const handleDotClick = (index) => {
    setCurrentAdIndex(index);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!contactForm.name.trim()) errors.name = 'Name is required';
    if (!contactForm.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(contactForm.email)) errors.email = 'Invalid email format';
    if (!contactForm.message.trim()) errors.message = 'Message is required';

    if (Object.keys(errors).length > 0) {
      setFormError(errors);
      return;
    }

    console.log('Contact form submitted:', contactForm);
    setContactForm({ name: '', email: '', message: '' });
    setFormError(null);
    alert('Message sent successfully!');
  };

  console.log('Sidebar Rendering:', { propertyId, propertyTitle, owner, propertydata });

  const normalizedOwner = {
    name: owner?.name || 'Unknown Agent',
    phone: owner?.phone || 'N/A',
    whatsapp: owner?.whatsapp || 'N/A',
    avatar: owner?.avatar || propertydata?.imageUrls?.[0] || '/placeholder.jpg',
  };

  return (
    <div className="sidebar">
      <div className="quick-info">
        <h2>Quick Info</h2>
        <div className="quick-info-grid">
          <div>
            <strong>Price:</strong> ₹{propertydata?.price?.toLocaleString() || 'N/A'}/{propertydata?.type === 'Hotel' ? 'night' : 'event'}
          </div>
          <div>
            <strong>Type:</strong> {propertydata?.type || 'N/A'}
          </div>
          <div>
            <strong>{propertydata?.type === 'Hotel' ? 'Rooms' : 'Capacity'}:</strong> {propertydata?.area || 'N/A'} {propertydata?.landAreaPostfix}
          </div>
          <div>
            <strong>Status:</strong> {propertydata?.status || 'N/A'}
          </div>
        </div>
      </div>

      <div className="sidebar-ad" ref={adSectionRef} onMouseEnter={() => setIsAdHovered(true)} onMouseLeave={() => setIsAdHovered(false)}>
        <h3>Explore More Hotels</h3>
        {adsLoading ? (
          <div className="spinner text-center">
            <div className="spinner-icon"></div>
          </div>
        ) : adsError ? (
          <p className="error-text">{adsError}</p>
        ) : advertisements.length > 0 ? (
          <div className="ad-slider">
            <div className="ad-slide" style={{ transform: `translateX(-${currentAdIndex * 100}%)` }}>
              {advertisements.map((ad) => (
                <div key={ad.id} className="ad-slide-item">
                  <h5 className="ad-title">{ad.title || 'Hotel Advertisement'}</h5>
                  <img
                    src={ad.bannerImageUrl || DEFAULT_AD_IMAGE}
                    alt={ad.title || 'Hotel Advertisement'}
                    className="ad-image"
                    onError={(e) => { e.target.src = DEFAULT_AD_IMAGE; }}
                  />
                  <p className="ad-description">{ad.description || 'No description available'}</p>
                  <div className="ad-contact-icons">
                    {ad.phoneNumber && ad.phoneNumber !== 'N/A' && (
                      <a
                        href={`tel:${ad.phoneNumber}`}
                        className="ad-contact-icon call"
                        title="Call"
                        aria-label="Call advertisement contact"
                      >
                        <FontAwesomeIcon icon={faPhone} />
                      </a>
                    )}
                    {ad.emailAddress && ad.emailAddress !== 'N/A' && (
                      <a
                        href={`mailto:${ad.emailAddress}?subject=Inquiry about ${ad.title || 'Advertisement'}`}
                        className="ad-contact-icon mail"
                        title="Email"
                        aria-label="Email advertisement contact"
                      >
                        <FontAwesomeIcon icon={faEnvelope} />
                      </a>
                    )}
                    {ad.whatsappNumber && ad.whatsappNumber !== 'N/A' && (
                      <a
                        href={`https://wa.me/${ad.whatsappNumber}?text=Inquiry%20about%20${ad.title || 'Advertisement'}`}
                        className="ad-contact-icon whatsapp"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="WhatsApp"
                        aria-label="WhatsApp advertisement contact"
                      >
                        <FontAwesomeIcon icon={faWhatsapp} />
                      </a>
                    )}
                    {ad.instagramUrl && (
                      <a
                        href={ad.instagramUrl}
                        className="ad-contact-icon instagram"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Instagram"
                        aria-label="Instagram advertisement contact"
                      >
                        <FontAwesomeIcon icon={faInstagram} />
                      </a>
                    )}
                    {ad.facebookUrl && (
                      <a
                        href={ad.facebookUrl}
                        className="ad-contact-icon facebook"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Facebook"
                        aria-label="Facebook advertisement contact"
                      >
                        <FontAwesomeIcon icon={faFacebookF} />
                      </a>
                    )}
                    {ad.youtubeUrl && (
                      <a
                        href={ad.youtubeUrl}
                        className="ad-contact-icon youtube"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="YouTube"
                        aria-label="YouTube advertisement contact"
                      >
                        <FontAwesomeIcon icon={faYoutube} />
                      </a>
                    )}
                    {ad.websiteUrl && (
                      <a
                        href={ad.websiteUrl}
                        className="ad-contact-icon website"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Website"
                        aria-label="Website advertisement contact"
                      >
                        <FontAwesomeIcon icon={faGlobe} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {advertisements.length > 1 && (
              <>
                <button className="ad-nav-button left" onClick={handlePrevAd} aria-label="Previous hotel advertisement">
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button className="ad-nav-button right" onClick={handleNextAd} aria-label="Next hotel advertisement">
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
                <div className="ad-dots">
                  {advertisements.map((_, index) => (
                    <span
                      key={index}
                      className={`ad-dot ${index === currentAdIndex ? 'active' : ''}`}
                      onClick={() => handleDotClick(index)}
                      role="button"
                      aria-label={`Go to hotel advertisement ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <p>No hotel advertisements available for this district.</p>
        )}
      </div>

      <div className="agent-info">
        <img src={normalizedOwner.avatar} alt="Agent or Hotel" className="agent-photo" onError={(e) => { e.target.src = '/placeholder.jpg'; }} />
        <div className="agent-details">
          <div><strong>{normalizedOwner.name}</strong></div>
          <div>{owner?.role || 'Agent'}</div>
          <div className="agent-contact">
            <a
              href={`tel:${normalizedOwner.phone}`}
              className="ad-contact-button call"
              onClick={(e) => normalizedOwner.phone === 'N/A' && e.preventDefault()}
            >
              <FontAwesomeIcon icon={faPhone} className="me-1" /> Call
            </a>
            <a
              href={`https://wa.me/${normalizedOwner.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ad-contact-button whatsapp"
              onClick={(e) => normalizedOwner.whatsapp === 'N/A' && e.preventDefault()}
            >
              <FontAwesomeIcon icon={faWhatsapp} className="me-1" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="contact-container">
        <h3>Contact Agent</h3>
        <div className="contact-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              placeholder="Your Name"
            />
            {formError?.name && <span className="error-text">{formError.name}</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              placeholder="Your Email"
            />
            {formError?.email && <span className="error-text">{formError.email}</span>}
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              placeholder="Your Message"
            ></textarea>
            {formError?.message && <span className="error-text">{formError.message}</span>}
          </div>
          <button type="button" onClick={handleContactSubmit} className="submit-btn">
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelSidebar;