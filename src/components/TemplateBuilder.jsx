import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import Draggable from "react-draggable";
import { v4 as uuidv4 } from "uuid";
import TextEditor from "./textEditor"; // Import the TextEditor component
import "./PdfComponents.css";

const PdfComponents = () => {
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [elements, setElements] = useState([]);
  const [selectedElementType, setSelectedElementType] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const [rendered, setRendered] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [pdfText, setPdfText] = useState(""); // State to hold extracted text
  const pdfCanvasRef = useRef(null);

  useEffect(() => {
    if (pdf && !rendered) {
      renderPdf();
      setRendered(true);
    }
  }, [pdf, rendered]);

  useEffect(() => {
    if (pdfDoc) {
      setNumPages(pdfDoc.numPages);
      extractTextFromPdf(); // Extract text when pdfDoc is set
    }
  }, [pdfDoc]);

  useEffect(() => {
    if (pdfDoc && pdfPages.length === 0) {
      renderPages();
    }
  }, [pdfDoc, pdfPages]);

  const renderPdf = async () => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.js";
    script.async = true;
    script.onload = async () => {
      try {
        const pdfData = new Uint8Array(pdf);
        const loadedPdf = await window.pdfjsLib.getDocument(pdfData).promise;
        setPdfDoc(loadedPdf);
      } catch (error) {
        setPdfError(error.message);
      }
    };
    document.body.appendChild(script);
  };

  const renderPages = async () => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDoc.getPage(i);
      pages.push(page);
    }
    setPdfPages(pages);
  };

  const extractTextFromPdf = async () => {
    let fullText = "";
    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(" ");
      fullText += pageText + " ";
    }
    setPdfText(fullText.trim());
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setPdf(reader.result);
    };
    reader.readAsArrayBuffer(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleTextAdd = () => {
    setElements([...elements, { type: "text", id: uuidv4(), content: "", x: 50, y: 50 }]);
  };

  const handleElementDrag = (index, x, y) => {
    const updatedElements = [...elements];
    updatedElements[index].x = x;
    updatedElements[index].y = y;
    setElements(updatedElements);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (selectedElementType) {
      const { offsetX, offsetY } = e.nativeEvent;
      setElements([...elements, { type: selectedElementType, id: uuidv4(), x: offsetX, y: offsetY }]);
    }
  };

  const handleDragStart = (e, type) => {
    setSelectedElementType(type);
  };

  const renderElements = () => {
    return elements.map((element, index) => {
      if (element.type === "text") {
        return (
          <Draggable key={element.id} defaultPosition={{ x: element.x, y: element.y }} onStop={(e, data) => handleElementDrag(index, data.x, data.y)}>
            <div className="text-box">
              <TextEditor content={element.content} onContentChange={(content) => {
                const updatedElements = [...elements];
                updatedElements[index].content = content;
                setElements(updatedElements);
              }} />
            </div>
          </Draggable>
        );
      }
      return null;
    });
  };

  useEffect(() => {
    if (pdfDoc && pdfPages.length > 0) {
      const canvas = pdfCanvasRef.current;
      const context = canvas.getContext("2d");
      const page = pdfPages[pageNumber - 1];
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      page.render(renderContext);
    }
  }, [pdfPages, pageNumber, pdfDoc]);

  const saveReport = () => {
    const report = {
      elements,
      extractedText: pdfText,
    };
    localStorage.setItem('pdfReport', JSON.stringify(report));
    alert("Report saved!");
  };

  return (
    <div className="pdf-components" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <div className="tools-card">
      
        <button onClick={saveReport}>Save Report</button>
      </div>
      <div className="pdf-canvas">
        <div className="upload-area" {...getRootProps()}>
          <input {...getInputProps()} />
          <button>Drag & drop a PDF here, or click to select one</button>
        </div>
        {pdf && (
          <div className="pdf-container">
            <canvas id="pdf-render" ref={pdfCanvasRef}></canvas>
            <div className="overlay-elements">{renderElements()}</div>
          </div>
        )}
      </div>
      {numPages && (
        <div className="pagination">
          <button disabled={pageNumber <= 1} onClick={() => handlePageChange(pageNumber - 1)}>Previous</button>
          <p>Page {pageNumber} of {numPages}</p>
          <button disabled={pageNumber >= numPages} onClick={() => handlePageChange(pageNumber + 1)}>Next</button>
        </div>
      )}
      {pdfError && <div className="pdf-error">{pdfError}</div>}
      <div className="pdf-text">
        <h3>Extracted Text (<b>May take  time extracting.....)</b></h3>
        <TextEditor content={pdfText} onContentChange={setPdfText} />
      </div>
    </div>
  );
};

export default PdfComponents;
