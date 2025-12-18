import React from "react";
import "./RoomsSection.css";

const RoomsSection = ({ rooms = [], onEdit, onDelete }) => (
  <div className="rooms-grid-container">
    {rooms.length > 0 ? (
      rooms.map((room, index) => (
        <div className="room-card-wrapper" key={room.id || index}>
          <div className="room-card">
            {/* Image */}
            <div className="room-image-container">
              {room.images && room.images.length > 0 ? (
                <img
                  src={
                    room.images[0].startsWith("http")
                      ? room.images[0]
                      : `https://pg-hostel.nearprop.com/${room.images[0]}`
                  }
                  alt={room.title || "Room"}
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/300x200?text=No+Image")
                  }
                />
              ) : (
                <div className="no-image">No Image</div>
              )}

              <span
                className={`room-status ${
                  room.availability === "Available"
                    ? "status-available"
                    : room.availability === "Occupied"
                    ? "status-occupied"
                    : "status-other"
                }`}
              >
                {room.availability || "N/A"}
              </span>

              <div className="room-price">
                ₹{(room.price || 0).toLocaleString("en-IN")}
                <span>/mo</span>
              </div>
            </div>

            {/* Info */}
            <div className="room-info">
              <h3>{room.title || "Unnamed Room"}</h3>
              <p className="room-description">
                {room.description || "No description provided."}
              </p>

              <div className="room-details">
                <span>Type: {room.type || "N/A"}</span>
                <span>Capacity: {room.capacity || "N/A"}</span>
              </div>

              {/* Action Buttons */}
              <div className="room-actions">
                <button
                  className="btn edit-btn"
                  onClick={() => onEdit && onEdit(room.id)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn delete-btn"
                  onClick={() => onDelete && onDelete(room.id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="no-rooms-text">No rooms available.</p>
    )}
  </div>
);

export default RoomsSection;
