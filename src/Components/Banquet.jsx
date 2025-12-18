import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faShower,
  faCar,
  faUser,
  faPaperclip,
  faComment,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./Properties.css";

// 🔹 Local fallback images
import Apartment from '../assets/A-1.avif';
import Apartment2 from '../assets/c-2.avif';
import Apartment3 from '../assets/apartment.avif';
import Apartment4 from '../assets/studio.jpg';
import Apartment6 from '../assets/penthouse.avif';
import Apartment7 from '../assets/villa.avif';

const fallbackImages = [Apartment, Apartment2, Apartment3, Apartment4, Apartment6, Apartment7];

const API_CONFIG = {
  hotelBanquetBaseUrl: 'https://hotel-banquet.nearprop.in',
  apiPrefix: 'api',
};

// 🔹 Helper function to pick first valid image
const getValidImage = (images, fallback, baseUrl = "") => {
  if (!Array.isArray(images) || images.length === 0) return fallback;
  const validImg = images.find(
    img => img && img.trim() !== "" && !img.toLowerCase().includes("white")
  );
  return validImg ? (validImg.startsWith("http") ? validImg : `${baseUrl}${validImg}`) : fallback;
};

function Banquet() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sidebar filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriceMin, setFilterPriceMin] = useState("");
  const [filterPriceMax, setFilterPriceMax] = useState("");
  const [filterCapacity, setFilterCapacity] = useState("");
  const [filterType, setFilterType] = useState("");

  // 🔹 Location filters
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const { hotelBanquetBaseUrl, apiPrefix } = API_CONFIG;

  // ✅ Fetch banquet properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const url = `${hotelBanquetBaseUrl}/${apiPrefix}/banquet-halls`;
        const response = await fetch(url);
        const text = await response.text();
        if (!response.ok) throw new Error(`Error: ${response.status} → ${text}`);

        const data = JSON.parse(text);
        const banquetProperties = (data.data?.banquetHalls || []).map(hall => ({
          id: hall.banquetHallId || hall._id,
          title: hall.name || "Untitled Banquet Hall",
          address: `${hall.city || "Unknown"}, ${hall.state || "Unknown"}`,
          imageUrls: hall.images || [],
          status: hall.isAvailable ? "AVAILABLE" : "UNAVAILABLE",
          reelCount: hall.reelCount || 0,
          price: hall.pricing?.event || 0,
          area: hall.area || 0,
          capacity: hall.capacity || 0,
          parking: hall.parking?.spaces || 0,
          sizePostfix: "Sq Ft",
          type: "Banquet Hall",
          owner: { name: hall.owner?.name || "Unknown" },
          createdAt: hall.createdAt || new Date().toISOString(),
          state: hall.state || "",
          district: hall.district || "",
          city: hall.city || "",
        }));

        setProperties(banquetProperties);
        setFilteredProperties(banquetProperties);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [hotelBanquetBaseUrl, apiPrefix]);

  // ✅ Fetch districts/states/cities
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await axios.get(`${hotelBanquetBaseUrl}/${apiPrefix}/locations`);
        const districtsData = res.data?.locations || [];
        setDistricts(districtsData);

        const uniqueStates = [...new Set(districtsData.map((d) => d.state))];
        setStates(uniqueStates);

        const uniqueCities = [
          ...new Set(districtsData.map((d) => d.city).filter(Boolean)),
        ];
        setCities(uniqueCities);
      } catch (err) {
        console.error("Failed to load location data:", err.message);
      }
    };
    fetchDistricts();
  }, [hotelBanquetBaseUrl, apiPrefix]);

  // ✅ Update filtered districts when state changes
  useEffect(() => {
    if (selectedState) {
      const filtered = districts.filter((d) => d.state === selectedState);
      setFilteredDistricts(filtered);
      setSelectedDistrict("");
      setSelectedCity("");
    } else {
      setFilteredDistricts([]);
      setSelectedDistrict("");
      setSelectedCity("");
    }
  }, [selectedState, districts]);

  // ✅ Apply Filters
  const applyFilters = () => {
    let filtered = [...properties];

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterPriceMin) {
      filtered = filtered.filter((p) => Number(p.price) >= Number(filterPriceMin));
    }

    if (filterPriceMax) {
      filtered = filtered.filter((p) => Number(p.price) <= Number(filterPriceMax));
    }

    if (filterCapacity) {
      filtered = filtered.filter((p) => Number(p.capacity) >= Number(filterCapacity));
    }

    if (filterType) {
      filtered = filtered.filter(
        (p) => p.type?.toLowerCase() === filterType.toLowerCase()
      );
    }

    // 🔹 Location filters
    if (selectedState) {
      filtered = filtered.filter((p) => p.state === selectedState);
    }
    if (selectedDistrict) {
      filtered = filtered.filter((p) => p.district === selectedDistrict);
    }
    if (selectedCity) {
      filtered = filtered.filter((p) => p.city === selectedCity);
    }

    setFilteredProperties(filtered);
  };

  if (loading) return <div className="p-4">Loading banquet halls…</div>;
  if (error) return <div className="p-4 text-danger">Error: {error}</div>;

  return (
    <div>
      <div
        className="nav justify-content-center p-5"
        style={{ fontSize: "40px", fontWeight: "700", color: 'darkcyan' }}
      >
        Banquet Halls
      </div>

      <div className="blog-main-container">
        {/* Left Section */}
        <div className="blog-left-section card-wrapper">
          {filteredProperties.map((property) => (
            <Link
              to={`/HotelAndBanquetDetails/banquet/${property.id}`}
              key={property.id}
              className="property-card-link"
            >
              <div
                className="landing-property-card"
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                }}
              >
                <div
                  className="landing-image-container"
                  style={{
                    position: "relative",
                    height: "200px",
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={getValidImage(property.imageUrls, fallbackImages[1], hotelBanquetBaseUrl)}
                    alt={property.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                    onError={(e) => (e.target.src = fallbackImages[1])}
                  />
                  {/* <span
                    className={`landing-label landing-${
                      property.status
                        ? property.status.toLowerCase().replace("_", "-")
                        : "available"
                    }`}
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: "bold",
                      zIndex: 10,
                      backgroundColor: property.status === "AVAILABLE" ? "#28a745" : "#dc3545",
                      color: "white"
                    }}
                  >
                    {property.status?.replace("_", " ") || "Available"}
                  </span>
                  <div className="landing-overlay-icons">
                    <span>
                      <FontAwesomeIcon icon={faComment} />{" "}
                      {property.reelCount || 0}
                    </span>
                  </div> */}
                  <div
                    className="landing-overlay-icons-left"
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      left: "12px",
                      background: "rgba(0,0,0,0.7)",
                      color: "#ffffff",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      wordBreak: "break-word",
                    }}
                  >
                    <div>
                      ₹
                      {property.price
                        ? Number(property.price).toLocaleString("en-IN")
                        : "N/A"}
                      <br />
                      <span style={{ fontSize: "0.75rem", fontWeight: "400" }}>
                        /event
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="landing-property-info"
                  style={{
                    padding: "16px",
                    flexGrow: "1",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    wordBreak: "break-word",
                  }}
                >
                  <h2
                    className="landing"
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#1a202c",
                      margin: "0 0 10px",
                      lineHeight: "1.4",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                      wordBreak: "break-word",
                    }}
                  >
                    {property.title || "Untitled Banquet Hall"}
                  </h2>
                  <div
                    className="landing-location"
                    style={{
                      fontSize: "0.875rem",
                      color: "#4a5568",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0",
                      marginBottom: "12px",
                      flexWrap: "wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        whiteSpace: "nowrap",
                        marginRight: "8px", /* Gap between icon and address */
                      }}
                    >
                      <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
                      {property.address || "No Address"}
                    </span>
                  </div>

                  <div
                    className="landing-details"
                    style={{
                      display: "flex",
                      gap: "16px",
                      fontSize: "0.875rem",
                      color: "#4a5568",
                      marginBottom: "12px",
                      flexWrap: "wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <FontAwesomeIcon icon={faUser} /> {property.capacity || 0} Guests
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <FontAwesomeIcon icon={faCar} /> {property.parking || 0}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {property.area || "N/A"} {property.sizePostfix || "Sq Ft"}
                    </span>
                  </div>

                  <div
                    className="landing-type text-dark"
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#3182ce",
                      marginBottom: "12px",
                      textTransform: "capitalize",
                      display: "flex",
                      alignItems: "center",
                      wordBreak: "break-word",
                    }}
                  >
                    <strong>{property.type || "Banquet Hall"}</strong>
                  </div>

                  <div
                    className="landing-footer"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.75rem",
                      color: "#718096",
                      borderTop: "1px solid #e2e8f0",
                      paddingTop: "12px",
                      flexWrap: "wrap",
                      gap: "10px",
                      wordBreak: "break-word",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <FontAwesomeIcon icon={faUser} />{" "}
                      {property.owner?.name || "Unknown"}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <FontAwesomeIcon icon={faPaperclip} />{" "}
                      {property.createdAt
                        ? new Date(property.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="residential-blog-right-sidebar md:block">
          <aside className="residential">
            <div className="residential-filter">
              <h3 className="filter-title">Filter Banquet Halls</h3>

              {/* 🔹 Location Filters */}
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

              <div className="filter-group">
                <label className="filter-label">City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Cities</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Existing Filters */}
              <div className="filter-group">
                <label className="filter-label">Search by Name</label>
                <input
                  type="text"
                  placeholder="Enter banquet hall name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Min Price per Event (₹)</label>
                <input
                  type="number"
                  placeholder="e.g., 50000"
                  value={filterPriceMin}
                  onChange={(e) => setFilterPriceMin(e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Max Price per Event (₹)</label>
                <input
                  type="number"
                  placeholder="e.g., 500000"
                  value={filterPriceMax}
                  onChange={(e) => setFilterPriceMax(e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Minimum Capacity (Guests)</label>
                <select
                  value={filterCapacity}
                  onChange={(e) => setFilterCapacity(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Any</option>
                  <option value="50">50+</option>
                  <option value="100">100+</option>
                  <option value="200">200+</option>
                  <option value="500">500+</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Property Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Types</option>
                  <option value="banquet hall">Banquet Hall</option>
                </select>
              </div>

              <button className="filter-button" onClick={applyFilters}>
                Apply Filters
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Banquet;