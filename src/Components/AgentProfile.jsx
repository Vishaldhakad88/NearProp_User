import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaStar,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaBuilding,
  FaHome,
} from "react-icons/fa";

const baseUrl = "https://api.nearprop.com";
const apiPrefix = "api";

function AgentProfile() {
  const { id } = useParams(); // 🧠 agent ID from URL
  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);

  const getToken = () => {
    const authData = JSON.parse(localStorage.getItem("authData"));
    return authData?.token;
  };

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const token = getToken();
        const res = await fetch(`${baseUrl}/${apiPrefix}/v1/admin/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        setAgent(data.data);
      } catch (err) {
        console.error("Error fetching agent:", err);
      }
    };

    const fetchAgentProperties = async () => {
      try {
        const token = getToken();
        const res = await fetch(
          `${baseUrl}/${apiPrefix}/v1/properties?agentId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        setProperties(data.data || []);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    fetchAgentData();
    fetchAgentProperties();
  }, [id]);

  if (!agent) return <p>Loading profile...</p>;

  return (
    <div className="agent-profile-page" style={{ padding: "20px" }}>
      <h2>{agent.name} <FaCheckCircle color="green" /></h2>
      <img
        src={
          agent.profileImageUrl ||
          "https://img.freepik.com/free-photo/medium-shot-man-working-as-real-estate-agent_23-2151064999.jpg"
        }
        alt="Agent"
        style={{ width: "200px", borderRadius: "8px" }}
      />
      <p><FaPhoneAlt /> <a href={`tel:${agent.mobileNumber}`}>{agent.mobileNumber}</a></p>
      <p><FaEnvelope /> <a href={`mailto:${agent.email}`}>{agent.email}</a></p>
      <p><FaBuilding /> Company: Modern House Real Estate</p>
      <p><FaMapMarkerAlt /> Location: California</p>
      <p><FaHome /> Listings: {properties.length}</p>

      <h3 style={{ marginTop: "30px" }}>Properties Listed by {agent.name}</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {properties.map((property) => (
          <div
            key={property.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "6px",
              width: "300px",
              padding: "10px",
            }}
          >
            <img
              src={property.coverImageUrl}
              alt={property.title}
              style={{ width: "100%", height: "180px", objectFit: "cover" }}
            />
            <h4>{property.title}</h4>
            <p>{property.location}</p>
            <p>Price: ₹{property.price}</p>
            <p>Bedrooms: {property.bedrooms}</p>
            <p>Bathrooms: {property.bathrooms}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AgentProfile;
