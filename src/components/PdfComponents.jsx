import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { ReactSketchCanvas } from "react-sketch-canvas";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Swal from 'sweetalert2';
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
  const sketchRef = useRef(null);
  const [uploadedSignature, setUploadedSignature] = useState(null);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
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
  const [file, setFile] = useState(null);
  const [customText, setCustomText] = useState('');
  const [customTextPosition, setCustomTextPosition] = useState({ x: 0, y: 0 });

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

  const handleTextChange = (e) => {
    setCustomText(e.target.value);
  };

  const handleTextPositionChange = (e) => {
    const { name, value } = e.target;
    setCustomTextPosition({
      ...customTextPosition,
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

    // Add drawing if available
    if (sketchRef.current) {
      const drawingData = await sketchRef.current.exportImage("png");
      pdf.addImage(drawingData, 'PNG', 10, 330, 100, 30); // Adjust positioning as needed
    }

    // Add custom text if available
    if (customText) {
      pdf.text(customText, customTextPosition.x, customTextPosition.y);
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
    const formDataToSave = {
      ...formData,
      pdfFile: pdfBlob,
      uploadedSignature,
      uploadedPhotos,
      customText,
      customTextPosition
    };
    await addInspectionForm(formDataToSave);

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Form submitted successfully!'
    });

    setFormData({
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
    setUploadedSignature(null);
    setUploadedPhotos([]);
    setCustomText('');
    setCustomTextPosition({ x: 0, y: 0 });
  };

  return (
    <div>
      <div ref={formRef}>
        <PdfOverlayForm formData={formData} handleInputChange={handleInputChange} />
        <form className="p-4 bg-white rounded-lg shadow-md dark:bg-zinc-800" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-4">4-Point Inspection Form</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="text" name="insuredName" value={formData.insuredName} placeholder="Insured's Name" className={inputClasses} onChange={handleInputChange} />
            <input type="text" name="policyNumber" value={formData.policyNumber} placeholder="Policy Number" className={inputClasses} onChange={handleInputChange} />
            <input type="text" name="applicantPolicyNumber" value={formData.applicantPolicyNumber} placeholder="Applicant / Policy #" className={inputClasses} onChange={handleInputChange} />
            <input type="text" name="address" value={formData.address} placeholder="Address" className={inputClasses} onChange={handleInputChange} />
            <input type="text" name="dateInspected" value={formData.dateInspected} placeholder="Date Inspected" className={inputClasses} onChange={handleInputChange} />
            <input type="text" name="yearBuilt" value={formData.yearBuilt} placeholder="Year Built" className={inputClasses} onChange={handleInputChange} />
            <input type="text" name="occupancy" value={formData.occupancy} placeholder="Occupancy" className={inputClasses} onChange={handleInputChange} />
            <input type="text" name="structureTie" value={formData.structureTie} placeholder="Structure Tie" className={inputClasses} onChange={handleInputChange} />
            <input type="text" name="windClass" value={formData.windClass} placeholder="Wind Class" className={inputClasses} onChange={handleInputChange} />
            <input type="text" name="roofDesign" value={formData.roofDesign} placeholder="Roof Design" className={inputClasses} onChange={handleInputChange} />
            <input type="text" name="roofMaterial" value={formData.roofMaterial} placeholder="Roof Material" className={inputClasses} onChange={handleInputChange} />
            <input type="text" name="roofAge" value={formData.roofAge} placeholder="Roof Age" className={inputClasses} onChange={handleInputChange} />
            <input type="text" name="waterHeaterAge" value={formData.waterHeaterAge} placeholder="Water Heater Age" className={inputClasses} onChange={handleInputChange} />
            <input type="text" name="plumbingMaterialUsed" value={formData.plumbingMaterialUsed} placeholder="Plumbing Material Used" className={inputClasses} onChange={handleInputChange} />
            <input type="text" name="aluminumWiring" value={formData.aluminumWiring} placeholder="Aluminum Wiring" className={inputClasses} onChange={handleInputChange} />
          </div>
          <div className="mb-4">
            <label className={labelClasses}>Signature</label>
            <SignatureCanvas ref={sigCanvas} canvasProps={{ className: "signature-canvas w-full h-24 border border-gray-300" }} />
            <button type="button" className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md" onClick={clearSignature}>Clear</button>
          </div>
          <div className="mb-4">
            <label className={labelClasses}>Upload Signature</label>
            <input type="file" className="mt-2" onChange={handleUploadSignature} />
            {uploadedSignature && <img src={uploadedSignature} alt="Uploaded Signature" className="mt-2 w-full h-24 object-contain" />}
          </div>
          <div className="mb-4">
            <label className={labelClasses}>Upload Photos</label>
            <input type="file" className="mt-2" onChange={handleUploadPhoto} />
            {uploadedPhotos.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {uploadedPhotos.map((photo, index) => (
                  <img key={index} src={photo} alt={`Uploaded Photo ${index + 1}`} className="w-full h-24 object-cover" />
                ))}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className={labelClasses}>Drawing</label>
            <ReactSketchCanvas ref={sketchRef} width='100%' height='400px' strokeColor='black' strokeWidth={3} />
          </div>
          <div className="mb-4">
            <label className={labelClasses}>Custom Text</label>
            <input type="text" name="customText" value={customText} placeholder="Enter custom text" className={inputClasses} onChange={handleTextChange} />
            <div className="mt-2">
              <input type="number" name="x" value={customTextPosition.x} placeholder="X Position" className={`${inputClasses} mr-2`} onChange={handleTextPositionChange} />
              <input type="number" name="y" value={customTextPosition.y} placeholder="Y Position" className={inputClasses} onChange={handleTextPositionChange} />
            </div>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Widget;
