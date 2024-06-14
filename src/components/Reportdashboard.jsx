import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Shared classes object
const sharedClasses = {
  borderBlue: 'border border-blue-500',
  textBlue: 'text-blue-500',
  bgZinc: 'bg-zinc-200',
  flex: 'flex justify-between items-center',
  p4: 'p-4',
  spaceY4: 'space-y-4',
  spaceY2: 'space-y-2',
  h4: 'h-4',
  fontSemiBold: 'font-semibold',
  btnPrimary: 'bg-blue-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 rounded',
  btnSecondary: 'bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded',
  popup: 'absolute bg-white border border-gray-300 shadow-lg p-4 mt-2',
  backdrop: 'fixed inset-0 bg-black bg-opacity-50',
};

// ReportCard component
const ReportCard = ({ title, content }) => {
  return (
    <div className={`${sharedClasses.borderBlue} ${sharedClasses.p4}`}>
      <div className={`${sharedClasses.flex} mb-2`}>
        <h2 className={`text-lg ${sharedClasses.fontSemiBold}`}>{title}</h2>
        <Link
          to="/search"
          className={`${sharedClasses.borderBlue} text-white ${sharedClasses.btnPrimary}`}
        >
          Search
        </Link>
      </div>
      <div className={`${sharedClasses.borderBlue} ${sharedClasses.p4} ${sharedClasses.spaceY2}`}>
        {content}
      </div>
    </div>
  );
};

// ReportDashboard component incorporating ReportCard
const ReportDashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle the click event of the "+Report" button
  const handleNewReport = () => {
    setShowPopup(!showPopup);
  };

  // Function to handle starting a new report
  const startNewReport = () => {
    navigate('/pdf'); // Navigate to the New Inspection PDF Overlay
    setShowPopup(false); // Close the popup after action
  };

  // Function to handle using a template for a report
  const useTemplate = () => {
    navigate('/template-builder'); // Navigate to the Template Page
    setShowPopup(false); // Close the popup after action
  };

  return (
    <div className={`${sharedClasses.p4} ${sharedClasses.spaceY4} relative`}>
      <button className={`${sharedClasses.btnPrimary} mb-4`} onClick={handleNewReport}>
        +(BrowseOptions)
      </button>
      {showPopup && (
        <>
          <div className={sharedClasses.backdrop} onClick={() => setShowPopup(false)}></div>
          <div className={sharedClasses.popup}>
            <button className={sharedClasses.btnPrimary} onClick={startNewReport}>
              Start New Report
            </button>
            <button className={`${sharedClasses.btnSecondary} ml-2`} onClick={useTemplate}>
              Choose a Template
            </button>
          </div>
        </>
      )}
      <ReportCard
        title="Report Saved from Template Section"
        content={
          <>
            <div className={sharedClasses.h4 + ' ' + sharedClasses.bgZinc}></div>
            <div className={sharedClasses.h4 + ' ' + sharedClasses.bgZinc}></div>
            <div className={sharedClasses.h4 + ' ' + sharedClasses.bgZinc}></div>
            <div className={sharedClasses.textBlue}>
              <p>Received</p>
              <p>1 day 3 hours</p>
              <p>1 day 8 hours</p>
            </div>
          </>
        }
      />
      <ReportCard
        title="My Recently Saved Reports"
        content={
          <>
            <div className={sharedClasses.h4 + ' ' + sharedClasses.bgZinc}></div>
            <div className={sharedClasses.h4 + ' ' + sharedClasses.bgZinc}></div>
            <div className={sharedClasses.h4 + ' ' + sharedClasses.bgZinc}></div>
            <div className={sharedClasses.textBlue}>
              <p>Days Since Inspection</p>
              <p>1 day 8 hours</p>
              <p className="font-bold">1 day 12 hours</p>
            </div>
          </>
        }
      />
      <ReportCard
        title="My Past Reports"
        content={
          <>
            <div className={sharedClasses.h4 + ' ' + sharedClasses.bgZinc}></div>
            <div className={sharedClasses.h4 + ' ' + sharedClasses.bgZinc}></div>
          </>
        }
      />
    </div>
  );
};

export default ReportDashboard;