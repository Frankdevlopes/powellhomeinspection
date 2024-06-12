import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { addInspectionForm } from "../auth/firebase";

import "./widget.css";

const inputClasses = "border border-zinc-300 dark:border-zinc-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
const labelClasses = "text-zinc-700 dark:text-zinc-200";

const PdfOverlayForm = ({ formData, handleInputChange }) => {
  return (
    <div className="widget-section">
      <h2 className="widget-subheading">PDF Overlay</h2>
      <form>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input type="text" name="address" value={formData.address} placeholder="Address" className={inputClasses} onChange={handleInputChange} />
          <input type="text" name="ageOfHome" value={formData.ageOfHome} placeholder="Age of Home" className={inputClasses} onChange={handleInputChange} />
          <input type="text" name="roofAge" value={formData.roofAge} placeholder="Roof Age" className={inputClasses} onChange={handleInputChange} />
          <input type="text" name="clientNamePresent" value={formData.clientNamePresent} placeholder="Client Name Present" className={inputClasses} onChange={handleInputChange} />
          <input type="text" name="roofCovering" value={formData.roofCovering} placeholder="Roof Covering" className={inputClasses} onChange={handleInputChange} />
          <input type="text" name="waterService" value={formData.waterService} placeholder="Water service" className={inputClasses} onChange={handleInputChange} />
          <input type="text" name="roofSlope" value={formData.roofSlope} placeholder="Roof Slope" className={`${inputClasses} col-span-2`} onChange={handleInputChange} />
        </div>
        <div className="mb-4">
          <textarea name="describeConditions" value={formData.describeConditions} placeholder="Describe conditions" className={`${inputClasses} w-full`} onChange={handleInputChange} />
        </div>
        <div className="mb-4">
          <label className={`block ${labelClasses} mb-2`}>Check all that apply</label>
          <div className="flex items-center mb-2">
            <input type="radio" name="options" value="None" checked={formData.options === "None"} className="mr-2" onChange={handleInputChange} />
            <label htmlFor="none" className={labelClasses}>None</label>
          </div>
          <div className="flex items-center mb-2">
            <input type="radio" name="options" value="All" checked={formData.options === "All"} className="mr-2" onChange={handleInputChange} />
            <label htmlFor="all" className={labelClasses}>All</label>
          </div>
          <div className="flex items-center mb-2">
            <input type="radio" name="options" value="Some" checked={formData.options === "Some"} className="mr-2" onChange={handleInputChange} />
            <label htmlFor="some" className={labelClasses}>Some</label>
          </div>
          <div className="flex items-center">
            <input type="radio" name="options" value="Many" checked={formData.options === "Many"} className="mr-2" onChange={handleInputChange} />
            <label htmlFor="many" className={labelClasses}>Many</label>
          </div>
        </div>
        <div className="mb-4">
          <button type="button" className="bg-blue-500 text-white p-2 rounded-md">Upload Photo</button>
        </div>
      </form>
    </div>
  );
};
const Widget = () => {
  const sigCanvas = useRef({});
  const formRef = useRef(null);
  const [uploadedSignature, setUploadedSignature] = useState(null);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [formData, setFormData] = useState({
    address: '',
    ageOfHome: '',
    roofAge: '',
    clientNamePresent: '',
    roofCovering: '',
    waterService: '',
    roofSlope: '',
    describeConditions: '',
    options: ''
  });
  const [file, setFile] = useState(null);

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const handleUploadSignature = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedSignature(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadPhoto = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedPhotos([...uploadedPhotos, e.target.result]);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const pdf = new jsPDF();

    // Convert form to image
    const canvas = await html2canvas(formRef.current);
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0);

    // Add signature if available
    if (!sigCanvas.current.isEmpty()) {
      const sigData = sigCanvas.current.toDataURL('image/png');
      pdf.addImage(sigData, 'PNG', 10, 250, 100, 30); // Adjust positioning as needed
    }

    // Add uploaded signature if available
    if (uploadedSignature) {
      pdf.addImage(uploadedSignature, 'PNG', 10, 290, 100, 30); // Adjust positioning as needed
    }

    // Add uploaded photos
    uploadedPhotos.forEach((photo, index) => {
      pdf.addPage();
      pdf.addImage(photo, 'PNG', 10, 10, 180, 160); // Adjust positioning and size as needed
    });

    // Save the generated PDF
    const pdfBlob = pdf.output('blob');
    setFile(pdfBlob);

    // Upload the PDF to Firebase
    if (file) {
      await addInspectionForm(formData, file);
      alert('Inspection form submitted successfully!');
    } else {
      alert('Please upload a file');
    }

    document.querySelector(".congrats-message").classList.add("show");
  };

  return (
    <div className="widget-container" ref={formRef}>
      <PdfOverlayForm formData={formData} handleInputChange={handleInputChange} />

      <h2 className="widget-heading">4-Point Inspection Form</h2>
      
      <div className="widget-section">
        <label className="widget-label">Insured/Applicant Name:</label>
        <input type="text" className="widget-input" name="insuredName" onChange={handleInputChange} />
      </div>
      
      <div className="widget-section">
        <label className="widget-label">Applicant / Policy #:</label>
        <input type="text" className="widget-input" name="policyNumber" onChange={handleInputChange} />
      </div>
      
      <div className="widget-section">
        <label className="widget-label">Address Inspected:</label>
        <input type="text" className="widget-input" name="address" onChange={handleInputChange} />
      </div>
      
      <div className="widget-section">
        <label className="widget-label">Date Inspected:</label>
        <input type="date" className="widget-input" name="dateInspected" onChange={handleInputChange} />
      </div>
      
      <div className="widget-section">
        <label className="widget-label">Actual Year Built:</label>
        <input type="text" className="widget-input" name="yearBuilt" onChange={handleInputChange} />
      </div>
      
      <div className="widget-section">
        <label className="widget-label">Occupancy:</label>
        <input type="text" className="widget-input" name="occupancy" onChange={handleInputChange} />
      </div>
      
      <div className="widget-section">
        <label className="widget-label">Tied into another part of the structure?:</label>
        <input type="text" className="widget-input" name="structureTie" onChange={handleInputChange} />
      </div>
      
      <div className="widget-section">
        <label className="widget-label">Wind Classification:</label>
        <input type="text" className="widget-input" name="windClass" onChange={handleInputChange} />
      </div>
      
      <div className="widget-section">
        <label className="widget-label">Roof Design:</label>
        <input type="text" className="widget-input" name="roofDesign" onChange={handleInputChange} />
      </div>
      
      <div className="widget-section">
        <label className="widget-label">Roof covering material:</label>
        <input type="text" className="widget-input" name="roofMaterial" onChange={handleInputChange} />
      </div>

      <div className="widget-section">
        <label className="widget-label">Signature:</label>
        <SignatureCanvas ref={sigCanvas} canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }} />
        <button type="button" className="clear-btn" onClick={clearSignature}>Clear</button>
      </div>

      <div className="widget-section">
        <label className="widget-label">Upload Signature:</label>
        <input type="file" className="widget-input" accept="image/*" onChange={handleUploadSignature} />
      </div>

      <div className="widget-section">
        <label className="widget-label">Upload Photos:</label>
        <input type="file" className="widget-input" accept="image/*" onChange={handleUploadPhoto} multiple />
      </div>

      <div className="widget-section">
        <button className="widget-submit" onClick={handleSubmit}>Submit</button>
      </div>

      <div className="congrats-message">Congratulations! Your inspection form has been submitted.</div>
    </div>
  );
};

export default Widget;
