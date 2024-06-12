import React from 'react';
import './ReportCreationModal.css';

const ReportCreationModal = ({ isOpen, onClose, onCreate }) => {
  if (!isOpen) return null;

  const handleTemplateSelection = () => {
    onCreate('template');
    onClose();
  };

  const handleStartNewReport = () => {
    onCreate('new');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create New Report</h2>
        <button className="btn" onClick={handleTemplateSelection}>Choose a Template</button>
        <button className="btn" onClick={handleStartNewReport}>Start a New Report</button>
        <button className="btn close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ReportCreationModal;
