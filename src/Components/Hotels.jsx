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
  faWifi,
  faUtensils,
  faSwimmingPool,
  faDumbbell,
  faSpa,
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
import { Link2 } from "lucide-react";

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

// 🔹 Get user location
const getUserLocation = () => {
  return new Promise((resolve) => {
    try {
      const locationData = localStorage.getItem("myLocation");
      if (locationData) {
        const parsedLocation = JSON.parse(locationData);
        if (parsedLocation.latitude && parsedLocation.longitude) {
          console.log("User location retrieved from localStorage:", parsedLocation);
          return resolve({
            latitude: parsedLocation.latitude,
            longitude: parsedLocation.longitude,
          });
        }
      }
    } catch (err) {
      console.error("Error parsing myLocation:", err.message);
    }

    if (!navigator.geolocation) {
      console.error("Geolocation not supported by browser");
      return resolve(null);
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        localStorage.setItem("myLocation", JSON.stringify(location));
        console.log("User location fetched from Geolocation API:", location);
        resolve(location);
      },
      (err) => {
        console.error("Geolocation error:", err.message, "Code:", err.code);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
};

// 🔹 Calculate distance using Haversine formula
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return isNaN(distance) ? null : Number(distance.toFixed(2));
};

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Sidebar filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriceMin, setFilterPriceMin] = useState("");
  const [filterPriceMax, setFilterPriceMax] = useState("");
  const [filterRatingMin, setFilterRatingMin] = useState("");
  const [filterStarRating, setFilterStarRating] = useState("");

  // Location filters
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Searchable dropdown states
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Amenities filters
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const { hotelBanquetBaseUrl, apiPrefix } = API_CONFIG;

  // ✅ Get user location
  useEffect(() => {
    getUserLocation().then((loc) => {
      if (loc) {
        setLocation(loc);
        setLocationError(null);
        // Fetch nearby hotels when location is available
        fetchNearbyHotels(loc.latitude, loc.longitude);
      } else {
        setLocationError("Unable to fetch location. Please enable location services.");
        // Fetch all hotels if location not available
        fetchAllHotels();
      }
    });
  }, []);

  // ✅ Fetch nearby hotels
  const fetchNearbyHotels = async (lat, lng, radius = 50) => {
    try {
      setLoading(true);
      const url = `${hotelBanquetBaseUrl}/${apiPrefix}/hotels/nearby?latitude=${lat}&longitude=${lng}&radius=${radius * 1000}`;
      const response = await fetch(url);
      const text = await response.text();
      if (!response.ok) throw new Error(`Error: ${response.status} → ${text}`);

      const data = JSON.parse(text);
      if (data.success) {
        const formattedHotels = (data.data?.hotels || []).map(hotel => ({
          id: hotel._id,
          hotelId: hotel.hotelId,
          title: hotel.name || "Untitled Hotel",
          address: hotel.address || `${hotel.city || "Unknown"}, ${hotel.state || "Unknown"}`,
          imageUrls: hotel.images || [],
          status: hotel.isAvailable ? "AVAILABLE" : "UNAVAILABLE",
          description: hotel.description || "",
          contactNumber: hotel.contactNumber || "",
          alternateContact: hotel.alternateContact || "",
          email: hotel.email || "",
          website: hotel.website || "",
          city: hotel.city || "",
          state: hotel.state || "",
          pincode: hotel.pincode || "",
          latitude: hotel.location?.coordinates?.[1] || null,
          longitude: hotel.location?.coordinates?.[0] || null,
          distance: hotel.distanceValue ? (hotel.distanceValue / 1000).toFixed(2) : null,
          distanceText: hotel.distance || "",
          averageRoomPrice: hotel.averageRoomPrice || 0,
          averageRating: hotel.averageRating || 0,
          reviewCount: hotel.reviewCount || 0,
          amenities: Array.isArray(hotel.amenities) ? hotel.amenities : 
                    (typeof hotel.amenities === 'string' ? JSON.parse(hotel.amenities.replace(/^\[|\]$/g, '')) : []),
          createdAt: hotel.createdAt || new Date().toISOString(),
          registrationNumber: hotel.registrationNumber || "",
          verificationStatus: hotel.verificationStatus || "",
          ownerName: hotel.ownerName || "Hotel Management", // Added ownerName field
        }));

        // Sort by distance if available
        if (location) {
          formattedHotels.sort((a, b) => {
            if (!a.distance && !b.distance) return 0;
            if (!a.distance) return 1;
            if (!b.distance) return -1;
            return parseFloat(a.distance) - parseFloat(b.distance);
          });
        }

        setHotels(formattedHotels);
        setFilteredHotels(formattedHotels);
        extractLocationData(formattedHotels);
      } else {
        throw new Error(data.message || "Failed to fetch hotels");
      }
    } catch (err) {
      console.error("Error fetching nearby hotels:", err);
      setError(err.message);
      fetchAllHotels(); // Fallback to all hotels
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch all hotels (fallback)
  const fetchAllHotels = async () => {
    try {
      setLoading(true);
      const url = `${hotelBanquetBaseUrl}/${apiPrefix}/hotels`;
      const response = await fetch(url);
      const text = await response.text();
      if (!response.ok) throw new Error(`Error: ${response.status} → ${text}`);

      const data = JSON.parse(text);
      if (data.success && data.data?.hotels) {
        const formattedHotels = (data.data.hotels || []).map(hotel => ({
          id: hotel._id,
          hotelId: hotel.hotelId,
          title: hotel.name || "Untitled Hotel",
          address: hotel.address || `${hotel.city || "Unknown"}, ${hotel.state || "Unknown"}`,
          imageUrls: hotel.images || [],
          status: hotel.isAvailable ? "AVAILABLE" : "UNAVAILABLE",
          description: hotel.description || "",
          contactNumber: hotel.contactNumber || "",
          alternateContact: hotel.alternateContact || "",
          email: hotel.email || "",
          website: hotel.website || "",
          city: hotel.city || "",
          state: hotel.state || "",
          pincode: hotel.pincode || "",
          latitude: hotel.location?.coordinates?.[1] || null,
          longitude: hotel.location?.coordinates?.[0] || null,
          distance: null,
          distanceText: "Distance unavailable",
          averageRoomPrice: hotel.averageRoomPrice || 0,
          averageRating: hotel.averageRating || 0,
          reviewCount: hotel.reviewCount || 0,
          amenities: Array.isArray(hotel.amenities) ? hotel.amenities : 
                    (typeof hotel.amenities === 'string' ? JSON.parse(hotel.amenities.replace(/^\[|\]$/g, '')) : []),
          createdAt: hotel.createdAt || new Date().toISOString(),
          registrationNumber: hotel.registrationNumber || "",
          verificationStatus: hotel.verificationStatus || "",
          ownerName: hotel.ownerName || "Hotel Management", // Added ownerName field
        }));

        setHotels(formattedHotels);
        setFilteredHotels(formattedHotels);
        extractLocationData(formattedHotels);
      }
    } catch (err) {
      console.error("Error fetching all hotels:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Extract location data
  const extractLocationData = (hotelList) => {
    const uniqueStates = [...new Set(hotelList.map(h => h.state).filter(Boolean))].sort();
    setStates(uniqueStates);
    
    const uniqueCities = [...new Set(hotelList.map(h => h.city).filter(Boolean))].sort();
    setCities(uniqueCities);
  };

  // ✅ Apply Filters and Sort by Distance
  useEffect(() => {
    let filtered = [...hotels];

    // Search by name
    if (searchQuery) {
      filtered = filtered.filter((hotel) =>
        hotel.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filters
    if (filterPriceMin) {
      filtered = filtered.filter((hotel) => Number(hotel.averageRoomPrice) >= Number(filterPriceMin));
    }
    if (filterPriceMax) {
      filtered = filtered.filter((hotel) => Number(hotel.averageRoomPrice) <= Number(filterPriceMax));
    }

    // Rating filter
    if (filterRatingMin) {
      filtered = filtered.filter((hotel) => (hotel.averageRating || 0) >= Number(filterRatingMin));
    }

    // Location filters
    if (selectedState) {
      filtered = filtered.filter((hotel) => hotel.state?.toLowerCase() === selectedState.toLowerCase());
    }
    if (selectedCity) {
      filtered = filtered.filter((hotel) => hotel.city?.toLowerCase() === selectedCity.toLowerCase());
    }

    // Amenities filter
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter((hotel) => {
        return selectedAmenities.every(amenity => 
          hotel.amenities?.some(hotelAmenity => 
            hotelAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
      });
    }

    // Sort by distance if location available
    if (location && location.latitude && location.longitude) {
      filtered = filtered.map(hotel => ({
        ...hotel,
        calculatedDistance: hotel.latitude && hotel.longitude
          ? getDistanceFromLatLonInKm(
              location.latitude,
              location.longitude,
              hotel.latitude,
              hotel.longitude
            )
          : null
      }));

      filtered.sort((a, b) => {
        if (a.calculatedDistance === null && b.calculatedDistance === null) return 0;
        if (a.calculatedDistance === null) return 1;
        if (b.calculatedDistance === null) return -1;
        return a.calculatedDistance - b.calculatedDistance;
      });
    } else if (hotels.some(h => h.distance !== null)) {
      // Use API-provided distance
      filtered.sort((a, b) => {
        if (!a.distance && !b.distance) return 0;
        if (!a.distance) return 1;
        if (!b.distance) return -1;
        return parseFloat(a.distance) - parseFloat(b.distance);
      });
    }

    setFilteredHotels(filtered);
  }, [
    hotels, searchQuery, filterPriceMin, filterPriceMax, 
    filterRatingMin, selectedState, selectedCity, selectedAmenities, location
  ]);

  // ✅ Amenity icons mapping
  const amenityIcons = {
    'WiFi': faWifi,
    'AC': faBed,
    'Swimming Pool': faSwimmingPool,
    'Gym': faDumbbell,
    'Spa': faSpa,
    'Restaurant': faUtensils,
    'Room Service': faUtensils,
    'Parking': faCar,
    'Laundry': faShower,
    'Conference Room': faUser,
    'Garden': faMapMarkerAlt,
    'Bar': faUtensils,
    'Security': faUser,
    'Elevator': faBed,
    'Kitchen': faUtensils,
    'Balcony': faBed,
  };

  // Filter states and cities based on search
  const filteredStates = states.filter(state =>
    state.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const filteredCities = cities.filter(city =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  if (loading) return <div className="p-4">Loading hotels nearby…</div>;
  if (error) return <div className="p-4 text-danger">Error: {error}</div>;

  return (
    <div>
      {locationError && (
        <div className="p-4 text-warning bg-warning-subtle p-3 rounded mb-3">
          <span>{locationError}</span>
          <button
            className="btn btn-sm btn-outline-warning ms-2"
            onClick={() => getUserLocation().then(loc => {
              if (loc) {
                setLocation(loc);
                setLocationError(null);
                fetchNearbyHotels(loc.latitude, loc.longitude);
              }
            })}
          >
            Retry Location
          </button>
        </div>
      )}

      <div
        className="nav justify-content-center p-5"
        style={{ fontSize: "40px", fontWeight: "700", color: 'darkcyan' }}
      >
        Nearby Hotels
      </div>

      <div className="blog-main-container">
        {/* Left Section - Hotel Cards */}
        <div className="blog-left-section card-wrapper">
          {filteredHotels.length === 0 ? (
            <div className="no-properties text-center py-5">
              <h5>No hotels found matching your criteria.</h5>
              <p>Try adjusting your filters or search for hotels in a different area.</p>
            </div>
          ) : (
            filteredHotels.map((hotel) => (
              <Link
                to={`/HotelAndBanquetDetails/hotel/${hotel.hotelId}`}
                key={hotel.id}
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
                      src={getValidImage(hotel.imageUrls, fallbackImages[2], hotelBanquetBaseUrl)}
                      alt={hotel.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                      onError={(e) => (e.target.src = fallbackImages[2])}
                    />
                    {hotel.averageRating && (
                      <span
                        className="position-absolute"
                        style={{
                          top: "10px",
                          right: "10px",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          zIndex: "10",
                          backgroundColor: "#ffc107",
                          color: "#000",
                          wordBreak: "break-word",
                        }}
                      >
                        ⭐ {hotel.averageRating}
                      </span>
                    )}

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
                        ₹{hotel.averageRoomPrice
                          ? Number(hotel.averageRoomPrice).toLocaleString("en-IN")
                          : "N/A"}
                        <br />
                        <small style={{ fontSize: "0.75rem", fontWeight: "400" }}>
                          /night
                        </small>
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
                      {hotel.title}
                    </h2>
                    
                    <div
                      className="landing-location d-flex justify-content-between align-items-flex-start mb-2"
                      style={{
                        fontSize: "0.875rem",
                        color: "#4a5568",
                        flexWrap: "wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          whiteSpace: "nowrap",
                          marginRight: "8px",
                        }}
                      >
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" /> 
                        {hotel.city}, {hotel.state}
                      </span>
                      <span
                        className="distance-text fw-bold"
                        style={{
                          color: "#0e7490",
                          fontSize: "0.9rem",
                          marginLeft: "8px",
                          wordBreak: "break-word",
                        }}
                      >
                        {hotel.distance ? `${hotel.distance} km away` : "Distance unavailable"}
                      </span>
                    </div>

                    <div
                      className="landing-details mb-2"
                      style={{
                        display: "flex",
                        gap: "16px",
                        fontSize: "0.85rem",
                        color: "#4a5568",
                        flexWrap: "wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <FontAwesomeIcon icon={faComment} className="me-1" /> 
                        {hotel.reviewCount || 0} reviews
                      </span>
                      <a href={hotel.website} className="text-decoration-none d-flex" style={{ color: "#4a5568" }}>
                        <FontAwesomeIcon icon={faPaperclip} className="me-1" /> 
                        {hotel.website ? hotel.website : "N/A"}
                      </a>
                    </div>

                    <div
                      className="landing-type text-dark mb-2"
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
                      <strong>{hotel.verificationStatus === "verified" ? "✅ Verified" : "⏳ Pending"}</strong>
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
                        <FontAwesomeIcon icon={faUser} className="me-1" /> 
                        {hotel.ownerName || "Hotel Management"} {/* Display ownerName instead of contactNumber */}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <FontAwesomeIcon icon={faPaperclip} className="me-1" /> 
                        {hotel.createdAt
                          ? new Date(hotel.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Right Sidebar - Filters */}
        <div className="residential-blog-right-sidebar md:block">
          <aside className="residential">
            <div className="residential-filter">
              <h3 className="filter-title">Filter Hotels</h3>

              {/* Search by Name */}
              <div className="filter-group">
                <label className="filter-label">Search Hotels</label>
                <input
                  type="text"
                  placeholder="Enter hotel name or description"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="filter-input"
                />
              </div>

              {/* State - Searchable Dropdown */}
              <div className="filter-group position-relative">
                <label className="filter-label">State</label>
                <div 
                  className="filter-input d-flex align-items-center justify-content-between cursor-pointer"
                  onClick={() => setShowStateDropdown(!showStateDropdown)}
                >
                  <span>{selectedState || "-Select State-"}</span>
                  <span>▼</span>
                </div>
                {showStateDropdown && (
                  <div className="position-absolute w-100 bg-white border rounded shadow mt-1" style={{ zIndex: 1000, maxHeight: "300px", overflowY: "auto" }}>
                    <input
                      type="text"
                      placeholder="Search for a State..."
                      value={stateSearch}
                      onChange={(e) => setStateSearch(e.target.value)}
                      className="filter-input border-0 border-bottom"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div>
                      {filteredStates.length === 0 ? (
                        <div className="p-2 text-muted">No states found</div>
                      ) : (
                        filteredStates.map((s) => (
                          <div
                            key={s}
                            className="p-2 hover-bg-light cursor-pointer"
                            onClick={() => {
                              setSelectedState(s);
                              setShowStateDropdown(false);
                              setStateSearch("");
                            }}
                          >
                            {s}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* City - Searchable Dropdown */}
              <div className="filter-group position-relative">
                <label className="filter-label">City</label>
                <div 
                  className="filter-input d-flex align-items-center justify-content-between cursor-pointer"
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                >
                  <span>{selectedCity || "-Select City-"}</span>
                  <span>▼</span>
                </div>
                {showCityDropdown && (
                  <div className="position-absolute w-100 bg-white border rounded shadow mt-1" style={{ zIndex: 1000, maxHeight: "300px", overflowY: "auto" }}>
                    <input
                      type="text"
                      placeholder="Search for a City..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      className="filter-input border-0 border-bottom"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div>
                      {filteredCities.length === 0 ? (
                        <div className="p-2 text-muted">No cities found</div>
                      ) : (
                        filteredCities.map((c) => (
                          <div
                            key={c}
                            className="p-2 hover-bg-light cursor-pointer"
                            onClick={() => {
                              setSelectedCity(c);
                              setShowCityDropdown(false);
                              setCitySearch("");
                            }}
                          >
                            {c}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="filter-group">
                <label className="filter-label">Price Range (₹/night)</label>
                <div className="d-flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filterPriceMin}
                    onChange={(e) => setFilterPriceMin(e.target.value)}
                    className="filter-input flex-grow-1"
                    style={{ maxWidth: "80px" }}
                  />
                  <span className="align-self-center">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filterPriceMax}
                    onChange={(e) => setFilterPriceMax(e.target.value)}
                    className="filter-input flex-grow-1"
                    style={{ maxWidth: "80px" }}
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="filter-group">
                <label className="filter-label">Minimum Rating</label>
                <select
                  value={filterRatingMin}
                  onChange={(e) => setFilterRatingMin(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Any Rating</option>
                  <option value="1">1+ ⭐</option>
                  <option value="2">2+ ⭐</option>
                  <option value="3">3+ ⭐</option>
                  <option value="4">4+ ⭐</option>
                </select>
              </div>

              {/* Amenities Filter */}
              <div className="filter-group">
                <label className="filter-label">Amenities</label>
                <div className="amenities-checkboxes">
                  {['WiFi', 'AC', 'Swimming Pool', 'Gym', 'Spa', 'Restaurant', 'Parking', 'Room Service'].map((amenity) => (
                    <label key={amenity} className="d-block mb-1">
                      <input
                        type="checkbox"
                        value={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setSelectedAmenities(prev => 
                            checked 
                              ? [...prev, amenity] 
                              : prev.filter(a => a !== amenity)
                          );
                        }}
                        className="me-2"
                      />
                      <FontAwesomeIcon 
                        icon={amenityIcons[amenity] || faBed} 
                        className="me-1" 
                        style={{ fontSize: "0.8rem" }}
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>

              {/* Update Location Button */}
              {location && (
                <div className="filter-group">
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={() => fetchNearbyHotels(location.latitude, location.longitude)}
                  >
                    🔄 Update Nearby Hotels
                  </button>
                </div>
              )}

              <div className="filter-group mt-3">
                <div className="text-center">
                  <small className="text-muted">
                    Showing {filteredHotels.length} of {hotels.length} hotels
                    {location && ` within ${Math.round((filteredHotels[0]?.distance || 0) * 100) / 100} km`}
                  </small>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Additional CSS for better styling */}
      <style jsx>{`
        .cursor-pointer { cursor: pointer; }
        .hover-bg-light:hover { background-color: #f8f9fa; }
        .amenities-preview .badge {
          fontSize: 0.7rem;
          padding: 0.25rem 0.5rem;
        }
        .amenities-checkboxes {
          max-height: 200px;
          overflow-y: auto;
        }
        .amenities-checkboxes label {
          fontSize: 0.85rem;
          cursor: pointer;
        }
        .distance-text {
          background: rgba(14, 116, 144, 0.1);
          padding: 2px 6px;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}

export default Hotels;