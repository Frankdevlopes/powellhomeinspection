import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../auth/firebase';
import './reportDashboard.css';

// ReportCard component
const ReportCard = ({ title, content }) => (
  <div className={`border-blue p-4 bg-zinc mb-4`}>
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Link to="/search" className="border-blue text-white btn-primary">
        Search
      </Link>
    </div>
    <div className="border-blue p-4 space-y-2">
      {content}
    </div>
  </div>
);

// ReportDashboard component incorporating ReportCard
const ReportDashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [reports, setReports] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'pdfReports'));
        const reportsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReports(reportsData);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

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
    <div className="p-4 space-y-4 relative">
      <button className="btn-primary mb-4" onClick={handleNewReport}>
        + Report
      </button>
      {showPopup && (
        <>
          <div className="backdrop" onClick={() => setShowPopup(false)}></div>
          <div className="popup">
            <button className="btn-primary" onClick={startNewReport}>
              Start New Report
            </button>
            <button className="btn-secondary ml-2" onClick={useTemplate}>
              Choose a Template
            </button>
          </div>
        </>
      )}
      {reports.length > 0 ? (
        reports.map((report) => (
          <ReportCard
            key={report.id}
            title={report.formData.insuredName}
            content={
              <>
                <p><strong>Policy Number:</strong> {report.formData.policyNumber}</p>
                <p><strong>Address:</strong> {report.formData.address}</p>
                <p><strong>Date Inspected:</strong> {report.formData.dateInspected}</p>
                <a href={report.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue">
                  View PDF
                </a>
              </>
            }
          />
        ))
      ) : (
        <p>No reports found.</p>
      )}
    </div>
  );
};

export default ReportDashboard;
