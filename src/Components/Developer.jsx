import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./agents.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faShower,
  faCar,
  faUser,
  faPaperclip,
  faComment,
  faMapMarkerAlt as faMapMarkerAltSolid,
  faStar as faSolidStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaWhatsapp as FaWhatsappSolid,
  FaStar,
  FaBuilding,
  FaMapMarkerAlt,
  FaHome,
  FaCheckCircle,
  FaTools,
} from "react-icons/fa";
import villa1 from "../assets/villa-1.avif";
import villa2 from "../assets/villa-2.avif";
import villa3 from "../assets/villa-3.avif";
import axios from "axios";

const baseUrl = "https://api.nearprop.com";
const apiPrefix = "api";

function Developer() {
  const [developers, setDevelopers] = useState([]);
  const [filteredDevelopers, setFilteredDevelopers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [agentListings, setAgentListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const navigate = useNavigate();

  // Location filters
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Dummy data for developers
  const dummyDevelopers = [
    {
      id: 1,
      name: "John Doe",
      profileImageUrl: "https://img.freepik.com/free-photo/medium-shot-man-working-as-real-estate-agent_23-2151064999.jpg",
      mobileNumber: "9876543210",
      email: "john.doe@modernhouse.com",
      state: "California",
      district: "Los Angeles",
    },
    {
      id: 2,
      name: "Jane Smith",
      profileImageUrl: "https://img.freepik.com/free-photo/medium-shot-man-working-as-real-estate-agent_23-2151064999.jpg",
      mobileNumber: "8765432109",
      email: "jane.smith@modernhouse.com",
      state: "Florida",
      district: "Miami",
    },
    {
      id: 3,
      name: "Mike Johnson",
      profileImageUrl: "https://img.freepik.com/free-photo/medium-shot-man-working-as-real-estate-agent_23-2151064999.jpg",
      mobileNumber: "7654321098",
      email: "mike.johnson@modernhouse.com",
      state: "New York",
      district: "New York City",
    },
  ];

  // Dummy data for listings
  const dummyListings = [
    {
      id: 1,
      title: "Luxury Villa",
      price: "Rs1,200,000",
      image: villa1,
      address: "Los Angeles, California",
      area: 2000,
      type: "Villa",
      status: "FOR_SALE",
    },
    {
      id: 2,
      title: "Modern Apartment",
      price: "Rs850,000",
      image: villa2,
      address: "Miami, Florida",
      area: 1500,
      type: "Apartment",
      status: "FOR_SALE",
    },
    {
      id: 3,
      title: "Cozy Cottage",
      price: "Rs600,000",
      image: villa3,
      address: "New York City, New York",
      area: 1200,
      type: "Cottage",
      status: "FOR_SALE",
    },
  ];

  // Dummy data for reviews
  const dummyReviews = [
    {
      id: 1,
      user: { name: "Alice" },
      rating: 4,
      comment: "Great service and beautiful properties!",
      createdAt: "2025-09-01",
    },
    {
      id: 2,
      user: { name: "Bob" },
      rating: 5,
      comment: "Highly recommend this developer!",
      createdAt: "2025-09-10",
    },
  ];

  const getAuthData = () => {
    const authData = localStorage.getItem("authData");
    if (authData) {
      try {
        return JSON.parse(authData);
      } catch (err) {
        console.error("Error parsing authData:", err);
        return null;
      }
    }
    return null;
  };

  const getToken = () => {
    const authData = getAuthData();
    return authData ? authData.token : null;
  };

  // Check authentication and show toast if not logged in
  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast.warn("Please log in to view developers.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => {
          navigate("/login", { state: { from: "/developer" } });
        },
      });
    }
  }, [navigate]);

  // Set dummy data on mount
  useEffect(() => {
    setDevelopers(dummyDevelopers);
    setFilteredDevelopers(dummyDevelopers);
    setLoading(false);
    setAgentListings(dummyListings); // Set dummy listings
    setReviews(dummyReviews); // Set dummy reviews
    setAverageRating(
      dummyReviews.reduce((sum, review) => sum + review.rating, 0) /
        dummyReviews.length || 0
    );
    setReviewCount(dummyReviews.length);
  }, []);

  // Fetch districts/states
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const res = await axios.get(`${baseUrl}/${apiPrefix}/property-districts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const districtsData = res.data || [];
        setDistricts(districtsData);

        const uniqueStates = [...new Set(districtsData.map((d) => d.state))];
        setStates(uniqueStates);
      } catch (err) {
        console.error("Failed to load location data:", err.message);
      }
    };
    fetchDistricts();
  }, []);

  // Update filtered districts when state changes
  useEffect(() => {
    if (selectedState) {
      const filtered = districts.filter((d) => d.state === selectedState);
      setFilteredDistricts(filtered);
      setSelectedDistrict("");
    } else {
      setFilteredDistricts([]);
      setSelectedDistrict("");
    }
  }, [selectedState, districts]);

  const applyFilters = () => {
    let filtered = [...developers];

    if (searchQuery) {
      filtered = filtered.filter((dev) =>
        dev.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedState) {
      filtered = filtered.filter((dev) => dev.state === selectedState);
    }
    if (selectedDistrict) {
      filtered = filtered.filter((dev) => dev.district === selectedDistrict);
    }

    setFilteredDevelopers(filtered);
  };

  const openDeveloperModal = (developer) => {
    setSelectedDeveloper(developer);
    setActiveTab("about");
    document.body.style.overflow = "hidden";
    // Filter listings and reviews based on selected developer
    setAgentListings(dummyListings.filter((listing) => listing.address.includes(developer.state)));
    setReviews(dummyReviews);
    setAverageRating(
      dummyReviews.reduce((sum, review) => sum + review.rating, 0) / dummyReviews.length || 0
    );
    setReviewCount(dummyReviews.length);
  };

  const closeDeveloperModal = () => {
    setSelectedDeveloper(null);
    document.body.style.overflow = "auto";
    setAgentListings([]);
    setReviews([]);
    setAverageRating(0);
    setReviewCount(0);
  };

  // Do not render content if not authenticated
  const token = getToken();
  if (!token) {
    return <ToastContainer />;
  }

  return (
    <>
      <div className="page-container">
        <div className="content-area">
          <h2 className="p-3">Developer</h2>
          {loading && <p>Loading developers...</p>}
          {error && <p className="error-message">Error: {error}</p>}
          {!loading && !error && filteredDevelopers.length === 0 && (
            <p>No developers found.</p>
          )}

          <div className="agents-grid">
            {filteredDevelopers.map((developer) => (
              <div key={developer.id} className="nearprop-agent-card">
                <img
                  src={
                    developer.profileImageUrl ||
                    "https://img.freepik.com/free-photo/medium-shot-man-working-as-real-estate-agent_23-2151064999.jpg"
                  }
                  alt={developer.name || "Developer"}
                  className="nearprop-agent-photo"
                />
                <div className="nearprop-agent-info">
                  <div className="nearprop-header d-inline-flex">
                    <h2 className="nearprop-agent-name">
                      {developer.name || "Unknown Developer"}
                    </h2>
                    <div className="nearprop-stars">★ ★ ★ ☆ ☆</div>
                  </div>
                  <p className="nearprop-designation">
                    Developer at <a href="#">Modern House Real Estate</a>
                  </p>
                  <div className="nearprop-details">
                    <div className="nearprop-row">
                      <span>Call</span>
                      <p>
                        <a href={`tel:${developer.mobileNumber || "9876543210"}`}>
                          <FaPhoneAlt className="contact-icon" />
                        </a>
                      </p>
                    </div>
                    <hr />
                    <div className="nearprop-row">
                      <span>WhatsApp</span>
                      <p>
                        <a
                          href={`https://wa.me/${developer.mobileNumber || "9876543210"}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaWhatsappSolid className="contact-icon" style={{ color: "#25D366" }} />
                        </a>
                      </p>
                    </div>
                    <hr />
                    <div className="nearprop-row">
                      <span>Email</span>
                      <p>
                        <a href={`mailto:${developer.email || "john.doe@modernhouse.com"}`}>
                          <FaEnvelope className="contact-icon" />
                        </a>
                      </p>
                    </div>
                    <hr />
                    <div className="nearprop-row">
                      <span>Profile</span>
                      <label onClick={() => openDeveloperModal(developer)}>View</label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="agents-sidebar">
          <div className="widget">
            <h3>Find Developer</h3>
            <input
              type="text"
              placeholder="Enter developer name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="filter-group">
              <label className="filter-label">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="filter-select"
              >
                <option value="">All States</option>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="filter-select"
              >
                <option value="">All Districts</option>
                {filteredDistricts.map((d) => (
                  <option key={d.district} value={d.district}>
                    {d.district}
                  </option>
                ))}
              </select>
            </div>
            <button className="search-btn" onClick={applyFilters}>Search Developer</button>
          </div>
          <div className="widget">
            <h3>Recently Viewed</h3>
            {[villa1, villa2, villa3].map((img, index) => (
              <div className="recent-item" key={index}>
                <img src={img} alt="Villa" />
                <div>
                  <p>Sample Villa</p>
                  <span>Rs999,000</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-Page Modal */}
      {selectedDeveloper && (
        <div className="agentlist-modal-fullpage">
          <div className="agentlist-modal-content">
            <div className="agentlist-modal-header">
              <span className="agentlist-modal-title">Developer Profile</span>
              <span className="agentlist-modal-close" onClick={closeDeveloperModal}>
                &times;
              </span>
            </div>

            <div className="agentlist-modal-profile">
              <img
                src={
                  selectedDeveloper.profileImageUrl ||
                  "https://img.freepik.com/free-photo/medium-shot-man-working-as-real-estate-agent_23-2151064999.jpg"
                }
                alt={selectedDeveloper.name}
                className="agentlist-modal-img"
              />
              <div className="agentlist-modal-info">
                <h2>
                  {selectedDeveloper.name || "Unknown Developer"}{" "}
                  <FaCheckCircle className="agentlist-verified" />
                </h2>
                <p className="agentlist-role-text">
                  Developer at Modern House Real Estate
                </p>
                <div className="agentlist-rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.round(averageRating) ? "star-filled" : "star-empty"}
                    />
                  ))}
                  <span>{averageRating} ({reviewCount} Reviews)</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="agentlist-actions">
              <a href={`mailto:${selectedDeveloper.email || "john.doe@modernhouse.com"}`}>
                <button className="agentlist-email">
                  <FaEnvelope /> Email
                </button>
              </a>
              <a href={`tel:${selectedDeveloper.mobileNumber || "9876543210"}`}>
                <button className="agentlist-call">
                  <FaPhoneAlt /> Call
                </button>
              </a>
              <a
                href={`https://wa.me/${selectedDeveloper.mobileNumber || "9876543210"}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="agentlist-whatsapp">
                  <FaWhatsappSolid /> WhatsApp
                </button>
              </a>
            </div>

            {/* Tabs */}
            <div className="agentlist-tabs">
              <span
                className={activeTab === "about" ? "active" : ""}
                onClick={() => setActiveTab("about")}
              >
                About
              </span>
              <span
                className={activeTab === "reviews" ? "active" : ""}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </span>
              <span
                className={activeTab === "listings" ? "active" : ""}
                onClick={() => setActiveTab("listings")}
              >
                Listings
              </span>
            </div>

            <div className="agentlist-tab-content">
              {activeTab === "about" && (
                <div>
                  <h3>Details</h3>
                  <p><FaBuilding /> Company: Modern House Real Estate</p>
                  <p><FaMapMarkerAlt /> Address: {selectedDeveloper.state || "Unknown"}, {selectedDeveloper.district || "Unknown"}</p>
                  <p><FaHome /> Properties: {agentListings.length || 0} listings</p>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="review-section">
                  <div className="review-header">
                    <h3>
                      <FontAwesomeIcon icon={faComment} className="comment-icon" /> {reviewCount} Reviews{' '}
                      <span>({averageRating} / 5)</span>
                    </h3>
                  </div>
                  {reviewsLoading ? (
                    <div className="loading">Loading reviews...</div>
                  ) : reviewsError ? (
                    <div className="error-message">{reviewsError}</div>
                  ) : reviews.length === 0 ? (
                    <div className="no-results">No reviews yet for this developer.</div>
                  ) : (
                    <div className="reviews-list">
                      {reviews.map((review) => (
                        <div key={review.id} className="review">
                          <div className="review-meta">
                            <div>
                              <p className="review-author">{review.user?.name || 'Anonymous'}</p>
                              <div className="review-stars">
                                {[1, 2, 3, 4, 5].map((num) => (
                                  <FontAwesomeIcon
                                    key={num}
                                    icon={num <= review.rating ? faSolidStar : faRegularStar}
                                    className="star"
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="review-date">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="review-comment">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "listings" && (
                <div className="agentlistings-container">
                  <h3>{agentListings.length} Property Listing(s)</h3>
                  {agentListings.length === 0 ? (
                    <p className="no-results">No listings found for this developer.</p>
                  ) : (
                    <div className="listing-cards">
                      {agentListings.map((property) => {
                        const propertyTypeLower = property?.type.toLowerCase();
                        const hideResidentialDetails = propertyTypeLower === "plot" || propertyTypeLower === "commercial";
                        return (
                          <Link
                            to={`/propertySell/${property.id}`}
                            key={property.id || property._id}
                            className="property-card-link"
                          >
                            <div className="property-card">
                              <div className="property-image-container">
                                <img
                                  src={property.image || villa1}
                                  alt={property.title || "Property"}
                                  className="property-card-image"
                                  onError={(e) => {
                                    e.target.src = villa1;
                                  }}
                                />
                                <span
                                  className={`property-label ${
                                    property.status
                                      ? property.status.toLowerCase().replace("_", "-")
                                      : "for-sale"
                                  }`}
                                >
                                  {property.status?.replace("_", " ") || "For Sale"}
                                </span>
                                <div className="property-overlay-icons">
                                  <span>
                                    <FontAwesomeIcon icon={faComment} />{" "}
                                    {property.reelCount || 0}
                                  </span>
                                </div>
                                <div className="property-overlay-icons-left">
                                  <div>
                                    ₹
                                    {property.price
                                      ? Number(property.price).toLocaleString("en-IN")
                                      : "N/A"}
                                    <br />
                                    <span>
                                      ₹
                                      {property.price && property.area
                                        ? Math.round(
                                            Number(property.price) / Number(property.area)
                                          )
                                        : "N/A"}
                                      /Sq Ft
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="property-card-info">
                                <h2 className="property-title">
                                  {property.title || "Untitled Property"}
                                </h2>
                                <div className="property-address">
                                  <FontAwesomeIcon icon={faMapMarkerAltSolid} />{" "}
                                  {property.address || "No Address"}
                                </div>

                                <div className="property-details">
                                  {!hideResidentialDetails && (
                                    <span>
                                      <FontAwesomeIcon icon={faBed} /> {property.bedrooms || 0}
                                    </span>
                                  )}
                                  {!hideResidentialDetails && (
                                    <span>
                                      <FontAwesomeIcon icon={faShower} />{" "}
                                      {property.bathrooms || 0}
                                    </span>
                                  )}
                                  {!hideResidentialDetails && (
                                    <span>
                                      <FontAwesomeIcon icon={faCar} /> {property.garages || 0}
                                    </span>
                                  )}
                                  <span>
                                    {property.area || "N/A"} {property.sizePostfix || "Sq Ft"}
                                  </span>
                                </div>

                                <div className="property-type">
                                  <strong>{property.type || "Unknown"}</strong>
                                </div>

                                <div className="property-footer">
                                  <span>
                                    <FontAwesomeIcon icon={faUser} />{" "}
                                    {selectedDeveloper.name || "Unknown"}
                                  </span>
                                  <span>
                                    <FontAwesomeIcon icon={faPaperclip} />{" "}
                                    {property.createdAt
                                      ? new Date(property.createdAt).toLocaleDateString()
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
}

export default Developer;