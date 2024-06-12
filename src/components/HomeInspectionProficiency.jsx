import React from 'react';
import './HomeInspectionProficiency.css'; // Import the CSS file for styling

const HomeInspectionProficiency = () => {
  return (
    <div className="container">
      <div className="content">
        <div className="image-section">
          <img src="/src/assets/peer.jpg" alt="Home Inspection" className="image" />
        </div>
        <div className="text-section">
          <h2 className="title">Our Home Inspection Proficiency</h2>
          <p className="description">
            At XYZ Inspections, we pride ourselves on providing thorough and detailed home inspections.
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
