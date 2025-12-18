import React from 'react';
import { motion } from "framer-motion";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { MdApartment, MdOutlineHotel, MdEventAvailable } from "react-icons/md";
import appMockup from '../assets/Nearprop 1.png'; // Placeholder for app mockup image


import './DownloadApp.css';

const DownloadApp = () => {
  return (
    <section className="download-app-section">
      <div className="download-app-container">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="download-app-content"
        >
         
          <h2 className="download-app-title">
             <span className="download-app-title-highlight"> Download Nearprop App</span>
          </h2>
          <p className="download-app-description">
             <span> Discover Properties</span>, <span>Hostels,PGs</span>, <span>banquet halls</span>, <span>  and  with ease.</span> 
          </p>
          <div className="download-app-features">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="download-app-feature-icon"
            >
              <MdOutlineHotel size={24} />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="download-app-feature-icon"
            >
              <MdApartment size={24} />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="download-app-feature-icon"
            >
              <MdEventAvailable size={24} />
            </motion.div>
          </div>
          <div className="download-app-buttons">
           
            <a
              href="https://play.google.com/store/apps/details?id=com.nearprop.near_prop"
              target="_blank"
              rel="noopener noreferrer"
              className="download-app-button google"
            >
              <FaGooglePlay size={20} />
              <div className="download-app-button-text">
                <p>Get it on</p>
                <p>Google Play</p>
              </div>
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="download-app-mockup-container"
        >
          <motion.img
            src={appMockup}
            alt="Nearprop App Mockup"
            className="download-app-mockup"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default DownloadApp;