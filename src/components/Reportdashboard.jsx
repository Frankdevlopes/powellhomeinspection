import React, { useState, useEffect } from 'react';
import { db } from '../auth/firebase';
import ShareIcon from '../assets/share.png'; // Adjust path as per your project structure

import { useNavigate } from 'react-router-dom';

const ReportDashboard = () => {
  const [pdfs, setPdfs] = useState([]);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const pdfCollection = await db.collection('inspectionForms').get();
        const pdfData = pdfCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPdfs(pdfData);
      } catch (error) {
        console.error("Error fetching PDFs: ", error);
        setError("Failed to fetch PDF data from the server.");
      }
    };

    fetchPdfs();
  }, []);

  const handleShare = (url, title) => {
    const subject = encodeURIComponent(`Check out this PDF: ${title}`);
    const body = encodeURIComponent(`I found this PDF and thought you might like it: ${url}`);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
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
    <div className="relative p-4 space-y-4">
      <button 
        className="btn-primary mb-4" 
        onClick={() => setShowPopup(true)} 
        style={{ 
          backgroundColor: '#007bff', 
          color: '#fff', 
          padding: '10px 20px', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer' 
        }}
      >
        + Report
      </button>
      {showPopup && (
        <>
          <div 
            className="backdrop" 
            onClick={() => setShowPopup(false)} 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000
            }}
          ></div>
          <div 
            className="popup" 
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              zIndex: 1001
            }}
          >
            <button 
              className="btn-primary" 
              onClick={startNewReport} 
              style={{ 
                backgroundColor: '#007bff', 
                color: '#fff', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer', 
                marginRight: '10px'
              }}
            >
              Start New Report
            </button>
            <button 
              className="btn-secondary" 
              onClick={useTemplate} 
              style={{ 
                backgroundColor: '#6c757d', 
                color: '#fff', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer' 
              }}
            >
              Choose a Template
            </button>
          </div>
        </>
      )}

      <div style={{ padding: '20px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>Report Dashboard</h1>
        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}
        {pdfs.length === 0 ? (
          <div 
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              zIndex: 1000,
              flexDirection: 'column'
            }}
          >
            <div 
              style={{ 
                padding: '20px 40px', 
                backgroundColor: '#f0f0f0', 
                borderRadius: '10px', 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                textAlign: 'center'
              }}
            >
              <h2 style={{ color: '#555' }}>No Reports</h2>
              <p style={{ color: '#777' }}>Create a report in PDF format to see it here.</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {pdfs.map(pdf => (
              <div 
                key={pdf.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  width: '80%', 
                  padding: '10px 20px', 
                  margin: '10px 0', 
                  border: '1px solid #ccc', 
                  borderRadius: '5px', 
                  backgroundColor: '#f9f9f9',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                <span 
                  style={{ 
                    flex: 1, 
                    color: '#333', 
                    textDecoration: 'none', 
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {pdf.title}
                </span>
                <a 
                  href={pdf.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    padding: '5px 10px', 
                    marginLeft: '20px', 
                    backgroundColor: '#007bff', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '4px', 
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  View PDF
                </a>
                <button 
                  className="btn-secondary ml-2" 
                  onClick={() => handleShare(pdf.fileUrl, pdf.title)} 
                  style={{ 
                    padding: '5px 10px', 
                    marginLeft: '10px', 
                    backgroundColor: '#6c757d', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: 'pointer'
                  }}
                >
                  <img src={ShareIcon} alt="Share PDF" className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDashboard;
