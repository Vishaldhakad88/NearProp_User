// PropertyOverview.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faBed, faShower, faCar, faRulerCombined, faCalendarDays, faImage, faMap, faLocationDot, faHeart, faShare } from '@fortawesome/free-solid-svg-icons';

const PropertyOverview = ({ property }) => (

<>
    <article class="docker-card mobscreen ">
                   
                     <div class="docker-toolbar">
                       <div class="docker-left">
                         <button class="docker-btn-tab docker-active" aria-label="Photos"> <FontAwesomeIcon  size='xl' icon={faImage} /></button>
                         <button class="docker-btn-tab" aria-label="Map">  <FontAwesomeIcon  size='xl' icon={faMap} /></button>
                         <button class="docker-btn-tab" aria-label="360 Tour"> <FontAwesomeIcon  size='xl' icon={faLocationDot} /></button>
                       </div>
                       <div class="docker-right">
                         <button class="docker-btn-tab" aria-label="Favorite">  <FontAwesomeIcon size='xl' icon={faHeart} /></button>
                         <button class="docker-btn-tab" aria-label="Share"> <FontAwesomeIcon size='xl'  icon={faShare} /></button>
                       </div>
                     </div>
                   
                     <div class="docker-content">
                       <div class="docker-chips">
                         <span class="docker-chip docker-featured">{property?.label || "SPONSORED"}</span>
                         <span class="docker-chip docker-sale">{property?.status === "AVAILABLE" ? "FOR SALE" : "FOR RENT"}</span>
                       </div>
                   
                       <h1 class="docker-title">{property?.title || "Design Apartment"}</h1>
                   
                       <div class="docker-address">
                         <i class="fa-solid fa-location-dot"></i>
                         <span>{`${property?.address}, ${property?.city}, ${property?.state}, ${property?.pincode}`}</span>
                       </div>
                   
                       <div class="docker-price">₹{property?.price.toLocaleString() || "876,000"}</div>
                       <div class="docker-per">{property?.area || "7,600"}</div>
                   
                       <div class="docker-divider"></div>
                   
                       <div class="docker-section-head ">
                         <h3 className='me-5'>Overview</h3>
                         <small>Property ID:{property?.id} </small>
                       </div>
                   
                       <div class="docker-overview">
                         <div class="docker-ovr">
                           <div class="docker-ic">  <FontAwesomeIcon className="text-dark" icon={faBuilding} /></div>
                           <div>
                             <b>Apartment</b>
                             
                             <span> {property?.type || 'Apartment'}</span>
                           </div>
                         </div>
                   
                         <div class="docker-ovr">
                           <div class="docker-ic"><FontAwesomeIcon className="text-dark" icon={faBed} /></div>
                           <div>
                             <b> {property?.bedrooms}</b>
                             <span>Bedrooms</span>
                           </div>
                         </div>
                   
                         <div class="docker-ovr">
                           <div class="docker-ic"><FontAwesomeIcon  className="text-dark" icon={faShower} /></div>
                           <div>
                             <b> {property?.bathrooms}</b>
                             <span>Bathrooms</span>
                           </div>
                         </div>
                   
                         <div class="docker-ovr">
                           <div class="docker-ic"><FontAwesomeIcon className="text-dark"  icon={faCar} /> </div>
                           <div>
                             <b>{property?.garages || 1}</b>
                             <span>Garage</span>
                           </div>
                         </div>
                   
                         <div class="docker-ovr">
                           <div class="docker-ic"><FontAwesomeIcon className="text-dark"  icon={faRulerCombined} /></div>
                           <div>
                             <b> {property?.area}<br/>Ft</b>
                             <span>Area Size</span>
                           </div>
                         </div>
                   
                         <div class="docker-ovr">
                           <div class="docker-ic"><FontAwesomeIcon className="text-dark"  icon={faCalendarDays} /> </div>
                           <div>
                             <b>{property?.additionalDetails?.yearBuilt || 2016}</b>
                             <span>Year Built</span>
                           </div>
                         </div>
                       </div>
                   
                       <div class="docker-divider"></div>
                   
                        <div>
                                     <div className="near-overview-section-title">Description</div>
                                     <hr className="text-secondary" />
                                     <div className="near-overview-description">
                                       <p>{property?.description}</p>
                                     </div>
                                   </div>
                   
                      
                     </div>
                   </article>

  <div className="near-overview-container hij">
    <div className="near-overview-top-bar">
      <h2>Address</h2>
      <div>Property ID: {property.permanentId}</div>
    </div>
    <hr />
    <div className="near-overview-near-overview">
      <div><FontAwesomeIcon icon={faBuilding} /> {property.type}</div>
      <div><FontAwesomeIcon icon={faBed} /> {property.beds}</div>
      <div><FontAwesomeIcon icon={faShower} /> {property.bathrooms || 'N/A'}</div>
      <div><FontAwesomeIcon icon={faCar} /> {property.parking || 'N/A'}</div>
      <div><FontAwesomeIcon icon={faRulerCombined} /> {property.area || 'N/A'}</div>
      <div><FontAwesomeIcon icon={faCalendarDays} /> {property.createdAt}</div>
    </div>
    <div className="near-overview-section-title">Description</div>
    <hr />
    <p>{property.description}</p>
  </div>
</>
  
);

export default PropertyOverview;