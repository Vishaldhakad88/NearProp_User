// Amenities.js
import React from 'react';

const Amenities = ({ amenities }) => (
  <div>
    <h2 className="section-title">Amenities</h2>
    <div className="details-table">
      <div><span>Amenities:</span> {amenities.join(', ')}</div>
    </div>
  </div>
);

export default Amenities;