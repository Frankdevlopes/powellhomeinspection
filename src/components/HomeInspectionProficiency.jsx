import React, { useState, useEffect } from 'react';
import './HomeInspectionProficiency.css';

import peerImage from '/src/assets/peer.jpg'; // Import your image

const HomeInspectionProficiency = () => {
  const [loading, setLoading] = useState(true); // State to track loading
  const [imageLoaded, setImageLoaded] = useState(false); // State to track image loading

  useEffect(() => {
    // Simulating a delay for loading (you can remove this in production)
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust delay time as needed

    return () => clearTimeout(timeout);
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="container">
      {loading && (
        <div className="image-placeholder">
          <div className="loading-animation spinner"></div>
        </div>
      )}

      <div className={`content ${loading ? 'hidden' : ''}`}>
        <div className="image-section">
          <img
            src={peerImage}
            alt="Home Inspection"
            className={`image ${imageLoaded ? 'image-loaded' : ''}`}
            onLoad={handleImageLoad}
          />
        </div>
        <div className="text-section">
          <h2 className="title">Our Home Inspection Proficiency</h2>
          <p className="description">
            At <b>POWELL Inspections</b>, we pride ourselves on providing thorough and detailed home inspections.
            Our team is highly trained and experienced in identifying any potential issues in your home.
          </p>
          <div className="proficiency-list">
            <div className="proficiency-item">
              <div className="color-box green"></div>
              <span>Structural Integrity</span>
            </div>
            <div className="proficiency-item">
              <div className="color-box blue"></div>
              <span>Electrical Systems</span>
            </div>
            <div className="proficiency-item">
              <div className="color-box yellow"></div>
              <span>Plumbing</span>
            </div>
            <div className="proficiency-item">
              <div className="color-box red"></div>
              <span>Safety Compliance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeInspectionProficiency;


