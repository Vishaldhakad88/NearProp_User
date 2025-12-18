import React from "react";
import "./BedsSection.css";

const BedsSection = ({ beds = [], onEdit, onDelete }) => (
  <div className="beds-grid-container">
    {beds.length > 0 ? (
      beds.map((bed, index) => (
        <div className="bed-card-wrapper" key={bed.id || index}>
          <div className="bed-card">
            {/* Image */}
            <div className="bed-image-container">
              {bed.image ? (
                <img
                  src={
                    bed.image.startsWith("http")
                      ? bed.image
                      : `https://pg-hostel.nearprop.com/${bed.image}`
                  }
                  alt={bed.type || "Bed"}
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/300x200?text=No+Image")
                  }
                />
              ) : (
                <div className="no-image">No Image</div>
              )}

              <span
                className={`bed-status ${
                  bed.availability === "Available"
                    ? "status-available"
                    : bed.availability === "Occupied"
                    ? "status-occupied"
                    : "status-other"
                }`}
              >
                {bed.availability || "N/A"}
              </span>

              <div className="bed-price">
                ₹{(bed.price || 0).toLocaleString("en-IN")}
                <span>/mo</span>
              </div>
            </div>

            {/* Info */}
            <div className="bed-info">
              <h3>{bed.type || "Unnamed Bed"}</h3>
              <p className="bed-description">
                {bed.description || "No description provided."}
              </p>

              <div className="bed-details">
                <span>Type: {bed.type || "N/A"}</span>
                <span>Size: {bed.size || "N/A"}</span>
              </div>

              {/* Action Buttons */}
              <div className="bed-actions">
                <button
                  className="btn edit-btn"
                  onClick={() => onEdit && onEdit(bed.id)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn delete-btn"
                  onClick={() => onDelete && onDelete(bed.id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="no-beds-text">No beds available.</p>
    )}
  </div>
);

export default BedsSection;
