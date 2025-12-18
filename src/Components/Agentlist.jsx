
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaWhatsapp,
  FaBuilding,
  FaMapMarkerAlt,
  FaHome,
  FaStar,
  FaCheckCircle,
  FaGlobe,
} from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Agentlist.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_CONFIG = {
  baseUrl: "https://api.nearprop.com",
  apiPrefix: "api",
};

// Updated agentsData with 5 agents
const agentsData = [
  {
    id: 1,
    name: "Barsha Kumari",
    role: "District Manager (Munger)",
    mobile: "9031638013, 9031638014",
    email: "munger@nearprop.com",
    rating: 4.5,
    reviews: 0,
    company: "Nearprop Pvt Ltd",
    website: "nearprop.com",
    address: "Ambedkar Chowk, Sitakund Road, Dariyapur, Munger, Bihar - 811202",
    state: "Bihar",
    district: "Munger",
    listings: 0,
    description: "Barsha Kumari is a dedicated District Manager serving the Munger area with expertise in property management.",
    img: "/IMG-20250824-WA0013.jpg",
  },
  {
    id: 2,
    name: "Kishalaya Mittlankar",
    role: "District Manager (Purnia)",
    mobile: "9031638017, 9031638018",
    email: "purnia@nearprop.com",
    rating: 4.0,
    reviews: 0,
    company: "Nearprop Pvt Ltd",
    website: "nearprop.com",
    address: "456 Central Avenue, Purnia, Bihar, India",
    state: "Bihar",
    district: "Purnia",
    listings: 0,
    description: "Kishalaya Mittlankar manages properties across Purnia, offering comprehensive real estate services.",
    img: "/jjj.jpg",
  },
  {
    id: 3,
    name: "Sonu Kumar",
    role: "District Manager (Lakhisarai)",
    mobile: "9031638011, 9031638012",
    email: "lakhisarai@nearprop.com",
    rating: 4.2,
    reviews: 0,
    company: "Nearprop Pvt Ltd",
    website: "nearprop.com",
    address: "Gadi Bishanpur, Near Buddha Hotel, Lakhisarai, Bihar - 811311",
    state: "Bihar",
    district: "Lakhisarai",
    listings: 0,
    description: "Sonu Kumar is a skilled District Manager focused on delivering top-notch property solutions in Lakhisarai.",
    img: "/IMG-20250823-WA0003.jpg",
  },
  {
    id: 4,
    name: "Chowdhury Md Irshad Alam",
    role: "District Manager (Begusarai)",
    mobile: "9031638019, 9031638020",
    email: "begusarai@nearprop.com",
    rating: 4.3,
    reviews: 0,
    company: "Nearprop Pvt Ltd",
    website: "nearprop.com",
    address: "Phool Chowk, Beside of Iqra Public School, Lakhminia, Ballia, Begusarai, Bihar - 851211",
    state: "Bihar",
    district: "Begusarai",
    listings: 0,
    description: "Chowdhury Md Irshad Alam provides expert property management services in Begusarai.",
    img: "/DS 99628.jpg",
  },
  {
    id: 5,
    name: "Kishalaya Mittlankar",
    role: "District Manager (Saharsa)",
    mobile: " 9031638015, 9031638016",
    email: "saharsa@nearprop.com",
    rating: 4.0,
    reviews: 0,
    company: "Nearprop Pvt Ltd",
    website: "nearprop.com",
    address: "Ward No. 18/32, Gokul Chowk, Gangjala, Saharsa, Bihar - 852201",
    state: "Bihar",
    district: "Saharsa",
    listings: 0,
    description: "Kishalaya Mittlankar manages properties across Saharsa, offering comprehensive real estate services.",
    img: "/jjj.jpg",
  },
];

const getToken = () => {
  try {
    const authData = localStorage.getItem("authData");
    if (!authData) {
      console.warn("No authData found in localStorage");
      return null;
    }
    const parsedData = JSON.parse(authData);
    const token = parsedData.token || null;
    console.log("Retrieved token:", token ? "Token exists" : "No token found");
    return token;
  } catch (err) {
    console.error("Error parsing authData:", err.message);
    return null;
  }
};

function Agentlist() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketFormData, setTicketFormData] = useState({
    email: "",
    message: "",
  });
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [showNumberOptions, setShowNumberOptions] = useState(false);
  const [optionType, setOptionType] = useState("");

  // Slider settings for mobile view
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: "0px",
  };

  useEffect(() => {
    const fetchDistricts = async () => {
      setIsLoading(true);
      try {
        const token = getToken();
        if (!token) throw new Error("No authentication token found. Please log in.");
        const response = await axios.get(
          `${API_CONFIG.baseUrl}/${API_CONFIG.apiPrefix}/property-districts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const districtsData = response.data || [];
        setDistricts(districtsData);

        const uniqueStates = [...new Set(districtsData.map((item) => item.state))].sort();
        setStates(uniqueStates);
        setFilteredDistricts([]);
      } catch (err) {
        console.error("Error fetching districts:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (selectedState) {
      const filtered = districts.filter((district) => district.state === selectedState);
      setFilteredDistricts(filtered);
      setSelectedDistrict("");
    } else {
      setFilteredDistricts([]);
      setSelectedDistrict("");
    }
  }, [selectedState, districts]);

  // Filter agents and adjust displayed district based on selectedDistrict
  const filteredAgents = agentsData.map((agent) => {
    const agentDistricts = agent.district.split(", ").map((d) => d.trim());
    return {
      ...agent,
      displayDistrict: selectedDistrict
        ? agentDistricts.includes(selectedDistrict)
          ? selectedDistrict
          : agent.district
        : agent.district,
    };
  }).filter((agent) => {
    const agentDistricts = agent.district.split(", ").map((d) => d.trim());
    return (
      (selectedState ? agent.state === selectedState : true) &&
      (selectedDistrict ? agentDistricts.includes(selectedDistrict) : true)
    );
  });

  const handleTicketChange = (e) => {
    const { name, value } = e.target;
    setTicketFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setTicketSubmitting(true);
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found.");
      await axios.post(
        `${API_CONFIG.baseUrl}/${API_CONFIG.apiPrefix}/complaints`,
        {
          email: ticketFormData.email,
          message: ticketFormData.message,
          managerId: selectedAgent.id,
          managerEmail: selectedAgent.email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Ticket raised successfully!");
      setTicketFormData({ email: "", message: "" });
    } catch (err) {
      toast.error("Failed to raise ticket. Please try again.");
    } finally {
      setTicketSubmitting(false);
    }
  };

  return (
    <>
      <section className="hrtc-agents-section">
        <h2 className="hrtc-section-title">Meet Our District Managers</h2>
        <p className="hrtc-section-subtitle">
          {/* Filter managers by <b>State</b> & <b>District</b> */}
        </p>

        {/* Search Bar */}
        {/* <div className="agentlist-searchbar">
          {isLoading && <div className="text-blue-600 text-sm mb-2">Loading states and districts...</div>}
          <select
            className="search-select"
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedDistrict("");
            }}
            disabled={isLoading}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <select
            className="search-select"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={!selectedState || isLoading}
          >
            <option value="">Select District</option>
            {filteredDistricts.map((district) => (
              <option key={district.id} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
          <button className="my-search-btn" disabled={isLoading}>
            Search
          </button>
        </div> */}

        {/* Desktop / Tablet layout (all cards in a grid) */}
        <div className="agentlist-cards desktop-view">
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent) => (
              <div key={agent.id} className="hrtc-agent-card">
                <img src={agent.img} alt={agent.name} className="hrtc-agent-img" />
                <h3 className="hrtc-agent-name">{agent.name}</h3>
                <p className="hrtc-agent-role">{agent.role}</p>
                <p className="hrtc-agent-desc">{agent.description}</p>
                <p className="hrtc-agent-district">District: {agent.displayDistrict}</p>
                <button
                  className="hrtc-view-profile"
                  onClick={() => {
                    setSelectedAgent({ ...agent, displayDistrict: agent.displayDistrict });
                    setActiveTab("about");
                  }}
                >
                  View Profile
                </button>
              </div>
            ))
          ) : (
            <p className="no-results">No managers found for the selected filters.</p>
          )}
        </div>

        {/* Mobile slider */}
        <div className="mobile-slider">
          <Slider {...sliderSettings}>
            {filteredAgents.map((agent) => (
              <div key={agent.id} className="hrtc-agent-card">
                <img src={agent.img} alt={agent.name} className="hrtc-agent-img" />
                <h3 className="hrtc-agent-name">{agent.name}</h3>
                <p className="hrtc-agent-role">{agent.role}</p>
                <p className="hrtc-agent-desc">{agent.description}</p>
                <p className="hrtc-agent-district">District: {agent.displayDistrict}</p>
                <button
                  className="hrtc-view-profile"
                  onClick={() => {
                    setSelectedAgent({ ...agent, displayDistrict: agent.displayDistrict });
                    setActiveTab("about");
                  }}
                >
                  View Profile
                </button>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Modal */}
      {selectedAgent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="modal-close" onClick={() => setSelectedAgent(null)}>
              &times;
            </span>
            <h2 className="modal-title">Manager Profile</h2>
            <div className="modal-profile">
              <img src={selectedAgent.img} alt={selectedAgent.name} className="modal-img" />
              <div className="modal-info">
                <h3 className="modal-name">
                  {selectedAgent.name} <FaCheckCircle className="verified-icon" />
                </h3>
                <p className="modal-role">{selectedAgent.role}</p>
                <p className="modal-email">{selectedAgent.email}</p>
                <div className="modal-rating">
                  {Array.from({ length: Math.floor(selectedAgent.rating) }).map((_, i) => (
                    <FaStar key={i} className="star-icon" />
                  ))}
                  {selectedAgent.rating % 1 !== 0 && <FaStar className="star-icon half" />}
                  <span className="rating-text">
                    {selectedAgent.rating} ({selectedAgent.reviews} Review{selectedAgent.reviews > 1 ? "s" : ""})
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <a href={`mailto:${selectedAgent.email}`} className="action-btn email-btn">
                <FaEnvelope /> Email
              </a>
              <button className="action-btn call-btn" onClick={() => { setOptionType("call"); setShowNumberOptions(true); }}>
                <FaPhoneAlt /> Call
              </button>
              <button className="action-btn whatsapp-btn" onClick={() => { setOptionType("whatsapp"); setShowNumberOptions(true); }}>
                <FaWhatsapp /> WhatsApp
              </button>
            </div>
            <div className="modal-tabs">
              <span
                className={`tab-item ${activeTab === "about" ? "active" : ""}`}
                onClick={() => setActiveTab("about")}
              >
                About
              </span>
              <span
                className={`tab-item ${activeTab === "reviews" ? "active" : ""}`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </span>
              <span
                className={`tab-item ${activeTab === "ticket" ? "active" : ""}`}
                onClick={() => setActiveTab("ticket")}
              >
                Raise Ticket
              </span>
            </div>
            <div className="modal-tab-content">
              {activeTab === "about" && (
                <div className="about-section">
                  <h4>Details</h4>
                  <p>
                    <FaBuilding className="icon" /> Company: {selectedAgent.company}
                  </p>
                  <p>
                    <FaGlobe className="icon" /> Website:{" "}
                    <a href={`https://${selectedAgent.website}`} target="_blank" rel="noopener noreferrer">
                      {selectedAgent.website}
                    </a>
                  </p>
                  <p>
                    <FaMapMarkerAlt className="icon" /> Address:{" "}
                    {selectedAgent.address.replace(
                      /Saharsa|Purnia|Munger|Lakhisarai|Begusarai/,
                      selectedAgent.displayDistrict
                    )}
                  </p>
                  <p>
                    <FaHome className="icon" /> Properties: {selectedAgent.listings} listings
                  </p>
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="reviews-section">
                  <h4>Reviews</h4>
                  {selectedAgent.reviews > 0 ? (
                    <p>{selectedAgent.reviews} customer review(s) available.</p>
                  ) : (
                    <>
                      <p className="no-reviews">No reviews yet. Be the first to leave one!</p>
                      <div className="review-placeholder">
                        <p>We value your feedback. Share your experience with {selectedAgent.name}.</p>
                      </div>
                    </>
                  )}
                </div>
              )}
              {activeTab === "ticket" && (
                <div className="ticket-section">
                  <h4>Raise a Ticket</h4>
                  <form onSubmit={handleTicketSubmit} className="ticket-form">
                    <input
                      type="email"
                      name="email"
                      value={ticketFormData.email}
                      onChange={handleTicketChange}
                      placeholder="Your Email"
                      required
                      className="form-input"
                    />
                    <textarea
                      name="message"
                      value={ticketFormData.message}
                      onChange={handleTicketChange}
                      placeholder="Your Message"
                      rows="2"
                      required
                      className="form-textarea"
                    ></textarea>
                    <button type="submit" className="submit-btn" disabled={ticketSubmitting}>
                      {ticketSubmitting ? "Submitting..." : "Submit Ticket"}
                    </button>
                  </form>
                </div>
              )}
            </div>
            {showNumberOptions && (
              <div className="number-options-overlay">
                <div className="number-options-content">
                  <span className="modal-close" onClick={() => setShowNumberOptions(false)}>
                    &times;
                  </span>
                  <h4>Select {optionType.charAt(0).toUpperCase() + optionType.slice(1)} Number</h4>
                  <div className="number-options-list">
                    {selectedAgent.mobile.split(", ").map((num, index) => (
                      <a
                        key={index}
                        href={optionType === "call" ? `tel:${num}` : `https://wa.me/${num}`}
                        className="number-option-btn"
                      >
                        {num}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
}

export default Agentlist;
