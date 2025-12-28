import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faMapMarkerAlt,
  faBed,
  faMoneyBill,
  faCalendarAlt,
  faStar,
  faShare,
  faPhone,
  faComment,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faInstagram, faFacebook, faYoutube, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import HotelSidebar from './HotelSidebar';
import './PgAndHostelDetails.css';

const API_CONFIG = {
  baseUrl: 'https://pg-hostel.nearprop.com',
  publicApiPrefix: 'api/public',
  privateApiPrefix: 'api',
};

// Advertisement API Config - HotelSidebar से बिल्कुल same
const AD_API_CONFIG = {
  baseUrl: 'https://api.nearprop.com',
  apiPrefix: 'api/v1',
};

// Fallback Ad - HotelSidebar से same
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
const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400';
const DEFAULT_AVATAR = '/assets/default-avatar.png';

const DEFAULT_PROPERTY = {
  id: '',
  propertyId: 'N/A',
  title: 'Untitled PG/Hostel',
  type: 'PG/Hostel',
  address: 'Location not specified',
  city: 'N/A',
  state: 'N/A',
  pinCode: 'N/A',
  totalRooms: 0,
  totalBeds: 0,
  availableRooms: 0,
  availableBeds: 0,
  lowestPrice: 0,
  images: [PLACEHOLDER_IMAGE],
  reels: [],
  description: 'No description available',
  hasAvailability: false,
  createdAt: 'N/A',
  owner: { name: 'Unknown Agent', phone: 'N/A', avatar: DEFAULT_AVATAR },
};

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (error) => {
      setHasError(true);
      setError(error);
      console.error('ErrorBoundary caught an error:', error);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="error">
        <h1>Something went wrong.</h1>
        <p>{error?.message || 'An unexpected error occurred.'}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }
  return children;
}

function PgAndHostelDetails() {
  const { pgandhosteltyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(DEFAULT_PROPERTY);
  const [ratings, setRatings] = useState([]);
  const [comments, setComments] = useState([]);
  const [ratingStats, setRatingStats] = useState({ averageRating: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [newComment, setNewComment] = useState('');

  // Advertisement states - अब real API से
  const [advertisements, setAdvertisements] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [adsLoading, setAdsLoading] = useState(true);
  const [adsError, setAdsError] = useState(null);

  const validateToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) return null;
      return {
        userId: payload.sub || payload.id,
        role: payload.roles ? payload.roles.join(',') : payload.role,
        email: payload.email || undefined,
        sessionId: payload.sessionId || undefined,
      };
    } catch (err) {
      return null;
    }
  };

  const getToken = () => {
    try {
      const authData = localStorage.getItem('authData');
      if (!authData) return null;
      const parsedData = JSON.parse(authData);
      if (!parsedData?.token) return null;
      const validatedData = validateToken(parsedData.token);
      if (!validatedData) return null;
      return {
        token: parsedData.token,
        userId: validatedData.userId || parsedData.userId,
        ownerName: parsedData.name || 'Unknown Agent',
        ownerPhone: parsedData.contactNumber || 'N/A',
        ownerAvatar: parsedData.profilePhoto || DEFAULT_AVATAR,
        sessionId: validatedData.sessionId,
      };
    } catch (err) {
      return null;
    }
  };

  const retryRequest = async (fn, retries = 2, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  };

  // Advertisement fetch - HotelSidebar से same logic
  const fetchAdvertisements = async (districtName) => {
    try {
      setAdsLoading(true);
      setAdsError(null);
      const token = getToken()?.token;
      const cleanedDistrict = (districtName || 'Ujjain').replace(/[^a-zA-Z\s]/g, '');

      const response = await axios.get(
        `${AD_API_CONFIG.baseUrl}/${AD_API_CONFIG.apiPrefix}/advertisements`,
        {
          params: {
            page: 0,
            size: 10,
            sortBy: "createdAt",
            direction: "DESC",
            targetLocation: cleanedDistrict,
            type: 'hotel',
          },
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      let ads = response.data.content || response.data;
      const filteredAds = ads.filter(ad => 
        ad.targetLocation?.toLowerCase() === cleanedDistrict.toLowerCase()
      );

      if (filteredAds.length === 0) {
        console.warn(`No hotel advertisements found for district: ${cleanedDistrict}`);
        setAdvertisements(FALLBACK_AD);
        setAdsError(`No hotel advertisements available for ${cleanedDistrict}.`);
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
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const auth = getToken();
        const headers = auth?.token
          ? { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'application/json' }
          : { 'Content-Type': 'application/json' };

        const propertyResponse = await retryRequest(() =>
          axios.get(`${API_CONFIG.baseUrl}/${API_CONFIG.publicApiPrefix}/property/${pgandhosteltyId}`, {
            headers: { 'Content-Type': 'application/json' },
          })
        );

        if (!propertyResponse.data.success || !propertyResponse.data.property) {
          throw new Error('No property data returned');
        }

        const propData = propertyResponse.data.property;
        setProperty({
          id: propData.id || DEFAULT_PROPERTY.id,
          propertyId: propData.propertyId || DEFAULT_PROPERTY.propertyId,
          title: propData.name || DEFAULT_PROPERTY.title,
          type: propData.type || DEFAULT_PROPERTY.type,
          address: propData.location?.address || DEFAULT_PROPERTY.address,
          city: propData.location?.city || DEFAULT_PROPERTY.city,
          state: propData.location?.state || DEFAULT_PROPERTY.state,
          pinCode: propData.location?.pinCode || DEFAULT_PROPERTY.pinCode,
          totalRooms: propData.totalRooms || DEFAULT_PROPERTY.totalRooms,
          totalBeds: propData.totalBeds || DEFAULT_PROPERTY.totalBeds,
          availableRooms: propData.availability?.availableRoomCount || DEFAULT_PROPERTY.availableRooms,
          availableBeds: propData.availability?.availableBedCount || DEFAULT_PROPERTY.availableBeds,
          lowestPrice: propData.pricing?.beds?.min || propData.pricing?.rooms?.min || DEFAULT_PROPERTY.lowestPrice,
          images: propData.images?.length > 0 ? propData.images : DEFAULT_PROPERTY.images,
          reels: propData.reels?.length > 0 ? propData.reels : DEFAULT_PROPERTY.reels,
          description: propData.description || DEFAULT_PROPERTY.description,
          hasAvailability: propData.availability?.hasAvailableRooms || DEFAULT_PROPERTY.hasAvailability,
          createdAt: propData.createdAt
            ? new Date(propData.createdAt).toLocaleDateString('en-IN')
            : DEFAULT_PROPERTY.createdAt,
          owner: {
            name: propData.landlord?.name || DEFAULT_PROPERTY.owner.name,
            phone: propData.landlord?.contactNumber || DEFAULT_PROPERTY.owner.phone,
            avatar: propData.landlord?.profilePhoto || DEFAULT_PROPERTY.owner.avatar,
            whatsapp: propData.landlord?.whatsapp || propData.landlord?.contactNumber || DEFAULT_PROPERTY.owner.phone,
          },
        });

        // Fetch ads based on city
        fetchAdvertisements(propData.location?.city);

        const ratingsParams = new URLSearchParams({
          page: '1',
          limit: '10',
          sortBy: 'createdAt',
          sortOrder: 'desc',
        }).toString();

        const commentsParams = new URLSearchParams({
          page: '1',
          limit: '10',
          sortBy: 'createdAt',
          sortOrder: 'desc',
        }).toString();

        const publicHeaders = { 'Content-Type': 'application/json' };

        const fetchWithFallback = async (url, authHeaders, isPublic = false) => {
          try {
            if (isPublic) {
              const publicUrl = url.replace(`/${API_CONFIG.privateApiPrefix}/`, `/${API_CONFIG.publicApiPrefix}/`);
              return await axios.get(publicUrl, { headers: publicHeaders });
            }
            return await axios.get(url, { headers: publicHeaders });
          } catch (err) {
            if (err.response?.status === 401 && authHeaders.Authorization) {
              return await axios.get(url, { headers: authHeaders });
            }
            throw err;
          }
        };

        const [statsResponse, ratingsResponse, commentsResponse] = await Promise.all([
          retryRequest(() =>
            fetchWithFallback(
              `${API_CONFIG.baseUrl}/${API_CONFIG.privateApiPrefix}/property/${pgandhosteltyId}/rating-stats`,
              headers,
              true
            )
          ).catch(() => ({ data: { averageRating: 0, totalRatings: 0 } })),
          retryRequest(() =>
            fetchWithFallback(
              `${API_CONFIG.baseUrl}/${API_CONFIG.privateApiPrefix}/property/${pgandhosteltyId}/ratings?${ratingsParams}`,
              headers,
              true
            )
          ).catch(() => ({ data: { ratings: [] } })),
          retryRequest(() =>
            fetchWithFallback(
              `${API_CONFIG.baseUrl}/${API_CONFIG.privateApiPrefix}/property/${pgandhosteltyId}/comments?${commentsParams}`,
              headers,
              true
            )
          ).catch(() => ({ data: { comments: [] } })),
        ]);

        setRatingStats({
          averageRating: statsResponse.data.averageRating || 0,
          totalRatings: statsResponse.data.totalRatings || 0,
        });
        setRatings(ratingsResponse.data.ratings || []);
        setComments(commentsResponse.data.comments || []);
      } catch (err) {
        let errorMessage = 'Failed to fetch property data. Please try again later.';
        if (err.code === 'ERR_NETWORK' || err.code === 'ERR_CONNECTION_REFUSED') {
          errorMessage = 'Unable to connect to the server. Please check your network.';
        } else if (err.response) {
          if (err.response.status === 404) {
            errorMessage = `Property not found for ID: ${pgandhosteltyId}.`;
          } else if (err.response.status === 500) {
            errorMessage = 'Server error occurred. Please contact support.';
          } else if (err.response.status === 401) {
            errorMessage = 'Authentication failed. Please log in again.';
            navigate('/login', { state: { from: `/pg-and-hostels/${pgandhosteltyId}` } });
            return;
          } else if (err.response.status === 403) {
            errorMessage = 'Access denied to view this property.';
          }
        }
        setError(errorMessage);
        setProperty(DEFAULT_PROPERTY);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pgandhosteltyId, navigate]);

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    const auth = getToken();
    if (!auth?.token) {
      setError('Please log in to submit a rating.');
      navigate('/login', { state: { from: `/pg-and-hostels/${pgandhosteltyId}` } });
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'application/json' };
      await retryRequest(() =>
        axios.post(
          `${API_CONFIG.baseUrl}/${API_CONFIG.privateApiPrefix}/property/${pgandhosteltyId}/ratings`,
          { rating: newRating, review: newReview },
          { headers }
        )
      );

      const ratingsParams = new URLSearchParams({
        page: '1',
        limit: '10',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }).toString();

      const [ratingsResponse, statsResponse] = await Promise.all([
        retryRequest(() =>
          axios.get(
            `${API_CONFIG.baseUrl}/${API_CONFIG.privateApiPrefix}/property/${pgandhosteltyId}/ratings?${ratingsParams}`,
            { headers }
          )
        ).catch(() => ({ data: { ratings: [] } })),
        retryRequest(() =>
          axios.get(
            `${API_CONFIG.baseUrl}/${API_CONFIG.privateApiPrefix}/property/${pgandhosteltyId}/rating-stats`,
            { headers }
          )
        ).catch(() => ({ data: { averageRating: 0, totalRatings: 0 } })),
      ]);

      setRatings(ratingsResponse.data.ratings || []);
      setRatingStats({
        averageRating: statsResponse.data.averageRating || 0,
        totalRatings: statsResponse.data.totalRatings || 0,
      });
      setNewRating(0);
      setNewReview('');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        localStorage.removeItem('authData');
        navigate('/login', { state: { from: `/pg-and-hostels/${pgandhosteltyId}` } });
      } else if (err.response?.status === 403) {
        setError('You do not have permission to submit a rating.');
      } else {
        setError('Failed to submit rating. Please try again.');
      }
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const auth = getToken();
    if (!auth?.token) {
      setError('Please log in to submit a comment.');
      navigate('/login', { state: { from: `/pg-and-hostels/${pgandhosteltyId}` } });
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'application/json' };
      await retryRequest(() =>
        axios.post(
          `${API_CONFIG.baseUrl}/${API_CONFIG.privateApiPrefix}/property/${pgandhosteltyId}/comments`,
          { comment: newComment },
          { headers }
        )
      );

      const commentsParams = new URLSearchParams({
        page: '1',
        limit: '10',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }).toString();

      const commentsResponse = await retryRequest(() =>
        axios.get(
          `${API_CONFIG.baseUrl}/${API_CONFIG.privateApiPrefix}/property/${pgandhosteltyId}/comments?${commentsParams}`,
          { headers }
        )
      );
      setComments(commentsResponse.data.comments || []);
      setNewComment('');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        localStorage.removeItem('authData');
        navigate('/login', { state: { from: `/pg-and-hostels/${pgandhosteltyId}` } });
      } else if (err.response?.status === 403) {
        setError('You do not have permission to submit a comment.');
      } else {
        setError('Failed to submit comment. Please try again.');
      }
    }
  };

  const handleShareClick = () => {
    const shareText = `
🏠 *${property.title}*
📍 Location: ${property.address}, ${property.city}, ${property.state}
💰 Price: ₹${property.lowestPrice.toLocaleString('en-IN')}/mo
🛏️ Beds: ${property.totalBeds} (${property.availableBeds} available)
🏠 Rooms: ${property.totalRooms} (${property.availableRooms} available)
🔗 View more: ${window.location.origin}/pg-and-hostels/${pgandhosteltyId}
    `.trim();
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, '_blank');
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (property.images.length || 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? (property.images.length || 1) - 1 : prev - 1));
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleGoBack = () => {
    setError(null);
    navigate('/pg-and-hostels', { replace: true });
  };

  const handleContactSupport = () => {
    navigate('/contact', {
      state: {
        issue: `Unable to load property with ID: ${pgandhosteltyId}`,
      },
    });
  };

  const propertyData = {
    price: property.lowestPrice,
    type: property.type,
    area: property.totalRooms,
    landAreaPostfix: 'Rooms',
    status: property.hasAvailability ? 'Available' : 'Unavailable',
    districtName: property.city,
    imageUrls: property.images,
  };

  if (loading) {
    return <>Loading..</>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <p>Please ensure the property ID in the URL is correct or try another property.</p>
        <div className="error-buttons">
          <button onClick={handleGoBack}>Go Back to PG & Hostels</button>
          <button onClick={handleContactSupport}>Contact Support</button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="main-container">
        <style jsx>{`
          .advertisement-section {
            margin: 24px 0;
            padding: 24px;
            background: #ffffff;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            position: relative;
          }

          .ad-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            align-items: stretch;
            height: 100%;
          }

          .ad-image {
            width: 100%;
            height: 100%;
            min-height: 300px;
            object-fit: cover;
            border-radius: var(--border-radius);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }

          .ad-image:hover {
            transform: scale(1.02);
          }

          .ad-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 🔥 text top se start hoga */
  align-items: flex-start;     /* 🔥 left aligned rahega */
  height: 100%;
  padding: 8px 0;
}


          .ad-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 8px;
            text-align: left;
          }

          .ad-description {
            font-size: 0.9rem;
            color: var(--text-grey);
            line-height: 1.6;
            margin: 0;
            flex-grow: 1;
          }

          .ad-contact-icons {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 16px;
          }

          .ad-contact-icons a {
            color: var(--primary-color);
            font-size: 1.5rem;
            transition: color 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
          }

          .ad-contact-icons a:hover {
            color: var(--secondary-color);
          }

          .ad-nav {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 16px;
          }

          .ad-nav-btn {
            background: var(--primary-color);
            color: #ffffff;
            border: none;
            padding: 10px 15px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.3s ease;
          }

          .ad-nav-btn:hover {
            background: #005555;
          }

          @media (max-width: 1200px) {
            .ad-container {
              grid-template-columns: 1fr;
            }

            .ad-image {
              height: 200px;
              min-height: unset;
            }
          }

          @media (max-width: 900px) {
            .advertisement-section {
              padding: 16px;
            }

            .ad-image {
              height: 180px;
            }

            .ad-title {
              font-size: 1.25rem;
            }

            .ad-description {
              font-size: 0.85rem;
            }

            .ad-contact-icons a {
              font-size: 1.3rem;
              width: 36px;
              height: 36px;
            }
          }

          @media (max-width: 600px) {
            .advertisement-section {
              margin: 16px 0;
              padding: 12px;
            }

            h2 {
              font-size: 1.2rem;
              margin-bottom: 12px;
            }

            .ad-container {
              grid-template-columns: 1fr;
            }

            .ad-image {
              height: 150px;
            }

            .ad-title {
              font-size: 1.1rem;
            }

            .ad-description {
              font-size: 0.8rem;
            }

            .ad-contact-icons {
              justify-content: center;
              gap: 10px;
            }

            .ad-contact-icons a {
              font-size: 1.2rem;
              width: 32px;
              height: 32px;
            }

            .ad-nav-btn {
              padding: 8px 12px;
              font-size: 0.9rem;
            }
          }

          @media (max-width: 480px) {
            .advertisement-section {
              padding: 8px;
            }

            .ad-image {
              height: 120px;
            }

            .ad-title {
              font-size: 1rem;
            }

            .ad-description {
              font-size: 0.75rem;
            }

            .ad-contact-icons a {
              font-size: 1.1rem;
              width: 28px;
              height: 28px;
            }

            .ad-nav-btn {
              padding: 6px 10px;
              font-size: 0.85rem;
            }
          }
        `}</style>

        <div className="property-header">
          <div className="property-left">
            <div className="breadcrumbs">
              <Link to="/">
                <FontAwesomeIcon icon={faHome} /> Home
              </Link>
              <span>&gt;</span>
              <Link to="/pg-and-hostels">PG & Hostels</Link>
              <span>&gt;</span>
              <span>{property.title}</span>
            </div>
            <h1 className="property-title">{property.title}</h1>
            <p className="location">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> {property.address}, {property.city}, {property.state}, {property.pinCode}
            </p>
            <div className="labels">
              {property.hasAvailability ? (
                <span className="label for-sale">Available</span>
              ) : (
                <span className="label for-sale">Unavailable</span>
              )}
              <span className="label">
                {ratingStats.averageRating.toFixed(1)} ({ratingStats.totalRatings} reviews)
              </span>
            </div>
          </div>
          <div className="property-price">
            <span className="price">₹{property.lowestPrice.toLocaleString('en-IN')}/mo</span>
            <p>{property.totalBeds} Beds ({property.availableBeds} available)</p>
          </div>
        </div>

        <div className="main-layout">
          <div className="content-column">
            <div className="image-slider-section">
              <div className="image-slider">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="main-image"
                  onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
                />
                <button className="property-nav left" onClick={handlePrevImage} aria-label="Previous Image">
                  ‹
                </button>
                <button className="property-nav right" onClick={handleNextImage} aria-label="Next Image">
                  ›
                </button>
                <div className="neartime-price-box">
                  ₹{property.lowestPrice.toLocaleString('en-IN')}/mo
                  <br />
                  <span className="neartime-price-per">
                    {property.totalBeds} Beds ({property.availableBeds} available)
                  </span>
                </div>
                <div className="landing-overlay-icons">
                  <FontAwesomeIcon
                    icon={faShare}
                    className="landing-overlay-icons-i"
                    onClick={handleShareClick}
                    title="Share Property"
                  />
                  <FontAwesomeIcon
                    icon={faComment}
                    className="landing-overlay-icons-i"
                    onClick={() => navigate('/contact', { state: { propertyId: property.id } })}
                    title="Contact Owner"
                  />
                </div>
              </div>
              <div className="thumbs">
                {property.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className={`thumb ${currentImageIndex === index ? 'active' : ''}`}
                    onClick={() => handleImageClick(index)}
                    onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
                  />
                ))}
              </div>
            </div>

            {property.reels.length > 0 && (
              <div className="reels-section">
                <h2>Reels</h2>
                <div className="reels-container">
                  {property.reels.map((reel, index) => (
                    <video
                      key={index}
                      src={reel}
                      controls
                      className="reel-video"
                      onError={(e) => console.error('Reel load error:', e)}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="overview-container">
              <div className="overview-top-bar">
                <h2>Overview</h2>
                <span className="property-id">Property ID: {property.propertyId}</span>
              </div>
              <div className="overview-details">
                <div className="overview-item">
                  <span><FontAwesomeIcon icon={faHome} /> Type</span>
                  <strong>{property.type}</strong>
                </div>
                <div className="overview-item">
                  <span><FontAwesomeIcon icon={faBed} /> Total Beds</span>
                  <strong>{property.totalBeds}</strong>
                </div>
                <div className="overview-item">
                  <span><FontAwesomeIcon icon={faBed} /> Available Beds</span>
                  <strong>{property.availableBeds}</strong>
                </div>
                <div className="overview-item">
                  <span><FontAwesomeIcon icon={faHome} /> Total Rooms</span>
                  <strong>{property.totalRooms}</strong>
                </div>
                <div className="overview-item">
                  <span><FontAwesomeIcon icon={faHome} /> Available Rooms</span>
                  <strong>{property.availableRooms}</strong>
                </div>
                <div className="overview-item">
                  <span><FontAwesomeIcon icon={faMoneyBill} /> Price</span>
                  <strong>₹{property.lowestPrice.toLocaleString('en-IN')}/mo</strong>
                </div>
                <div className="overview-item">
                  <span><FontAwesomeIcon icon={faCalendarAlt} /> Listed On</span>
                  <strong>{property.createdAt}</strong>
                </div>
                <div className="overview-item">
                  <span><FontAwesomeIcon icon={faStar} /> Rating</span>
                  <strong>{ratingStats.averageRating.toFixed(1)} ({ratingStats.totalRatings} reviews)</strong>
                </div>
              </div>
            </div>

            <div className="gallery-section">
              <h2>Gallery</h2>
              <div className="gallery-grid">
                {property.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Gallery Image ${index + 1}`}
                    className="gallery-image"
                    onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
                  />
                ))}
              </div>
            </div>

            <div className="address-section">
              <h2>Address</h2>
              <div className="address-details">
                <div><strong>Address:</strong> {property.address}</div>
                <div><strong>City:</strong> {property.city}</div>
                <div><strong>State:</strong> {property.state}</div>
                <div><strong>Pin Code:</strong> {property.pinCode}</div>
                <button
                  className="google-maps-btn"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${encodeURIComponent(
                        `${property.address}, ${property.city}, ${property.state} ${property.pinCode}`
                      )}`,
                      '_blank'
                    )
                  }
                >
                  Open in Google Maps
                </button>
              </div>
            </div>

            {/* ================== Advertisement Section ================== */}
<style jsx>{`
  .advertisement-section {
    margin: 24px 0;
    padding: 24px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
    position: relative;
  }

  .ads {
    position: absolute;
    top: 10px;
    right: 16px;
    font-size: 0.75rem;
    color: white;
  }

  .ad-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: stretch;
  }

  .ad-image {
    width: 100%;
    height: 260px;
    object-fit: cover;
    border-radius: 10px;
  }

  .ad-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .ad-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: #222;
  }

  .ad-description {
    font-size: 0.9rem;
    color: #555;
    line-height: 1.5;
  }

  .ad-meta {
    font-size: 0.8rem;
    color: #666;
  }

  .ad-contact-icons {
    display: flex;
    gap: 12px;
    margin-top: 10px;
  }

  .ad-contact-icons a {
    font-size: 1.3rem;
    color: #03718a;
  }

  .ad-website-btn {
    margin-top: 12px;
    padding: 8px 14px;
    background: #03718a;
    color: #fff;
    border-radius: 6px;
    font-size: 0.85rem;
    text-decoration: none;
    width: fit-content;
  }

  .ad-website-btn:hover {
    background: #025b6e;
  }

  .ad-nav {
    margin-top: 16px;
    display: flex;
    justify-content: center;
    gap: 12px;
  }

  .ad-nav-btn {
    border: none;
    background: #03718a;
    color: #fff;
    padding: 8px 12px;
    border-radius: 50%;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .ad-container {
      grid-template-columns: 1fr;
    }

    .ad-image {
      height: 200px;
    }
  }
`}</style>

<div className="advertisement-section">
  <span className="ads">Sponsored</span>

  {adsLoading && <p>Loading advertisements...</p>}
  {adsError && <p className="error-text">{adsError}</p>}

  {!adsLoading && !adsError && advertisements.length > 0 && (
    <div key={advertisements[currentAdIndex].id} className="ad-container">
      <img
        src={advertisements[currentAdIndex].bannerImageUrl}
        alt={advertisements[currentAdIndex].title}
        className="ad-image"
        onError={(e) => (e.target.src = PLACEHOLDER_IMAGE)}
      />

      <div className="ad-content">
        <h3 className="ad-title">
          {advertisements[currentAdIndex].title}
        </h3>

        <p className="ad-description">
          {advertisements[currentAdIndex].description}
        </p>

        <p className="ad-meta">
          📍 {advertisements[currentAdIndex].districtName}
        </p>

        <p className="ad-meta">
          👤 {advertisements[currentAdIndex].createdBy?.name}
        </p>

        <p className="ad-meta">
          📅 Valid:
          {new Date(advertisements[currentAdIndex].validFrom).toLocaleDateString("en-IN")}
          {" "}–{" "}
          {new Date(advertisements[currentAdIndex].validUntil).toLocaleDateString("en-IN")}
        </p>

        <p className="ad-meta">
          👁 {advertisements[currentAdIndex].viewCount} views
        </p>

        <div className="ad-contact-icons">
          {advertisements[currentAdIndex].phoneNumber && (
            <a href={`tel:${advertisements[currentAdIndex].phoneNumber}`}>
              <FontAwesomeIcon icon={faPhone} />
            </a>
          )}

          {advertisements[currentAdIndex].whatsappNumber && (
            <a
              href={`https://wa.me/${advertisements[currentAdIndex].whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
          )}

          {advertisements[currentAdIndex].emailAddress && (
            <a href={`mailto:${advertisements[currentAdIndex].emailAddress}`}>
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
          )}
        </div>

        {advertisements[currentAdIndex].websiteUrl && (
          <a
            href={advertisements[currentAdIndex].websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="ad-website-btn"
          >
            🌐 Visit Website
          </a>
        )}
      </div>
    </div>
  )}

  {advertisements.length > 1 && (
    <div className="ad-nav">
      <button
        className="ad-nav-btn"
        onClick={() =>
          setCurrentAdIndex(
            (prev) => (prev - 1 + advertisements.length) % advertisements.length
          )
        }
      >
        ‹
      </button>
      <button
        className="ad-nav-btn"
        onClick={() =>
          setCurrentAdIndex((prev) => (prev + 1) % advertisements.length)
        }
      >
        ›
      </button>
    </div>
  )}
</div>
{/* ================== Advertisement Section End ================== */}


            <div className="description-section">
              <h2>Description</h2>
              <p className="description-text">{property.description}</p>
            </div>

            <div className="details-section">
              <h2>Property Details</h2>
              <div className="details-content">
                <div className="detail-item">
                  <FontAwesomeIcon icon={faMoneyBill} /> Price: <strong>₹{property.lowestPrice.toLocaleString('en-IN')}/mo</strong>
                </div>
                <div className="detail-item">
                  <FontAwesomeIcon icon={faBed} /> Beds: <strong>{property.totalBeds} ({property.availableBeds} available)</strong>
                </div>
                <div className="detail-item">
                  <FontAwesomeIcon icon={faHome} /> Rooms: <strong>{property.totalRooms} ({property.availableRooms} available)</strong>
                </div>
                <div className="detail-item">
                  <FontAwesomeIcon icon={faCalendarAlt} /> Listed: <strong>{property.createdAt}</strong>
                </div>
                <a
                  href={property.owner.phone !== 'N/A' ? `tel:${property.owner.phone}` : '#'}
                  className="google-maps-btn w-full"
                  onClick={(e) => {
                    if (property.owner.phone === 'N/A') {
                      e.preventDefault();
                      alert('Phone number not available');
                    }
                  }}
                >
                  Contact Owner
                </a>
              </div>
            </div>

            <div className="reviews-section">
              <h2>Reviews & Ratings</h2>
              <div className="rating-summary">
                <p>
                  <FontAwesomeIcon icon={faStar} /> {ratingStats.averageRating.toFixed(1)} (
                  {ratingStats.totalRatings} ratings, {comments.length} comments)
                </p>
              </div>
              <div className="rating-form">
                <h3>Submit Your Rating</h3>
                <form onSubmit={handleSubmitRating}>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FontAwesomeIcon
                        key={star}
                        icon={faStar}
                        className={newRating >= star ? 'star active' : 'star'}
                        onClick={() => setNewRating(star)}
                      />
                    ))}
                  </div>
                  <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Write your review..."
                    className="rating-textarea"
                    required
                  />
                  <button type="submit" className="google-maps-btn">
                    Submit Rating
                  </button>
                </form>
              </div>
              <div className="comment-form">
                <h3>Submit a Comment</h3>
                <form onSubmit={handleSubmitComment}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                    className="rating-textarea"
                    required
                  />
                  <button type="submit" className="google-maps-btn">
                    Submit Comment
                  </button>
                </form>
              </div>
              <div className="ratings-list">
                {ratings.length > 0 ? (
                  ratings.map((rating, index) => (
                    <div key={index} className="rating-item">
                      <div className="rating-meta">
                        <span>{rating.userName || 'Anonymous'}</span>
                        <span>{new Date(rating.createdAt).toLocaleDateString('en-IN')}</span>
                        <span>
                          {rating.rating} <FontAwesomeIcon icon={faStar} />
                        </span>
                      </div>
                      <p>{rating.review}</p>
                    </div>
                  ))
                ) : (
                  <p>No ratings available.</p>
                )}
              </div>
              <div className="comments-list">
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={index} className="comment-item">
                      <div className="comment-meta">
                        <span>{comment.userName || 'Anonymous'}</span>
                        <span>{new Date(comment.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                      <p>{comment.comment}</p>
                    </div>
                  ))
                ) : (
                  <p>No comments available.</p>
                )}
              </div>
            </div>
          </div>

          <HotelSidebar
            propertyId={property.id}
            propertyTitle={property.title}
            owner={property.owner}
            propertydata={propertyData}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default PgAndHostelDetails;