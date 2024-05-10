import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import Draggable from 'react-draggable';
import { v4 as uuidv4 } from "uuid";
import "./PdfComponents.css"; // Import CSS file for styling

const PdfComponents = () => {
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [elements, setElements] = useState([]);
  const [selectedElementType, setSelectedElementType] = useState(null);
  const [showGrid, setShowGrid] = useState(true);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const [rendered, setRendered] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const gridCanvasRef = useRef(null);
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
    }
  }, [pdfDoc]);

  useEffect(() => {
    if (pdfDoc && pdfPages.length === 0) {
      renderPages();
    }
  }, [pdfDoc, pdfPages]);

  const renderPdf = async () => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.js';
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

  const drawGrid = (context, viewport) => {
    const gridSize = 20;
    context.beginPath();
    context.strokeStyle = "#000";
    for (let x = 0; x < viewport.width; x += gridSize) {
      for (let y = 0; y < viewport.height; y += gridSize) {
        context.rect(x, y, gridSize, gridSize);
      }
    }
    context.stroke();
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
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
    setElements([...elements, { type: "text", id: uuidv4(), content: "New Text", x: 50, y: 50 }]);
  };

  const handleShapeAdd = (shape) => {
    setElements([...elements, { type: "shape", id: uuidv4(), shape, x: 50, y: 50 }]);
  };

  const handleButtonAdd = () => {
    setElements([...elements, { type: "button", id: uuidv4(), text: "Button", x: 50, y: 50 }]);
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
          <Draggable key={element.id} defaultPosition={{ x: element.x, y: element.y }} onDrag={(e, data) => handleElementDrag(index, data.x, data.y)}>
            <div className="text-box">{element.content}</div>
          </Draggable>
        );
      } else if (element.type === "shape") {
        return (
          <Draggable key={element.id} defaultPosition={{ x: element.x, y: element.y }} onDrag={(e, data) => handleElementDrag(index, data.x, data.y)}>
            <div className={`shape-${element.shape}`}></div>
          </Draggable>
        );
      } else if (element.type === "button") {
        return (
          <Draggable key={element.id} defaultPosition={{ x: element.x, y: element.y }} onDrag={(e, data) => handleElementDrag(index, data.x, data.y)}>
            <button className="overlay-button">{element.text}</button>
          </Draggable>
        );
      }
      return null;
    });
  };

  useEffect(() => {
    if (showGrid && pdfDoc && pdfPages.length > 0) {
      const canvas = gridCanvasRef.current;
      const context = canvas.getContext("2d");
      const page = pdfPages[pageNumber - 1];
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid(context, viewport);
    }
  }, [showGrid, pageNumber, pdfPages, pdfDoc]);

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

  return (
    <div className="pdf-components" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
      <div className="tools-card">
        <div className="tool" draggable onDragStart={(e) => handleDragStart(e, "text")}>
          <span role="img" aria-label="Textbox">📝</span>
          <span>Text Box</span>
        </div>
        <div className="tool" draggable onDragStart={(e) => handleDragStart(e, "square")}>
          <span role="img" aria-label="Square">▢</span>
          <span>Square</span>
        </div>
        <div className="tool" draggable onDragStart={(e) => handleDragStart(e, "circle")}>
          <span role="img" aria-label="Circle">◯</span>
          <span>Circle</span>
        </div>
        <div className="tool" draggable onDragStart={(e) => handleDragStart(e, "triangle")}>
          <span role="img" aria-label="Triangle">△</span>
          <span>Triangle</span>
        </div>
        <div className="tool" draggable onDragStart={(e) => handleDragStart(e, "button")}>
          <span role="img" aria-label="Button">🔘</span>
          <span>Button</span>
        </div>
      </div>
      <div className="pdf-canvas">
        <div className="upload-area" {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Drag & drop a PDF here, or click to select one</p>
        </div>
        {pdf && (
          <div className="pdf-container">
            <canvas id="pdf-render" ref={pdfCanvasRef}></canvas>
            {showGrid && (
              <canvas id="grid-canvas" ref={gridCanvasRef}></canvas>
            )}
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
      <div className="toggle-grid">
        <label>
          <input type="checkbox" checked={showGrid} onChange={toggleGrid} />
          Show Grid
        </label>
      </div>
      {selectedElementType === "text" && (
        <div className="tooltip">Drag and drop to add a text box</div>
      )}
      {selectedElementType && selectedElementType !== "text" && (
        <div className="tooltip">Click on the canvas to add {selectedElementType}</div>
      )}
      {pdfError && <div className="pdf-error">{pdfError}</div>}
    </div>
  );
};

export default PdfComponents;
