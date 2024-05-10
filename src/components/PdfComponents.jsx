import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { useDropzone } from "react-dropzone";
import "./PdfComponents.css";

const PdfComponents = () => {
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setPdf(reader.result);
      setError(null); // Reset error state
    };
    reader.onerror = () => {
      setError("Failed to load PDF file");
    };
    reader.readAsArrayBuffer(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
    }
  };

  const renderPages = () => {
    return (
      <Document
        file={pdf}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={(error) => setError("Failed to render PDF")}
        options={{ workerSrc: "/pdf.worker.js" }} // Specify workerSrc option
      >
        <Page pageNumber={pageNumber} />
      </Document>
    );
  };

  return (
    <div className="pdf-components">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag & drop a PDF here, or click to select one</p>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="pdf-container">
        {pdf && renderPages()}
      </div>
      <div className="pagination">
        <button disabled={pageNumber <= 1} onClick={() => handlePageChange(pageNumber - 1)}>Previous</button>
        <p>Page {pageNumber} of {numPages}</p>
        <button disabled={pageNumber >= numPages} onClick={() => handlePageChange(pageNumber + 1)}>Next</button>
      </div>
    </div>
  );
};

export default PdfComponents;
