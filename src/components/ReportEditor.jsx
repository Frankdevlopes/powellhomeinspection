import React, { useRef, useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { DraggableCore } from "react-draggable";
import { useDropzone } from "react-dropzone";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./pdfEditor.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfEditor = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [elements, setElements] = useState([]);
  const editorRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    setPdfFile(URL.createObjectURL(acceptedFiles[0]));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const addElement = (type) => {
    const newElement = { type, x: 50, y: 50, id: elements.length + 1 };
    setElements([...elements, newElement]);
  };

  const handleDrag = (e, data, index) => {
    const newElements = [...elements];
    newElements[index] = { ...newElements[index], x: data.x, y: data.y };
    setElements(newElements);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const savePdf = async () => {
    const canvas = await html2canvas(editorRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("edited.pdf");
  };

  return (
    <div className="pdf-editor">
      <div className="toolbar">
        <button onClick={() => addElement("text")}>Text</button>
        <button onClick={() => addElement("multiText")}>Multi Text</button>
        <button onClick={() => addElement("radio")}>Radio Button</button>
        <button onClick={() => addElement("checkbox")}>Checkbox</button>
        <button onClick={() => addElement("signature")}>Signature</button>
        <button onClick={() => addElement("photo")}>Photo</button>
        <button onClick={savePdf}>Save PDF</button>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Drag 'n' drop a PDF, or click to select one</p>
        </div>
      </div>
      <div className="pdf-container" ref={editorRef}>
        {pdfFile && (
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        )}
        <div className="elements-container">
          {elements.map((element, index) => (
            <DraggableCore
              key={element.id}
              onDrag={(e, data) => handleDrag(e, data, index)}
              defaultPosition={{ x: element.x, y: element.y }}
            >
              <div className={`pdf-element ${element.type}`}>{element.type}</div>
            </DraggableCore>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PdfEditor;
