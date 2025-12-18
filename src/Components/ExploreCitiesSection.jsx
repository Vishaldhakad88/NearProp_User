
import React from 'react';

const ExploreCitiesSection = () => {
  return (
    <section className="city-section">
      <h2 style={{ fontSize: "30px", marginBottom: '40px', color: "darkcyan" }}>Explore Cities</h2>
      <p className="subheading">Discover vibrant neighborhoods and top-rated cities where lifestyle meets opportunity. From bustling urban centers to peaceful suburbs, find the perfect place to call home.</p>
      <div className="menu">
        <div className="city-carousel">
          <div className="city-card">
            <img src="https://img.freepik.com/free-photo/vertical-shot-buildings-cloudy-sky_181624-15055.jpg?ga=GA1.1.586528727.1721893114&semt=ais_hybrid&w=740" alt="Indore" className="city-image" />
            <div className="city-info">
              <h3>Indore</h3>
              <p>The city of lights, filled with history, art, and culture.</p>
            </div>
          </div>
          <div className="city-card">
            <img src="https://img.freepik.com/premium-photo/buildings-city-against-sky_1048944-3332402.jpg?ga=GA1.1.586528727.1721893114&semt=ais_hybrid&w=740" alt="Delhi" className="city-image" />
            <div className="city-info">
              <h3>Delhi</h3>
              <p>The city that never sleeps, a vibrant mix of culture and skyscrapers.</p>
            </div>
          </div>
          <div className="city-card">
            <img src="https://img.freepik.com/free-photo/city-skyline-with-residential-district_1359-108.jpg?ga=GA1.1.586528727.1721893114&semt=ais_hybrid&w=740" alt="Benglore" className="city-image" />
            <div className="city-info">
              <h3>Benglore</h3>
              <p>The heart of innovation and tradition, blending old and new.</p>
            </div>
          </div>
          <div className="city-card">
            <img src="https://img.freepik.com/free-photo/glittering-glass-aluminium-cladded-skyscrapers-monsoon-mumbais-lower-parel-worli-areas_469504-19.jpg?ga=GA1.1.586528727.1721893114&semt=ais_hybrid&w=740" alt="Mumbai" className="city-image" />
            <div className="city-info">
              <h3>Mumbai</h3>
              <p>Beautiful beaches, stunning landmarks, and amazing culture.</p>
            </div>
          </div>
          <div className="city-card">
            <img src="https://img.freepik.com/free-photo/indian-city-buildings-scene_23-2151823136.jpg?ga=GA1.1.586528727.1721893114&semt=ais_hybrid&w=740" alt="Jaipur" className="city-image" />
            <div className="city-info">
              <h3>Jaipur</h3>
              <p>Rich in history and modern culture, the heart of Europe.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreCitiesSection;
