// PropertyDetails.js
import React from 'react';

const PropertyDetails = ({ property }) => (
  <div className="property-box container-fluid">
    <h2 className="section-title">Details</h2>
    <div className="details-table">
      <div><span>Permanent ID:</span> {property.permanentId}</div>
      <div><span>Price:</span> ₹ {property.price}/mo</div>
      <div><span>Beds:</span> {property.beds}</div>
      <div><span>Property Type:</span> {property.type}</div>
      <div><span>Property Status:</span> {property.status === 'AVAILABLE' ? 'For Rent' : property.status}</div>
    </div>
  </div>
);

export default PropertyDetails;