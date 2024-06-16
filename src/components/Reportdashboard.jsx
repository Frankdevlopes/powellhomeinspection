import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../auth/firebase';
import './reportDashboard.css';

// Share icon imported from assets
import ShareIcon from '../assets/share.png'; // Adjust path as per your project structure

// ReportCard component
const ReportCard = ({ id, title, content, onDelete }) => {

  const handleShare = (pdfUrl, title) => {
    const subject = `Sharing PDF Report - ${title}`;
    const body = `Check out this PDF report:\n\n${pdfUrl}`;
    const mailToLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailToLink;
  };

  return (
    <div className={`border-blue p-4 bg-zinc mb-4`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex">
          <Link to="/search" className="border-blue text-white btn-primary">
            Search
          </Link>
          <button className="btn-secondary ml-2" onClick={() => onDelete(id)}>
            Delete
          </button>
          <button className="btn-secondary ml-2" onClick={() => handleShare(content.pdfUrl, title)}>
            <img src={ShareIcon} alt="Share PDF" className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="border-blue p-4 space-y-2">
        {content}
      </div>
    </div>
  );
};

// ReportDashboard component incorporating ReportCard
const ReportDashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [reports, setReports] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Function to fetch reports from Firestore
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

    // Initial fetch of reports
    fetchReports();

    // Set up a listener for real-time updates
    const unsubscribe = onSnapshot(collection(db, 'pdfReports'), querySnapshot => {
      const updatedReports = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReports(updatedReports);
    });

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs only once on mount

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

  // Function to delete a report
  const deleteReport = async (reportId) => {
    try {
      // Delete report from Firestore
      await deleteDoc(doc(db, 'pdfReports', reportId));
      // Update local state to remove the deleted report
      setReports(reports => reports.filter(report => report.id !== reportId));
    } catch (error) {
      console.error('Error deleting report:', error);
    }
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
            id={report.id}
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
            onDelete={deleteReport}
          />
        ))
      ) : (
        <p>No reports found.</p>
      )}
    </div>
  );
};

export default ReportDashboard;
