import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

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

const FormInput = ({ label, id, type }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" htmlFor={id}>
        {label}
      </label>
      <input id={id} type={type} className={inputClass} />
    </div>
  );
};

const CheckboxItem = ({ id, label }) => {
  return (
    <li>
      <input type="checkbox" id={id} className="mr-2" />
      <label htmlFor={id}>{label}</label>
    </li>
  );
};

const InspectionForm = () => {
  const [photos, setPhotos] = useState([]);
  const [uploadedSignature, setUploadedSignature] = useState(null);
  const sigCanvas = useRef(null);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    // Form submission logic here
    console.log("Form submitted");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4 bg-white dark:bg-zinc-800 shadow-md rounded-lg">
      <h2 className="text-center text-xl font-bold mb-4">4-Point Inspection Form</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormInput label="Insured/Applicant Name:" id="insured-name" type="text" />
        <FormInput label="Application / Policy #:" id="policy-number" type="text" />
        <FormInput label="Address Inspected:" id="address" type="text" />
        <FormInput label="Date Inspected:" id="date-inspected" type="date" />
        <FormInput label="Actual Year Built:" id="actual-year-built" type="text" />
      </div>
      <div className="border border-zinc-300 p-4 rounded-md mb-4 dark:border-zinc-600">
        <h3 className="text-lg font-semibold mb-2">Minimum Photo Requirements:</h3>
        <ul className="list-none space-y-2">
          <CheckboxItem id="dwelling" label="Dwelling (Each side)" />
          <CheckboxItem id="roof" label="Roof (Each slope)" />
          <CheckboxItem
            id="plumbing"
            label="Plumbing (Water heater, under cabinet plumbing/drains, exposed valves)"
          />
          <CheckboxItem
            id="main-electrical"
            label="Main electrical service panel with interior door label"
          />
          <CheckboxItem id="electrical-box" label="Electrical box with panel off" />
          <CheckboxItem id="hazards" label="All hazards or deficiencies noted in this report" />
        </ul>
        <p className="mt-4">A Florida-licensed inspector must complete, sign and date this form.</p>
      </div>
      <div className="border-t border-zinc-300 pt-4 dark:border-zinc-600 mb-4">
        <p className="text-sm">
          Be advised that Underwriting will rely on the information in this sample form, or a
          similar form, that is obtained from the Florida licensed inspector of your choice. This
          information only is used to determine insurability and is not a warranty or assurance of
          the suitability, fitness or longevity of any of the systems inspected.
        </p>
      </div>
      <div>
        <label className={sharedClasses.label}>Add Photos</label>
        <input
          type="file"
          multiple
          className={inputClass}
          onChange={handlePhotoChange}
        />
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Electrical System</h2>
        <p className="text-sm">
          Separate documentation of any aluminum wiring remediation must be provided and certified
          by a licensed electrician.
        </p>
        <div className="flex flex-col md:flex-row justify-between mt-4">
          <div className="w-full md:w-1/2 p-2">
            <h3 className="font-semibold">Main Panel</h3>
            <div className="flex items-center mt-2">
              <label className={sharedClasses.label}>Type:</label>
              <label className={sharedClasses.label}>
                <input type="radio" name="main_panel_type" value="circuit_breaker" /> Circuit
                Breaker
              </label>
              <label className={sharedClasses.label}>
                <input type="radio" name="main_panel_type" value="fuse" /> Fuse
              </label>
            </div>
            <div className="mt-2">
              <label>Total Amps:</label>
              <input type="text" className={sharedClasses.input} placeholder="Enter amps" />
            </div>
            <div className="mt-2">
              <label>Is amperage sufficient for current usage?</label>
              <label className="ml-2">
                <input type="radio" name="main_panel_sufficient" value="yes" /> Yes
              </label>
              <label className="ml-2">
                <input type="radio" name="main_panel_sufficient" value="no" /> No
              </label>
            </div>
          </div>
          <div className="w-full md:w-1/2 p-2">
            <h3 className="font-semibold">Second Panel</h3>
            <div className="flex items-center mt-2">
              <label className={sharedClasses.label}>Type:</label>
              <label className={sharedClasses.label}>
                <input type="radio" name="second_panel_type" value="circuit_breaker" /> Circuit
                Breaker
              </label>
              <label className={sharedClasses.label}>
                <input type="radio" name="second_panel_type" value="fuse" /> Fuse
              </label>
            </div>
            <div className="mt-2">
              <label>Total Amps:</label>
              <input type="text" className={sharedClasses.input} placeholder="Enter amps" />
            </div>
            <div className="mt-2">
              <label>Is amperage sufficient for current usage?</label>
              <label className="ml-2">
                <input type="radio" name="second_panel_sufficient" value="yes" /> Yes
              </label>
              <label className="ml-2">
                <input type="radio" name="second_panel_sufficient" value="no" /> No
              </label>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">Indicate presence of any of the following:</h3>
          <div className="mt-2">
            <label className={sharedClasses.label}>
              <input type="checkbox" name="wiring" value="cloth_wiring" /> Cloth wiring
            </label>
            <label className={sharedClasses.label}>
              <input type="checkbox" name="wiring" value="active_knob_tube" /> Active knob & tube
              wiring
            </label>
            <label className={sharedClasses.label}>
              <input type="checkbox" name="wiring" value="aluminum_wiring" /> Active (used) aluminum
              wiring (if present, describe the usage of all aluminum wiring)
            </label>
            <label className={sharedClasses.label}>
              <input type="checkbox" name="wiring" value="single_strand_aluminum" /> If single
              strand aluminum branch wiring, provide details of all remediation. Separate
              documentation of all work must be provided.
            </label>
            <label className={sharedClasses.label}>
              <input type="checkbox" name="wiring" value="remediation_with_copper" /> Remediation
              performed with COPALUM crimp
            </label>
            <label className={sharedClasses.label}>
              <input type="checkbox" name="wiring" value="remediation_with_alumiconn" /> Remediation
              repaired with AlumiConn
            </label>
          </div>
        </div>
      </div>
      <div className={sharedClasses.border}>
        <h2 className={sharedClasses.font}>Hazards Present</h2>
        <div className={sharedClasses.grid}>
          <div>
            <label>
              <input type="checkbox" className={sharedClasses.checkbox} />
              Blowing fuses
            </label><br />
            <label>
              <input type="checkbox" className={sharedClasses.checkbox} />
              Tripping breakers
            </label><br />
            <label>
              <input type="checkbox" className={sharedClasses.checkbox} />
              Empty sockets
            </label><br />
            <label>
              <input type="checkbox" className={sharedClasses.checkbox} />
              Loose wiring
            </label><br />
            <label>
              <input type="checkbox" className={sharedClasses.checkbox} />
              Improper grounding
            </label><br />
            <label>
              <input type="checkbox" className={sharedClasses.checkbox} />
              Corrosion
            </label><br />
            <label>
              <input type="checkbox" className={sharedClasses.checkbox} />
              Over fusing
            </label>
          </div>
          <div>
            <label>
              <input type="checkbox" className={sharedClasses.checkbox} />
              Double taps
            </label><br />
            <label>
              <input type="checkbox" className={sharedClasses.checkbox} />
              Exposed wiring
            </label><br />
            <label>
              <input type="checkbox" className={sharedClasses.checkbox} />
              Unsafe wiring
            </label><br />
            <label>
              <input type="checkbox" className={sharedClasses.checkbox} />
              Improper breaker size
            </label><br />
            <label>
              <input type="checkbox" className={sharedClasses.checkbox} />
              Scorching
            </label><br />
            <label>
              <input type="checkbox" className={sharedClasses.checkbox} />
              Other (explain)
            </label>
          </div>
        </div>
      </div>
      <div className={sharedClasses.border}>
        <h2 className={sharedClasses.font}>General condition of the electrical system:</h2>
        <label className={`${sharedClasses.label} mr-4`}>
          <input type="radio" name="condition" className={sharedClasses.checkbox} />
          Satisfactory
        </label>
        <label className={`${sharedClasses.label} mr-4`}>
          <input type="radio" name="condition" className={sharedClasses.checkbox} />
          Unsatisfactory (explain)
        </label>
        <input type="text" className={sharedClasses.input} placeholder="Explain if unsatisfactory" />
      </div>
      <div className={sharedClasses.border}>
        <h2 className={sharedClasses.font}>Supplemental information</h2>
        <div className={sharedClasses.grid3}>
          <div>
            <h3 className={sharedClasses.font}>Main Panel</h3>
            <label className={sharedClasses.label}>Panel age: <input type="text" className={sharedClasses.input} /></label>
            <label className={sharedClasses.label}>Year last updated: <input type="text" className={sharedClasses.input} /></label>
            <label className={sharedClasses.label}>Brand/Model: <input type="text" className={sharedClasses.input} /></label>
          </div>
          <div>
            <h3 className={sharedClasses.font}>Second Panel</h3>
            <label className={sharedClasses.label}>Panel age: <input type="text" className={sharedClasses.input} /></label>
            <label className={sharedClasses.label}>Year last updated: <input type="text" className={sharedClasses.input} /></label>
            <label className={sharedClasses.label}>Brand/Model: <input type="text" className={sharedClasses.input} /></label>
          </div>
          <div>
            <h3 className={sharedClasses.font}>Wiring Type</h3>
            <label className={sharedClasses.label}><input type="checkbox" className={sharedClasses.checkbox} />Copper</label>
            <label className={sharedClasses.label}><input type="checkbox" className={sharedClasses.checkbox} />Aluminum</label>
            <label className={sharedClasses.label}><input type="checkbox" className={sharedClasses.checkbox} />NM, BX or Conduit</label>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label className={sharedClasses.label}>Signature</label>
        <SignatureCanvas ref={sigCanvas} canvasProps={{ className: "signature-canvas w-full h-24 border border-gray-300" }} />
        <button type="button" className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md" onClick={clearSignature}>Clear</button>
      </div>
      <div className="mb-4">
        <label className={sharedClasses.label}>Upload Signature</label>
        <input type="file" className="mt-2" onChange={handleUploadSignature} />
        {uploadedSignature && <img src={uploadedSignature} alt="Uploaded Signature" className="mt-2 w-full h-24 object-contain" />}
      </div>
      <div className="border-t pt-2">
      
      </div>
    </form>
  );
};

export default InspectionForm;
