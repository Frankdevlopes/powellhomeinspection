import React, { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '../auth/firebase';
import SignatureCanvas from 'react-signature-canvas';
import './widget.css'; // Import the CSS file

// Shared Tailwind CSS classes
const sharedClasses = {
  input: 'border rounded w-full p-1',
  label: 'block',
  checkbox: 'mr-2',
  grid: 'grid grid-cols-2 gap-2',
  grid3: 'grid grid-cols-3 gap-4',
  border: 'border-b pb-2 mb-4',
  font: 'font-semibold',
};

const inputClass =
  'w-full border border-zinc-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white';

const FormInput = ({ label, id, type, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" htmlFor={id}>
        {label}
      </label>
      <input id={id} type={type} className={inputClass} value={value} onChange={onChange} />
    </div>
  );
};

const CheckboxItem = ({ id, label, checked, onChange }) => {
  return (
    <li>
      <input type="checkbox" id={id} className="mr-2" checked={checked} onChange={onChange} />
      <label htmlFor={id}>{label}</label>
    </li>
  );
};

const PdfComponent = () => {
  const [formData, setFormData] = useState({
    insuredName: '',
    policyNumber: '',
    address: '',
    dateInspected: '',
    yearBuilt: '',
    ageOfHome: '',
    roofAge: '',
    clientNamePresent: '',
    roofCovering: '',
    waterService: '',
    roofSlope: '',
    describeConditions: '',
    mainPanelType: '',
    secondPanelType: '',
    totalAmpsMainPanel: '',
    totalAmpsSecondPanel: '',
    mainPanelSufficient: '',
    secondPanelSufficient: '',
    copperWiring: 'No',
    aluminumWiringType: 'No',
    nmBxOrConduit: 'No',
    blowingFuses: 'No',
    trippingBreakers: 'No',
    emptySockets: 'No',
    looseWiring: 'No',
    improperGrounding: 'No',
    corrosion: 'No',
    overFusing: 'No',
    doubleTaps: 'No',
    signatureName: '' // Add signature name field
  });

  const [photos, setPhotos] = useState([]);
  const [uploadedSignature, setUploadedSignature] = useState(null);
  const sigCanvas = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePhotoChange = (event) => {
    setPhotos([...event.target.files]);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Generate PDF
      const pdf = new jsPDF();
      pdf.setFontSize(10);
      let yPosition = 10;

      const addFieldToPdf = (label, value) => {
        pdf.text(`${label}: ${value}`, 10, yPosition);
        yPosition += 10;
      };

      // Add all form fields to the PDF
      for (const [key, value] of Object.entries(formData)) {
        addFieldToPdf(key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), value);
      }

      // Read and add photos to the PDF
      for (const photo of photos) {
        const reader = new FileReader();
        reader.onload = function(event) {
          const imgData = event.target.result;
          pdf.addImage(imgData, 'JPEG', 10, yPosition, 180, 160); // Adjust the dimensions as needed
          yPosition += 170; // Adjust the spacing as needed
          if (yPosition > 260) { // Avoid overflow, add a new page if necessary
            pdf.addPage();
            yPosition = 10;
          }
        };
        reader.readAsDataURL(photo);
      }

      // Wait for all images to be read and added to the PDF
      await new Promise(resolve => setTimeout(resolve, 1000));

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

      // Clear form data after successful submission
      setFormData({
        insuredName: '',
        policyNumber: '',
        address: '',
        dateInspected: '',
        yearBuilt: '',
        ageOfHome: '',
        roofAge: '',
        clientNamePresent: '',
        roofCovering: '',
        waterService: '',
        roofSlope: '',
        describeConditions: '',
        mainPanelType: '',
        secondPanelType: '',
        totalAmpsMainPanel: '',
        totalAmpsSecondPanel: '',
        mainPanelSufficient: '',
        secondPanelSufficient: '',
        copperWiring: 'No',
        aluminumWiringType: 'No',
        nmBxOrConduit: 'No',
        blowingFuses: 'No',
        trippingBreakers: 'No',
        emptySockets: 'No',
        looseWiring: 'No',
        improperGrounding: 'No',
        corrosion: 'No',
        overFusing: 'No',
        doubleTaps: 'No',
        signatureName: '' // Reset signature name
      });
      setPhotos([]);
      sigCanvas.current.clear();

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
      <h1 className="widget-heading"> ON SUBMIT CHECK THE REPORT DASHBOARD FOR GENERATED REPORT</h1>
      <form onSubmit={handleSubmit}>
        {/* PdfOverlayForm content */}
        <div className="p-4 max-w-2xl mx-auto bg-white dark:bg-zinc-800 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">PDF Overlay</h1>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Address" name="address" className={sharedClasses.input} value={formData.address} onChange={handleInputChange} />
              <input type="text" placeholder="Age of Home" name="ageOfHome" className={sharedClasses.input} value={formData.ageOfHome} onChange={handleInputChange} />
              <input type="text" placeholder="Roof Age" name="roofAge" className={sharedClasses.input} value={formData.roofAge} onChange={handleInputChange} />
              <input type="text" placeholder="Client Name Present" name="clientNamePresent" className={sharedClasses.input} value={formData.clientNamePresent} onChange={handleInputChange} />
              <input type="text" placeholder="Roof Covering" name="roofCovering" className={sharedClasses.input} value={formData.roofCovering} onChange={handleInputChange} />
              <input type="text" placeholder="Water Service" name="waterService" className={sharedClasses.input} value={formData.waterService} onChange={handleInputChange} />
              <input type="text" placeholder="Roof Slope" name="roofSlope" className={sharedClasses.input} value={formData.roofSlope} onChange={handleInputChange} />
            </div>
            <div className="flex">
              <div className="mr-4">
                <h3 className="text-zinc-800 dark:text-zinc-200">Select one:</h3>
                <label className="flex items-center">
                  <input type="radio" name="roofSlopeType" value="Gable" checked={formData.roofSlopeType === 'Gable'} onChange={handleInputChange} className="mr-2" />
                  Gable
                </label>
                <label className="flex items-center">
                  <input type="radio" name="roofSlopeType" value="Hip" checked={formData.roofSlopeType === 'Hip'} onChange={handleInputChange} className="mr-2" />
                  Hip
                </label>
                <label className="flex items-center">
                  <input type="radio" name="roofSlopeType" value="Flat" checked={formData.roofSlopeType === 'Flat'} onChange={handleInputChange} className="mr-2" />
                  Flat
                </label>
              </div>
              <div>
                <h3 className="text-zinc-800 dark:text-zinc-200">Select all that apply:</h3>
                <label className="flex items-center">
                  <input type="checkbox" name="roofSlopeType" value="Least" checked={formData.roofSlopeType === 'Least'} onChange={handleInputChange} className="mr-2" />
                  Least
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="roofSlopeType" value="Moderate" checked={formData.roofSlopeType === 'Moderate'} onChange={handleInputChange} className="mr-2" />
                  Moderate
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="roofSlopeType" value="Most" checked={formData.roofSlopeType === 'Most'} onChange={handleInputChange} className="mr-2" />
                  Most
                </label>
              </div>
            </div>
            <textarea placeholder="Describe Conditions" name="describeConditions" className={`${sharedClasses.input} h-32`} value={formData.describeConditions} onChange={handleInputChange}></textarea>
            <div>
              <label className={sharedClasses.label}>Photos</label>
              <input type="file" multiple accept="image/*" onChange={handlePhotoChange} />
            </div>
          </div>
        </div>

        {/* InspectionForm content */}
        <div className="p-4 max-w-2xl mx-auto bg-white dark:bg-zinc-800 rounded-lg shadow-md mt-8">
          <div className={sharedClasses.border}>
            <h2 className={sharedClasses.font}>Inspection Form</h2>
            <div className={sharedClasses.grid}>
              <input type="text" placeholder="Insured Name" name="insuredName" className={sharedClasses.input} value={formData.insuredName} onChange={handleInputChange} />
              <input type="text" placeholder="Policy Number" name="policyNumber" className={sharedClasses.input} value={formData.policyNumber} onChange={handleInputChange} />
              <input type="text" placeholder="Date Inspected" name="dateInspected" className={sharedClasses.input} value={formData.dateInspected} onChange={handleInputChange} />
              <input type="text" placeholder="Year Built" name="yearBuilt" className={sharedClasses.input} value={formData.yearBuilt} onChange={handleInputChange} />
            </div>
          </div>

          <div className={sharedClasses.border}>
            <h3 className={sharedClasses.font}>Electric Panel Information</h3>
            <div className={sharedClasses.grid3}>
              <input type="text" placeholder="Type" name="mainPanelType" className={sharedClasses.input} value={formData.mainPanelType} onChange={handleInputChange} />
              <input type="text" placeholder="Type" name="secondPanelType" className={sharedClasses.input} value={formData.secondPanelType} onChange={handleInputChange} />
            </div>
            <div className={sharedClasses.grid}>
              <input type="text" placeholder="Total Amps" name="totalAmpsMainPanel" className={sharedClasses.input} value={formData.totalAmpsMainPanel} onChange={handleInputChange} />
              <input type="text" placeholder="Total Amps" name="totalAmpsSecondPanel" className={sharedClasses.input} value={formData.totalAmpsSecondPanel} onChange={handleInputChange} />
              <input type="text" placeholder="Sufficient?" name="mainPanelSufficient" className={sharedClasses.input} value={formData.mainPanelSufficient} onChange={handleInputChange} />
              <input type="text" placeholder="Sufficient?" name="secondPanelSufficient" className={sharedClasses.input} value={formData.secondPanelSufficient} onChange={handleInputChange} />
            </div>
          </div>

          <div className={sharedClasses.border}>
            <h4 className={sharedClasses.font}>Electric Information</h4>
            <div>
              <ul>
                <CheckboxItem id="copperWiring" label="Copper Wiring" checked={formData.copperWiring === 'Yes'} onChange={() => setFormData({ ...formData, copperWiring: formData.copperWiring === 'Yes' ? 'No' : 'Yes' })} />
                <CheckboxItem id="aluminumWiringType" label="Aluminum Wiring Type" checked={formData.aluminumWiringType === 'Yes'} onChange={() => setFormData({ ...formData, aluminumWiringType: formData.aluminumWiringType === 'Yes' ? 'No' : 'Yes' })} />
                <CheckboxItem id="nmBxOrConduit" label="NM-BX or Conduit" checked={formData.nmBxOrConduit === 'Yes'} onChange={() => setFormData({ ...formData, nmBxOrConduit: formData.nmBxOrConduit === 'Yes' ? 'No' : 'Yes' })} />
              </ul>
            </div>
          </div>

          <div className={sharedClasses.border}>
            <h5 className={sharedClasses.font}>Common Issues</h5>
            <ul>
              <CheckboxItem id="blowingFuses" label="Blowing Fuses" checked={formData.blowingFuses === 'Yes'} onChange={() => setFormData({ ...formData, blowingFuses: formData.blowingFuses === 'Yes' ? 'No' : 'Yes' })} />
              <CheckboxItem id="trippingBreakers" label="Tripping Breakers" checked={formData.trippingBreakers === 'Yes'} onChange={() => setFormData({ ...formData, trippingBreakers: formData.trippingBreakers === 'Yes' ? 'No' : 'Yes' })} />
              <CheckboxItem id="emptySockets" label="Empty Sockets" checked={formData.emptySockets === 'Yes'} onChange={() => setFormData({ ...formData, emptySockets: formData.emptySockets === 'Yes' ? 'No' : 'Yes' })} />
              <CheckboxItem id="looseWiring" label="Loose Wiring" checked={formData.looseWiring === 'Yes'} onChange={() => setFormData({ ...formData, looseWiring: formData.looseWiring === 'Yes' ? 'No' : 'Yes' })} />
              <CheckboxItem id="improperGrounding" label="Improper Grounding" checked={formData.improperGrounding === 'Yes'} onChange={() => setFormData({ ...formData, improperGrounding: formData.improperGrounding === 'Yes' ? 'No' : 'Yes' })} />
              <CheckboxItem id="corrosion" label="Corrosion" checked={formData.corrosion === 'Yes'} onChange={() => setFormData({ ...formData, corrosion: formData.corrosion === 'Yes' ? 'No' : 'Yes' })} />
              <CheckboxItem id="overFusing" label="Overfusing" checked={formData.overFusing === 'Yes'} onChange={() => setFormData({ ...formData, overFusing: formData.overFusing === 'Yes' ? 'No' : 'Yes' })} />
              <CheckboxItem id="doubleTaps" label="Double Taps" checked={formData.doubleTaps === 'Yes'} onChange={() => setFormData({ ...formData, doubleTaps: formData.doubleTaps === 'Yes' ? 'No' : 'Yes' })} />
            </ul>
          </div>

          <div className={sharedClasses.border}>
            <label className={sharedClasses.label}>Signature</label>
            <div className="signature-container">
              <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }} />
              <button type="button" className="btn-clear" onClick={clearSignature}>Clear</button>
              <input type="text" placeholder="Signature Name" name="signatureName" className={sharedClasses.input} value={formData.signatureName} onChange={handleInputChange} /> {/* Signature name field */}
            </div>
            <div>
              <label className={sharedClasses.label}>Upload Signature</label>
              <input type="file" accept="image/*" onChange={handleUploadSignature} />
            </div>
          </div>
        </div>

        <div className="p-4 max-w-2xl mx-auto bg-white dark:bg-zinc-800 rounded-lg shadow-md mt-8">
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
           Click Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PdfComponent;
