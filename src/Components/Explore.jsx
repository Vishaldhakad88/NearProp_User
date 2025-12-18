import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faHeart as faHeartSolid,
  faHeart as faHeartRegular,
  faHome,
  faRulerCombined,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const API_CONFIG = {
  baseUrl: "https://api.nearprop.com",
  apiPrefix: "api",
};


// Get auth token from localStorage
const getToken = () => {
  try {
    const authData = localStorage.getItem('authData');
    if (!authData) {
      console.error('No authData found in localStorage');
      return null;
    }
    const parsedData = JSON.parse(authData);
    return { token: parsedData.token || null, userId: parsedData.userId || null };
  } catch (err) {
    console.error('Error parsing authData:', err.message);
    return null;
  }
};

// Get user location from localStorage
const getUserLocation = () => {
  try {
    const locationData = localStorage.getItem('myLocation');
    if (!locationData) {
      console.error('No myLocation found in localStorage');
      return null;
    }
    const parsedLocation = JSON.parse(locationData);
    if (!parsedLocation.latitude || !parsedLocation.longitude) {
      console.error('Invalid myLocation data: missing latitude or longitude');
      return null;
    }
    console.log('User location retrieved:', parsedLocation);
    return {
      latitude: parsedLocation.latitude,
      longitude: parsedLocation.longitude,
    };
  } catch (err) {
    console.error('Error parsing myLocation:', err.message);
    return null;
  }
};

// Calculate distance between two coordinates
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function Explore() {
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const auth = getToken();
        const headers = {
          'Content-Type': 'application/json',
          ...(auth?.token && { Authorization: `Bearer ${auth.token}` }),
        };

        const response = await fetch(
          `${API_CONFIG.baseUrl}/${API_CONFIG.apiPrefix}/properties?page=0&size=10&sortBy=createdAt&direction=DESC`,
          { headers }
        );

        if (!response.ok) throw new Error(`Failed: ${response.status}`);
        const data = await response.json();
        const propertiesData = data.content || data.data || [];

        const formattedProperties = propertiesData
          .filter((property) => property.active === true)
          .map((property) => ({
            id: property.id,
            title: property.title || "Untitled Property",
            type: property.type || "Property",
            price: property.price
              ? `₹${property.price.toLocaleString("en-IN")}`
              : "Price on Request",
            area: property.area
              ? `${property.area} ${property.sizePostfix || "sq.ft."}`
              : "N/A",
            address: property.address || "Location not specified",
            city: property.city || "N/A",
            latitude: property.latitude || null,
            longitude: property.longitude || null,
            owner: { name: property.owner?.name || "Unknown Agent" },
            imageUrls:
              property.imageUrls?.length > 0
                ? property.imageUrls
                : '',
            featured: property.featured || false,
            favorite: false,
            approved: property.approved || true,
            active: property.active,
            status: property.status || "Active",
          }));

        setAllProperties(formattedProperties);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAllProperties();
  }, []);

  const handleToggleFavorite = async (e, id, isFavorite) => {
    e.preventDefault();
    e.stopPropagation();
    const auth = getToken();
    if (!auth?.token) {
      setError('Please log in to manage favorites');
      navigate('/login', { state: { from: `/propertySell/${id}` } });
      return;
    }

    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await fetch(`${API_CONFIG.baseUrl}/${API_CONFIG.apiPrefix}/favorites/${id}`, {
        method,
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle favorite: ${response.status}`);
      }

      setAllProperties(
        allProperties.map((p) =>
          p.id === id ? { ...p, favorite: !isFavorite } : p
        )
      );
    } catch (err) {
      console.error('Toggle Favorite error:', err.message);
      setError(err.message);
    }
  };

  const getStatus = (property) => {
    if (!property.approved) return "Pending Verification";
    if (!property.active) return "Expired";
    if (property.status === "SOLD") return "Sold";
    return "Active";
  };

  const getTags = (property) => {
    const tags = [];
    if (property.approved) tags.push("Aadhaar Verified");
    if (property.active) tags.push("Subscription Active");
    else tags.push("Subscription Expired");
    if (property.status === "SOLD") tags.push("Sold");
    if (!property.approved) tags.push("Not Aadhaar Verified");
    if (property.featured) tags.push("Featured");
    return tags;
  };

  // Check if user location is available
  const userLocation = getUserLocation();

  if (!userLocation && !loading && !error) {
    return (
      <div style={{ padding: "40px 20px", background: "#f2f4f8", textAlign: "center" }}>
        <p style={{ color: "#d97706", fontSize: "18px" }}>
          Please enable location access in your browser to view distances to properties.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px", background: "#f2f4f8" }}>
      <h2 style={{ textAlign: "center", fontSize: 32, color: "darkcyan" }}>
        Explore Properties
      </h2>
      <p style={{ textAlign: "center", maxWidth: 800, margin: "10px auto" }}>
        Discover premium homes, apartments, and commercial spaces designed for
        your lifestyle and business needs.
      </p>

      {loading && <p style={{ textAlign: "center", padding: "20px", color: "red" }}>Loading...</p>}
      {error && <p style={{ textAlign: "center", padding: "20px", color: "red" }}>{error}</p>}
      {!loading && !error && allProperties.length === 0 && (
        <p style={{ textAlign: "center", padding: "20px" }}>No properties found.</p>
      )}
      {!loading && !error && allProperties.length > 0 && (
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          loop
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 15 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1200: { slidesPerView: 3, spaceBetween: 25 },
          }}
          style={{ padding: "40px 0" }}
        >
          {allProperties.map((property) => {
            const status = getStatus(property);
            const tags = getTags(property);
            return (
              <SwiperSlide key={property.id}>
                <Link
                  to={`/propertySell/${property.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      overflow: "hidden",
                      boxShadow: "0 6px 25px rgba(0,0,0,0.12)",
                      cursor: "pointer",
                      position: "relative",
                      minHeight: 450,
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.02)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    {/* Image */}
                    <div style={{ position: "relative", height: 260 }}>
                      <img
                        src={property?.imageUrls[0] || ""}
                        alt={property.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      
                      />
                      {/* Price box */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 10,
                          left: 10,
                          background: "rgba(0,0,0,0.7)",
                          color: "#fff",
                          padding: "6px 12px",
                          borderRadius: 6,
                          fontWeight: "bold",
                        }}
                      >
                        {property.price}
                      </div>
                      {/* Favorite Icon */}
                      {/* <div
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          cursor: "pointer",
                        }}
                        onClick={(e) => handleToggleFavorite(e, property.id, property.favorite)}
                      >
                        <FontAwesomeIcon
                          icon={property.favorite ? faHeartSolid : faHeartRegular}
                          style={{ color: property.favorite ? "red" : "white" }}
                        />
                      </div> */}
                    </div>

                    {/* Details */}
                    <div style={{ padding: 16, flex: 1 }}>
                      <h3 style={{ fontSize: 20, fontWeight: "600", marginBottom: 6 }}>
                        {property.title}
                      </h3>
                      <p style={{ fontSize: 14, color: "#777", marginBottom: 12 }}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} /> {property.address}, {property.city}
                        <span style={{ fontWeight: "bold", color: "#0e7490" }}>
                          {userLocation && property.latitude && property.longitude
                            ? ` - ${getDistanceFromLatLonInKm(
                                userLocation.latitude,
                                userLocation.longitude,
                                property.latitude,
                                property.longitude
                              ).toFixed(2)} km away`
                            : " - Distance unavailable"}
                        </span>
                      </p>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 8,
                          fontSize: 13,
                          color: "#444",
                        }}
                      >
                        <span>
                          <FontAwesomeIcon icon={faHome} /> {property.type}
                        </span>
                        <span>
                          <FontAwesomeIcon icon={faUser} /> {property.owner.name}
                        </span>
                        <span>
                          <FontAwesomeIcon icon={faRulerCombined} /> {property.area}
                        </span>
                        <span>
                          <FontAwesomeIcon icon={faMapMarkerAlt} /> {property.city}
                        </span>
                      </div>

                      <div
                        style={{
                          marginTop: 12,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                        }}
                      >
                        {tags.map((tag, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: "#eef3f7",
                              padding: "4px 10px",
                              borderRadius: 6,
                              fontSize: 12,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
}

export default Explore;