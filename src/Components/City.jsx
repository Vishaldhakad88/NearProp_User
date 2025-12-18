import React from 'react';
import { useNavigate } from 'react-router-dom';

function City() {
  const navigate = useNavigate();

  const handleCityClick = (city) => {
    navigate(`/cityproperty?city=${city}`); // city query param bhej diya
  };

  return (
    <>
      <section className="city-section">
        <h2 style={{ fontSize: "30px", marginBottom: '40px', color: "darkcyan" }}>Explore Cities</h2>
        <p className="subheading">
          Discover vibrant neighborhoods and top-rated cities where lifestyle meets opportunity. 
        </p>
        <div className="menu">
          <div className="city-carousel">
            {[
              { name: "Begusarai", img: "https://img.freepik.com/free-photo/vertical-shot-buildings-cloudy-sky_181624-15055.jpg?..." },
              { name: "lakhisarai", img: "https://img.freepik.com/premium-photo/buildings-city-against-sky_1048944-3332402.jpg?..." },
              { name: "Munger", img: "https://img.freepik.com/free-photo/city-skyline-with-residential-district_1359-108.jpg?..." },
              { name: "Saharsa", img: "https://img.freepik.com/free-photo/glittering-glass-aluminium-cladded-skyscrapers-monsoon-mumbais-lower-parel-worli-areas_469504-19.jpg?..." },
              { name: "Purnia", img: "https://img.freepik.com/free-photo/indian-city-buildings-scene_23-2151823136.jpg?..." }
            ].map((city, i) => (
              <div key={i} className="city-card" onClick={() => handleCityClick(city.name)} style={{ cursor: 'pointer' }}>
                <img src={city.img} alt={city.name} className="city-image" />
                <div className="city-info">
                  <h3>{city.name}</h3>
                  <p>Explore properties in {city.name}.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default City;
