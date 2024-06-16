import React, { useState } from 'react';
import PdfOverlayForm from './pdfoverlay';
import InspectionForm from './inspectionform';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '../auth/firebase';
import './widget.css';  // Import the CSS file

const PdfComponent = () => {
  const [formData, setFormData] = useState({
    insuredName: '',
    policyNumber: '',
    applicantPolicyNumber: '',
    address: '',
    dateInspected: '',
    yearBuilt: '',
    occupancy: '',
    structureTie: '',
    windClass: '',
    roofDesign: '',
    roofMaterial: '',
    ageOfHome: '',
    roofAge: '',
    waterHeaterAge: '',
    plumbingMaterialUsed: '',
    aluminumWiring: '',
    clientNamePresent: '',
    roofCovering: '',
    waterService: '',
    roofSlope: '',
    describeConditions: '',
    options: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Generate PDF
      const pdf = new jsPDF();
      pdf.text(JSON.stringify(formData, null, 2), 10, 10);
      const pdfBlob = pdf.output('blob');

      // Upload PDF to Firebase Storage
      const reportId = uuidv4();
      const pdfRef = ref(storage, `pdfs/${reportId}.pdf`);
      await uploadBytes(pdfRef, pdfBlob);
      const pdfUrl = await getDownloadURL(pdfRef);

      // Save metadata to Firestore
      await addDoc(collection(db, 'pdfReports'), {
        id: reportId,
        formData,
        pdfUrl,
        timestamp: new Date()
      });

      // Show success message
      Swal.fire({
        title: 'Form Successfully Submitted!',
        text: 'Check Your Report Dashboard!!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      // Show error message if something goes wrong
      Swal.fire({
        title: 'Error',
        text: 'Something went wrong. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="widget-container">
      <h1 className="widget-heading">PDF Component</h1>
      <form onSubmit={handleSubmit}>
        <PdfOverlayForm formData={formData} handleInputChange={handleInputChange} />
        <InspectionForm formData={formData} handleInputChange={handleInputChange} />
        <button
          type="submit"
          className="widget-submit-button"
          style={{
            fontSize: '12px',
            padding: '5px 10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px',
            width: '100px'
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PdfComponent;
