import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { PDFDocument, rgb } from "pdf-lib";
import * as fontkit from "fontkit";
import { storage, db } from "../auth/firebase";
import TextBox from "./TextBox";
import SignatureBox from "./SignatureBox";
import Toolbar from "./Toolbar";
import PdfViewer from "./PdfViewer";
import Draggable from "react-draggable";
import { FaInfoCircle } from "react-icons/fa";

const PdfComponents = () => {
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [elements, setElements] = useState([]);
  const [selectedElementType, setSelectedElementType] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pdfPages, setPdfPages] = useState([]);
  const [rendered, setRendered] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [textBoxVisible, setTextBoxVisible] = useState(false);
  const [textBoxContent, setTextBoxContent] = useState('');
  const [textBoxFont, setTextBoxFont] = useState('Arial');
  const [textBoxColor, setTextBoxColor] = useState('#000000');
  const [textBoxFontWeight, setTextBoxFontWeight] = useState('normal');
  const [textBoxFontSize, setTextBoxFontSize] = useState(12);
  const [imageFile, setImageFile] = useState(null);
  const [errorPopup, setErrorPopup] = useState(false);
  const [signatureBoxVisible, setSignatureBoxVisible] = useState(false);
  const [signatureContent, setSignatureContent] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawings, setDrawings] = useState([]);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [highlights, setHighlights] = useState([]);
  const [isErasing, setIsErasing] = useState(false);
  const [savePopup, setSavePopup] = useState(false);
  const imageInputRef = useRef(null);
  const pdfCanvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const pdfContainerRef = useRef(null);
  const startX = useRef(0);
  const startY = useRef(0);

  useEffect(() => {
    const loadFont = () => {
      const link = document.createElement("link");
      link.href = "https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    };
    loadFont();
  }, []);

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

  useEffect(() => {
    if (errorPopup) {
      const timer = setTimeout(() => {
        setErrorPopup(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [errorPopup]);

  useEffect(() => {
    if (savePopup) {
      const timer = setTimeout(() => {
        setSavePopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [savePopup]);

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

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setPdf(reader.result);
      setPdfDoc(null);
      setPdfPages([]);
      setPageNumber(1);
      setElements([]);
      setPdfError(null);
      setRendered(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleTextAdd = () => {
    if (!pdf) {
      setErrorPopup(true);
      return;
    }
    setSelectedElementType("text");
    setTextBoxVisible(true);
  };

  const handleTextSubmit = () => {
    if (textBoxContent) {
      setElements([...elements, { type: "text", id: uuidv4(), content: textBoxContent || 'Type here', x: 50, y: 50, font: textBoxFont, color: textBoxColor, fontWeight: textBoxFontWeight, fontSize: textBoxFontSize, page: pageNumber }]);
      setTextBoxVisible(false);
      setTextBoxContent('');
      setSelectedElementType(null);
    }
  };

  const handleShapeAdd = (shape) => {
    if (!pdf) {
      setErrorPopup(true);
      return;
    }
    setElements([...elements, { type: "shape", id: uuidv4(), shape, x: 50, y: 50, width: 30, height: 30, color: 'black', page: pageNumber }]);
    setSelectedElementType(null);
  };

  const handleImageAdd = () => {
    if (!pdf) {
      setErrorPopup(true);
      return;
    }
    setSelectedElementType("image");
    imageInputRef.current.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageFile(reader.result);
      setElements([...elements, { type: "image", id: uuidv4(), src: reader.result, x: 50, y: 50, width: 100, height: 100, page: pageNumber }]);
      setSelectedElementType(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDateAdd = () => {
    if (!pdf) {
      setErrorPopup(true);
      return;
    }
    const currentDate = new Date().toLocaleDateString();
    setElements([...elements, { type: "date", id: uuidv4(), content: currentDate, x: 50, y: 50, fontSize: 14, font: "Helvetica", color: "#000000", fontWeight: 'bold', page: pageNumber }]);
    setSelectedElementType(null);
  };

  const handleSignatureAdd = () => {
    if (!pdf) {
      setErrorPopup(true);
      return;
    }
    setSelectedElementType("signature");
    setSignatureBoxVisible(true);
  };

  const handleSignatureSubmit = () => {
    if (signatureContent) {
      setElements([...elements, { type: "signature", id: uuidv4(), content: signatureContent || 'Type here', x: 50, y: 50, font: 'Great Vibes', fontSize: 32, color: '#000000', page: pageNumber }]);
      setSignatureBoxVisible(false);
      setSignatureContent('');
      setSelectedElementType(null);
    }
  };

  const handleXAdd = () => {
    if (!pdf) {
      setErrorPopup(true);
      return;
    }
    setElements([...elements, { type: "x", id: uuidv4(), content: "x", x: 50, y: 50, color: "black", fontSize: 24, font: 'Helvetica', page: pageNumber }]);
    setSelectedElementType(null);
  };

  const handleTickAdd = () => {
    if (!pdf) {
      setErrorPopup(true);
      return;
    }
    setElements([...elements, { type: "tick", id: uuidv4(), content: "✔", x: 50, y: 50, color: "black", fontSize: 24, font: 'Helvetica', page: pageNumber }]);
    setSelectedElementType(null);
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
      setElements([...elements, { type: selectedElementType, id: uuidv4(), x: offsetX, y: offsetY, page: pageNumber }]);
      setSelectedElementType(null);
    }
  };

  const handleDragStart = (e, type) => {
    setSelectedElementType(type);
  };

  const handleContentChange = (index, content) => {
    const updatedElements = [...elements];
    updatedElements[index].content = content;
    setElements(updatedElements);
  };

  const handleTextClick = (index) => {
    const newText = prompt("Enter new text:", elements[index].content);
    if (newText !== null) {
      handleContentChange(index, newText);
    }
  };

  const handleResize = (index, size) => {
    const updatedElements = [...elements];
    updatedElements[index].width = size.width;
    updatedElements[index].height = size.height;
    setElements(updatedElements);
  };

  const handleDrawingStart = () => {
    setIsDrawing(!isDrawing);
    setSelectedElementType(isDrawing ? null : "drawing");
  };

  const handleHighlightStart = () => {
    setIsHighlighting(!isHighlighting);
    setSelectedElementType(isHighlighting ? null : "highlighting");
  };

  const handleEraserStart = () => {
    setIsErasing(!isErasing);
    setSelectedElementType(isErasing ? null : "erasing");
  };

  const handleMouseDown = (e) => {
    if (isHighlighting) {
      const { offsetX, offsetY } = e.nativeEvent;
      startX.current = offsetX;
      startY.current = offsetY;
    } else if (isDrawing) {
      const canvas = overlayCanvasRef.current;
      const ctx = canvas.getContext("2d");
      const { offsetX, offsetY } = e.nativeEvent;
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
      setDrawings([...drawings, { x: offsetX, y: offsetY, type: "begin", page: pageNumber }]);
    } else if (isErasing) {
      const canvas = overlayCanvasRef.current;
      const ctx = canvas.getContext("2d");
      const { offsetX, offsetY } = e.nativeEvent;
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    }
  };

  const handleMouseMove = (e) => {
    if (isHighlighting) return;
    if (isErasing) {
      const canvas = overlayCanvasRef.current;
      const ctx = canvas.getContext("2d");
      const { offsetX, offsetY } = e.nativeEvent;
      ctx.lineTo(offsetX, offsetY);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 5;
      ctx.stroke();
      return;
    }
    if (!isDrawing) return;
    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const { offsetX, offsetY } = e.nativeEvent;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    setDrawings([...drawings, { x: offsetX, y: offsetY, type: "draw", page: pageNumber }]);
  };

  const handleMouseUp = (e) => {
    if (isHighlighting) {
      const { offsetX, offsetY } = e.nativeEvent;
      const width = offsetX - startX.current;
      const height = offsetY - startY.current;
      setHighlights([...highlights, { x: startX.current, y: startY.current, width, height, page: pageNumber }]);
    } else if (isDrawing) {
      const canvas = overlayCanvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.closePath();
    } else if (isErasing) {
      const canvas = overlayCanvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.closePath();
    }
  };

  const handleSave = async () => {
  if (!pdfDoc) return;

  try {
    const pdfDocLib = await PDFDocument.load(pdf);
    pdfDocLib.registerFontkit(fontkit);

    // Load custom font
    const fontUrl = '/src/assets/fonts/GreatVibes-Regular.ttf'; // Ensure this path is correct
    const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
    const customFont = await pdfDocLib.embedFont(fontBytes);
    const helveticaFont = await pdfDocLib.embedFont(StandardFonts.Helvetica);
    const pages = pdfDocLib.getPages();

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();

      // Filter elements for the current page
      const pageElements = elements.filter(element => element.page === i + 1);

      for (const element of pageElements) {
        const yPos = height - element.y; // Correct y position for PDF rendering

        switch (element.type) {
          case "text":
          case "date":
          case "signature":
          case "x":
          case "tick":
            const rgbColor = hexToRgb(element.color);
            page.drawText(element.content, {
              x: element.x,
              y: yPos - element.fontSize,
              size: element.fontSize,
              font: element.type === "signature" ? customFont : helveticaFont,
              color: rgbColor,
            });
            break;
          case "shape":
            if (element.shape === "circle") {
              page.drawEllipse({
                x: element.x + element.width / 2,
                y: yPos - element.height / 2,
                xScale: element.width / 2,
                yScale: element.height / 2,
                borderColor: hexToRgb(element.color),
                borderWidth: 2,
              });
            }
            // Add cases for other shapes as needed
            break;
          case "image":
            const imageBytes = await fetch(element.src).then(res => res.arrayBuffer());
            const pdfImage = await pdfDocLib.embedPng(imageBytes);
            page.drawImage(pdfImage, {
              x: element.x,
              y: yPos - element.height,
              width: element.width,
              height: element.height,
            });
            break;
        }
      }

      // Add highlights
      const pageHighlights = highlights.filter(h => h.page === i + 1);
      for (const highlight of pageHighlights) {
        page.drawRectangle({
          x: highlight.x,
          y: height - highlight.y - highlight.height,
          width: highlight.width,
          height: highlight.height,
          color: rgb(1, 1, 0),
          opacity: 0.5,
        });
      }

      // Add drawings
      const pageDrawings = drawings.filter(d => d.page === i + 1);
      if (pageDrawings.length > 0) {
        const drawingsStream = pdfDocLib.context.addContentStream();
        let drawingPath = '';
        for (const drawing of pageDrawings) {
          if (drawing.type === "begin") {
            drawingPath += `${drawing.x} ${height - drawing.y} m `;
          } else {
            drawingPath += `${drawing.x} ${height - drawing.y} l `;
          }
        }
        drawingsStream.push(`1 0 0 RG\n0.5 w\n${drawingPath}S\n`);
        page.addContentStreams(drawingsStream);
      }
    }

    const pdfBytes = await pdfDocLib.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const file = new File([blob], 'modified.pdf', { type: 'application/pdf' });

    const storageRef = storage.ref();
    const fileRef = storageRef.child(`modified_pdfs/${uuidv4()}.pdf`);
    await fileRef.put(blob);

    await db.collection('inspectionForms').add({
      title: 'Modified PDF',
      fileUrl: await fileRef.getDownloadURL(),
      createdAt: new Date(),
    });

    setSavePopup(true);
  } catch (error) {
    console.error("Error saving PDF:", error);
    setPdfError(error.message);
  }
};

// Helper function to convert hex color to rgb with error handling
const hexToRgb = (color) => {
  // Handle named colors
  const namedColors = {
    black: '#000000',
    white: '#FFFFFF',
    red: '#FF0000',
    green: '#00FF00',
    blue: '#0000FF',
    // Add more named colors as needed
  };

  if (namedColors[color.toLowerCase()]) {
    color = namedColors[color.toLowerCase()];
  }

  if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
    throw new Error(`Invalid color: ${color}`);
  }

  let r, g, b;
  if (color.length === 4) {
    r = parseInt(color[1] + color[1], 16);
    g = parseInt(color[2] + color[2], 16);
    b = parseInt(color[3] + color[3], 16);
  } else {
    r = parseInt(color.slice(1, 3), 16);
    g = parseInt(color.slice(3, 5), 16);
    b = parseInt(color.slice(5, 7), 16);
  }

  return rgb(r / 255, g / 255, b / 255);
};


  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#333", maxWidth: "100%", overflowX: "hidden" }}>
      <Toolbar
        handleTextAdd={handleTextAdd}
        handleShapeAdd={handleShapeAdd}
        handleDateAdd={handleDateAdd}
        handleSignatureAdd={handleSignatureAdd}
        handleXAdd={handleXAdd}
        handleTickAdd={handleTickAdd}
        handleImageAdd={handleImageAdd}
        handleDrawingStart={handleDrawingStart}
        handleHighlightStart={handleHighlightStart}
        handleEraserStart={handleEraserStart}
        handleSave={handleSave}
        selectedElementType={selectedElementType}
        imageInputRef={imageInputRef}
        handleImageUpload={handleImageUpload}
      />
      <div {...getRootProps()} style={{ border: "2px dashed #ccc", borderRadius: "5px", padding: "30px", textAlign: "center", margin: "20px 0", backgroundColor: "#e9ecef", color: "#6c757d" }}>
        <input {...getInputProps()} />
        <p style={{ margin: 0 }}>Drag & drop a PDF here, or click to select one</p>
      </div>
      <div ref={pdfContainerRef} style={{ position: "relative" }}>
        {!pdf && (
          <p style={{ textAlign: "center", color: "#007bff", marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FaInfoCircle style={{ marginRight: "8px" }} />
            Drop a PDF and modify it at your will. Press Save to check the modified version in the report dashboard.
          </p>
        )}
        {pdf && (
          <>
            <PdfViewer
              pdfPages={pdfPages}
              pageNumber={pageNumber}
              pdfDoc={pdfDoc}
              highlights={highlights}
              drawings={drawings}
              isDrawing={isDrawing}
              isHighlighting={isHighlighting}
              isErasing={isErasing}
              handleMouseDown={handleMouseDown}
              handleMouseMove={handleMouseMove}
              handleMouseUp={handleMouseUp}
              pdfCanvasRef={pdfCanvasRef}
            />
            <canvas
              ref={overlayCanvasRef}
              width={pdfContainerRef.current ? pdfContainerRef.current.clientWidth : 0}
              height={pdfContainerRef.current ? pdfContainerRef.current.clientHeight : 0}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 10,
                pointerEvents: 'none',
              }}
            />
          </>
        )}
        {elements.map((element, index) => (
          <Draggable
            key={element.id}
            bounds="parent"
            defaultPosition={{ x: element.x, y: element.y }}
            onStop={(e, data) => handleElementDrag(index, data.x, data.y)}
          >
            <div
              style={{
                position: "absolute",
                cursor: "move",
                userSelect: "none",
              }}
            >
              {element.type === "text" && (
                <span
                  style={{
                    fontSize: `${element.fontSize}px`,
                    fontFamily: element.font,
                    fontWeight: element.fontWeight,
                    color: element.color,
                  }}
                >
                  {element.content || "Type here"}
                </span>
              )}
              {element.type === "signature" && (
                <span
                  style={{
                    fontSize: `${element.fontSize}px`,
                    fontFamily: element.font,
                    color: element.color,
                  }}
                >
                  {element.content || "Type here"}
                </span>
              )}
              {element.type === "x" && (
                <span
                  style={{
                    fontSize: `${element.fontSize}px`,
                    fontFamily: element.font,
                    color: element.color,
                  }}
                >
                  {element.content}
                </span>
              )}
              {element.type === "tick" && (
                <span
                  style={{
                    fontSize: `${element.fontSize}px`,
                    fontFamily: element.font,
                    color: element.color,
                  }}
                >
                  {element.content}
                </span>
              )}
              {element.type === "image" && (
                <img
                  src={element.src}
                  alt="Uploaded"
                  style={{
                    width: element.width,
                    height: element.height,
                    objectFit: "cover",
                  }}
                />
              )}
              {element.type === "date" && (
                <span
                  style={{
                    fontSize: `${element.fontSize}px`,
                    fontFamily: element.font,
                    color: element.color,
                    fontWeight: element.fontWeight,
                  }}
                >
                  {element.content}
                </span>
              )}
              {element.type === "shape" && element.shape === "circle" && (
                <div
                  style={{
                    width: `${element.width}px`,
                    height: `${element.height}px`,
                    borderRadius: "50%",
                    border: '2px solid black',
                    backgroundColor: 'transparent',
                  }}
                ></div>
              )}
            </div>
          </Draggable>
        ))}
      </div>
      {textBoxVisible && (
        <TextBox
          textBoxContent={textBoxContent}
          setTextBoxContent={setTextBoxContent}
          textBoxFont={textBoxFont}
          setTextBoxFont={setTextBoxFont}
          textBoxFontWeight={textBoxFontWeight}
          setTextBoxFontWeight={setTextBoxFontWeight}
          textBoxFontSize={textBoxFontSize}
          setTextBoxFontSize={setTextBoxFontSize}
          textBoxColor={textBoxColor}
          setTextBoxColor={setTextBoxColor}
          handleTextSubmit={handleTextSubmit}
          setTextBoxVisible={setTextBoxVisible}
        />
      )}
      {signatureBoxVisible && (
        <SignatureBox
          signatureContent={signatureContent}
          setSignatureContent={setSignatureContent}
          handleSignatureSubmit={handleSignatureSubmit}
          setSignatureBoxVisible={setSignatureBoxVisible}
        />
      )}
      {numPages && (
        <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
          <button
            style={{ padding: "10px 20px", margin: "0 10px", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
            disabled={pageNumber <= 1}
            onClick={() => handlePageChange(pageNumber - 1)}
          >
            Previous
          </button>
          <p>Page {pageNumber} of {numPages}</p>
          <button
            style={{ padding: "10px 20px", margin: "0 10px", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
            disabled={pageNumber >= numPages}
            onClick={() => handlePageChange(pageNumber + 1)}
          >
            Next
          </button>
        </div>
      )}
      {selectedElementType && (
        <div style={{ position: "fixed", bottom: "10px", left: "50%", transform: "translateX(-50%)", padding: "10px", background: "#333", color: "#fff", borderRadius: "4px" }}>
          {selectedElementType === "text" ? "Drag and drop to add a text box" : `Click on the canvas to add ${selectedElementType}`}
        </div>
      )}
      {pdfError && <div style={{ color: "red", textAlign: "center", marginTop: "10px" }}>{pdfError}</div>}
      {errorPopup && (
        <div style={{ position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", padding: "10px 20px", background: "#6c757d", color: "#fff", borderRadius: "4px", zIndex: 1000 }}>
          <p style={{ margin: 0 }}>Please upload a PDF first.</p>
        </div>
      )}
      {savePopup && (
        <div style={{ position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", padding: "10px 20px", background: "#28a745", color: "#fff", borderRadius: "4px", zIndex: 1000 }}>
          <p style={{ margin: 0 }}>PDF saved successfully!</p>
          <p style={{ margin: 0 }}>Check the Report Dashboard.</p>
        </div>
      )}
    </div>
  );
};

export default PdfComponents;

