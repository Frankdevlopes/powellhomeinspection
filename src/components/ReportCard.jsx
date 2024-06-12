import React from 'react';

const ReportCard = ({ title, buttonText }) => {
  const handleButtonClick = () => {
    // Handle button click action, e.g., navigating to the report or performing some action related to the report.
    console.log(`Button clicked for report: ${title}`);
  };

  return (
    <div className="report-card">
      <h3>{title}</h3>
      <button className="btn" onClick={handleButtonClick}>{buttonText}</button>
    </div>
  );
};

export default ReportCard;
