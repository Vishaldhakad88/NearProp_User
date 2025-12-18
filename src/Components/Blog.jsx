import React, { useState, useEffect } from 'react';
import './Blog.css';
import room from '../assets/room1.avif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faHeart, faShare } from '@fortawesome/free-solid-svg-icons';

function Blog() {
  const [dropdown1Open, setDropdown1Open] = useState(false);
  const [dropdown2Open, setDropdown2Open] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCity, setSelectedCity] = useState("All Cities");

  const handleCategorySelect = (value) => {
    setSelectedCategory(value);
    setDropdown1Open(false);
  };

  const handleCitySelect = (value) => {
    setSelectedCity(value);
    setDropdown2Open(false);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.nearp-dropdown')) {
        setDropdown1Open(false);
        setDropdown2Open(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <div className="cyan">
        <div className="nearp-agent-search-bar">
          <input type="text" placeholder="Enter agent name" className="nearp-search-input " />

          {/* Dropdown 1 - Categories */}
          <div className="nearp-dropdown">
            <button
              className="nearp-dropdown-toggle text-dark"
              onClick={() => {
                setDropdown1Open(!dropdown1Open);
                setDropdown2Open(false);
              }}
            >
              {selectedCategory}
            </button>
            {dropdown1Open && (
              <div className="nearp-dropdown-menu">
                <input type="text" placeholder="Search..." className="nearp-dropdown-input" />
                <div className="nearp-dropdown-actions">
                  <button className="nearp-btn nearp-select-all">Select All</button>
                  <button className="nearp-btn nearp-deselect-all">Deselect All</button>
                </div>
                {["For Rent", "For Sale", "Foreclosures", "New Constructions", "New Listing", "Open House", "Reduced Price", "Resale"].map((item) => (
                  <p key={item} onClick={() => handleCategorySelect(item)} style={{ cursor: "pointer" }}>{item}</p>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 2 - Cities */}
          <div className="nearp-dropdown">
            <button
              className="nearp-dropdown-toggle text-dark"
              onClick={() => {
                setDropdown2Open(!dropdown2Open);
                setDropdown1Open(false);
              }}
            >
              {selectedCity}
            </button>
            {dropdown2Open && (
              <div className="nearp-">
                <input type="text" placeholder="Search..." className="nearp-dropdown-input" />
                <div className="nearp-dropdown-actions">
                  <button className="nearp-btn nearp-select-all">Select All</button>
                  <button className="nearp-btn nearp-deselect-all">Deselect All</button>
                </div>
                {["Commercial", "-Office", "-Shop", "Residential", "Apartment", "-Condo", "Multi family Home", "Single family Home", "-Villa", "-Home"].map((item) => (
                  <p key={item} onClick={() => handleCitySelect(item)} style={{ cursor: "pointer" }}>{item}</p>
                ))}
              </div>
            )}
          </div>

          {/* Advanced Toggle */}
          <div
            className="d-flex align-items-center cursor-pointer"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <FontAwesomeIcon icon={faGear} className="text-light me-2" />
            <p className="text-light mt-4 me-2">Advanced</p>
          </div>

          <button className="nearp-search-btn" style={{ backgroundColor: "lightcyan", color: "darkcyan" }}>
            Search
          </button>
        </div>

        {/* Advanced Search Section */}
        {showAdvanced && (
          <section className="advanced-search-bar mt-3" style={{ marginLeft: "250px" }}>
            <div className="advanced-search-fields">
              <select><option>All Cities</option></select>
              <select><option>Bedrooms</option></select>
              <input type="text" placeholder="Min. Area" />
              <input type="text" placeholder="Max. Area" />
              <input type="text" placeholder="Property ID" />
            </div>
            <div className="advanced-price-range">
              <label>Price Range From $200 To $2,500,000</label>
              <input type="range" min="200" max="2500000" />
            </div>
            <label className="advanced-other-features"><i className="fas fa-bars"></i> Other Features</label>
          </section>
        )}
      </div>

      <div className="container">
        <main className="main-container">
          <div className="left-column">
            <h1>Real Estate</h1>
            <div className="labels">
            </div>
          </div>
        </main>
      </div>

      <div className="barish-container">
        <div className="parent-wrapper">
          <div className="barish-main-content">
            <img src={room} alt="Real Estate Office" />
            <h2>Skills That You Can Learn In The Real Estate Market</h2>
            <p>
              Master essential real estate skills like market analysis, negotiation, and property valuation to excel in the industry. Build confidence in identifying profitable investments and fostering client trust.
            </p>
            <div className="barish-post-footer">
              <img src="https://i.pravatar.cc/30" alt="Author" />
              <span>by Mike Moore</span>
              <span>• 9 years ago</span>
              <span>• <a href="#" style={{ color: " #00aaff" }}>Business</a></span>
              <span>• 0</span>
            </div>
            <a className="barish-read-more" href="#">Read More</a>
          </div>

          <div className="barish-main-content">
            <img src={room} alt="Real Estate Office" />
            <h2>Skills That You Can Learn In The Real Estate Market</h2>
            <p>
              Learn key strategies for success in real estate, including effective marketing, client communication, and deal closing. Stay ahead by understanding market trends and buyer preferences.
            </p>
            <div className="barish-post-footer">
              <img src="https://i.pravatar.cc/30" alt="Author" />
              <span>by Mike Moore</span>
              <span>• 9 years ago</span>
              <span>• <a href="#" style={{ color: " #00aaff" }}>Business</a></span>
              <span>• 0</span>
            </div>
            <a className="barish-read-more" href="#">Read More</a>
          </div>
        </div>

        <div className="barish-sidebar">
          <section>
            <h3>Search</h3>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input type="text" placeholder="Search..." />
              <button style={{ marginTop: "2px", height: "38px", color: "black", fontWeight: "500" }}>Search</button>
            </div>
          </section>

          <section>
            <h3>Archives</h3>
            <a href="#">March 2016</a>
            <a href="#">January 2016</a>
          </section>

          <section>
            <h3>Categories</h3>
            <a href="#">Business</a>
            <a href="#">Construction</a>
            <a href="#">Real Estate</a>
          </section>

          <section>
            <h3>Meta</h3>
            <a href="#">Log in</a>
            <a href="#">Entries feed</a>
            <a href="#">Comments feed</a>
            <a href="#">WordPress.org</a>
          </section>
        </div>
      </div>
    </>
  );
}

export default Blog;