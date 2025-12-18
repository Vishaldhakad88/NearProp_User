import React from 'react';

const AgentsSection = () => {
  return (
    <section className="hrtc-agents-section">
      <h2 className="hrtc-section-title">Meet Our Agents</h2>
      <p className="hrtc-section-subtitle">Our team of experienced real estate professionals is dedicated to helping you find your dream property with personalized service.</p>
      <div className="hrtc-agents-container p-5">
        <div className="hrtc-agent-card">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Vincent Fuller" className="hrtc-agent-img" />
          <h3 className="hrtc-agent-name">Vincent Fuller</h3>
          <p className="hrtc-agent-role">Real Estate Agent, Country House Real Estate</p>
          <p className="hrtc-agent-desc">With over 10 years of experience, Vincent specializes in rural properties, guiding clients to find homes that match their lifestyle and budget.</p>
          <a href="#" className="hrtc-view-profile">View Profile</a>
        </div>
        <div className="hrtc-agent-card">
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Brittany Watkins" className="hrtc-agent-img" />
          <h3 className="hrtc-agent-name">Brittany Watkins</h3>
          <p className="hrtc-agent-role">Company Agent, All American Real Estate</p>
          <p className="hrtc-agent-desc">Brittany excels in urban real estate, offering expertise in market trends and negotiation to secure the best deals for her clients.</p>
          <a href="#" className="hrtc-view-profile">View Profile</a>
        </div>
        <div className="hrtc-agent-card">
          <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Michelle Ramirez" className="hrtc-agent-img" />
          <h3 className="hrtc-agent-name">Michelle Ramirez</h3>
          <p className="hrtc-agent-role">Company Agent, Modern House Real Estate</p>
          <p className="hrtc-agent-desc">Michelle focuses on luxury properties, providing tailored solutions and deep market knowledge to ensure a seamless buying experience.</p>
          <a href="#" className="hrtc-view-profile">View Profile</a>
        </div>
      </div>
    </section>
  );
};

export default AgentsSection;