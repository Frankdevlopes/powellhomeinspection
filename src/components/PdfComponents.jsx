import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as fontkit from "fontkit";
import { storage, db } from "../auth/firebase";
import Draggable from "react-draggable";
import { FaInfoCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify"; // Importing react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Importing toastify CSS
import GreatVibesFont from '../assets/fonts/GreatVibes-Regular.ttf';
const PdfComponents = () => {
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [elements, setElements] = useState([]);
  const [selectedElementType, setSelectedElementType] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pdfLibDoc, setPdfLibDoc] = useState(null); // State for pdf-lib document
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

        // Load the PDF with pdf.js for rendering
        const loadedPdf = await window.pdfjsLib.getDocument(pdfData).promise;
        setPdfDoc(loadedPdf);

        // Load the PDF with pdf-lib for modification
        const pdfLibDoc = await PDFDocument.load(pdfData);
        setPdfLibDoc(pdfLibDoc); // Set pdf-lib document state
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
      setPdfLibDoc(null); // Reset pdf-lib document state
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
    if (!pdfLibDoc) {
        console.error("No PDF document loaded for saving");
        toast.error("No PDF document loaded for saving. Please upload a document first.", {
            position: "top-right",
            autoClose: 3000,
        });
        return;
    }

    console.log("Elements to save:", elements);

    try {
        const pages = pdfLibDoc.getPages();
        const firstPage = pages[0];
        const pageHeight = firstPage.getHeight();

        for (const element of elements) {
            const { x, y, width, height, content, fontSize, color, type, src } = element;
            const pdfX = x;
            const pdfY = pageHeight - y; // Removed height subtraction

            switch (type) {
                case "text":
                    console.log("Drawing text:", content, "at", pdfX, pdfY);
                    let font;
                    try {
                        font = await pdfLibDoc.embedFont(StandardFonts.Helvetica);
                    } catch (error) {
                        console.error("Error embedding font:", error);
                        font = await pdfLibDoc.embedFont(StandardFonts.Courier);
                    }
                    firstPage.drawText(content, {
                        x: pdfX,
                        y: pdfY,
                        size: fontSize || 24,
                        font: font,
                        color: hexToRgb(color || '#000000') || rgb(0, 0, 0),
                    });
                    break;

                case "date":
                    console.log("Drawing date at", pdfX, pdfY);
                    let dateFont;
                    try {
                        dateFont = await pdfLibDoc.embedFont(StandardFonts.Helvetica);
                    } catch (error) {
                        console.error("Error embedding date font:", error);
                        dateFont = await pdfLibDoc.embedFont(StandardFonts.Courier);
                    }
                    firstPage.drawText(new Date().toLocaleDateString(), {
                        x: pdfX,
                        y: pdfY,
                        size: fontSize || 14,
                        font: dateFont,
                        color: hexToRgb(color || '#000000') || rgb(0, 0, 0),
                    });
                    break;

                case "image":
                    console.log("Drawing image at", pdfX, pdfY);
                    const img = src.endsWith('.png')
                        ? await pdfLibDoc.embedPng(src)
                        : await pdfLibDoc.embedJpg(src);
                    firstPage.drawImage(img, {
                        x: pdfX,
                        y: pdfY - height,
                        width: width,
                        height: height,
                    });
                    break;

                case "erase":
                    console.log("Erasing area at", pdfX, pdfY);
                    firstPage.drawRectangle({
                        x: pdfX,
                        y: pdfY,
                        width: width,
                        height: height,
                        color: rgb(1, 1, 1),
                    });
                    break;

                default:
                    console.error(`Unknown element type: ${type}`);
            }
        }

        // Save the modified PDF
        const pdfBytes = await pdfLibDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        // Generate a unique file name using uuid
        const fileName = `modified-document-${uuidv4()}.pdf`;

        // Upload the file to Firebase Storage
        const storageRef = storage.ref().child(`pdfs/${fileName}`);
        const uploadTask = storageRef.put(blob);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Progress can be handled here if needed
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload progress: ${progress}%`);
            },
            (error) => {
                console.error("Upload failed:", error);
                toast.error("Failed to upload PDF to Firebase. Please try again.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            },
            async () => {
                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                console.log("PDF uploaded successfully! File available at", downloadURL);

                // Save the PDF metadata to Firestore
                await db.collection('inspectionForms').add({
                    title: "Modified PDF",  // Replace with your dynamic title
                    fileUrl: downloadURL,
                    timestamp: new Date()
                });

                toast.success("PDF saved and uploaded successfully!", {
                    position: "top-right",
                    autoClose: 3000,
                });

                // Additional toast to inform user to check the report dashboard
                toast.info("Check the report dashboard to view your saved PDF.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        );

    } catch (error) {
        console.error("Error saving PDF:", error);
        toast.error("Error saving PDF. Please try again.", {
            position: "top-right",
            autoClose: 3000,
        });
    }
};

  const hexToRgb = (color) => {
    const namedColors = {
      black: '#000000',
      white: '#FFFFFF',
      red: '#FF0000',
      green: '#00FF00',
      blue: '#0000FF',
    };
  
    if (namedColors[color.toLowerCase()]) {
      color = namedColors[color.toLowerCase()];
    }
  
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
      console.warn(`Invalid color: ${color}, defaulting to black`);
      return rgb(0, 0, 0);
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
      <ToastContainer /> {/* Ensure ToastContainer is included here */}
      <div {...getRootProps()} style={{ border: "2px dashed #ccc", borderRadius: "5px", padding: "30px", textAlign: "center", margin: "20px 0", backgroundColor: "#e9ecef", color: "#6c757d" }}>
        <input {...getInputProps()} />
        <p style={{ margin: 0 }}>Drag & drop a PDF here, or click to select one</p>
      </div>
      <div ref={pdfContainerRef} style={{ position: "relative" }}>
        {!pdf && (
          <p style={{ textAlign: "center", color: "#007bff", marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FaInfoCircle style={{ marginRight: "8px" }} />
            Drop a PDF and modify it at your will. Press Save to check the modified version in the report dashboard drag the elements from the bottom of the pdf.
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
                  }}>
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
        <div style={{ position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", padding: "10px", background: "#fff", border: "1px solid #ccc", borderRadius: "4px", zIndex: 1000 }}>
          <input
            type="text"
            value={textBoxContent}
            onChange={(e) => setTextBoxContent(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <select value={textBoxFont} onChange={(e) => setTextBoxFont(e.target.value)} style={{ marginRight: "10px" }}>
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
          </select>
          <select value={textBoxFontWeight} onChange={(e) => setTextBoxFontWeight(e.target.value)} style={{ marginRight: "10px" }}>
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
          </select>
          <input
            type="number"
            value={textBoxFontSize}
            onChange={(e) => setTextBoxFontSize(parseInt(e.target.value))}
            style={{ marginRight: "10px" }}
            min="8"
            max="72"
          />
          <input
            type="color"
            value={textBoxColor}
            onChange={(e) => setTextBoxColor(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <button onClick={handleTextSubmit} style={{ padding: "5px 10px", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Add Text
          </button>
          <button onClick={() => setTextBoxVisible(false)} style={{ padding: "5px 10px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", marginLeft: "10px" }}>
            Cancel
          </button>
        </div>
      )}
      {signatureBoxVisible && (
        <div style={{ position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", padding: "10px", background: "#fff", border: "1px solid #ccc", borderRadius: "4px", zIndex: 1000 }}>
          <input
            type="text"
            value={signatureContent}
            onChange={(e) => setSignatureContent(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <button onClick={handleSignatureSubmit} style={{ padding: "5px 10px", background: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Add Signature
          </button>
          <button onClick={() => setSignatureBoxVisible(false)} style={{ padding: "5px 10px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", marginLeft: "10px" }}>
            Cancel
          </button>
        </div>
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

const Toolbar = ({
  handleTextAdd,
  handleShapeAdd,
  handleDateAdd,
  handleSignatureAdd,
  handleXAdd,
  handleTickAdd,
  handleImageAdd,
  handleDrawingStart,
  handleHighlightStart,
  handleEraserStart,
  handleSave,
  selectedElementType,
  imageInputRef,
  handleImageUpload,
}) => {
  return (
    <div style={{ display: "flex", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px", justifyContent: "space-around", marginBottom: "20px" }}>
      <button className="flex flex-col items-center p-2 hover:bg-muted rounded" onClick={handleTextAdd} style={{ backgroundColor: selectedElementType === "text" ? "#1c7430" : "#28a745", color: "#fff", border: "none", borderRadius: "4px", padding: "10px", cursor: "pointer" }}>
        <img aria-hidden="true" alt="text" src="https://openui.fly.dev/openui/24x24.svg?text=T" />
        <span className="text-xs">Text</span>
      </button>
      <button className="flex flex-col items-center p-2 hover:bg-muted rounded" onClick={() => handleShapeAdd("circle")} style={{ backgroundColor: selectedElementType === "shape" ? "#cc8400" : "#ffc107", color: "#fff", border: "none", borderRadius: "4px", padding: "10px", cursor: "pointer" }}>
        <img aria-hidden="true" alt="circle" src="https://openui.fly.dev/openui/24x24.svg?text=⭕" />
        <span className="text-xs">Circle</span>
      </button>
      <button className="flex flex-col items-center p-2 hover:bg-muted rounded" onClick={handleDateAdd} style={{ backgroundColor: selectedElementType === "date" ? "#5a6268" : "#6c757d", color: "#fff", border: "none", borderRadius: "4px", padding: "10px", cursor: "pointer" }}>
        <img aria-hidden="true" alt="date" src="https://openui.fly.dev/openui/24x24.svg?text=📅" />
        <span className="text-xs">Date</span>
      </button>
      <button className="flex flex-col items-center p-2 hover:bg-muted rounded" onClick={handleSignatureAdd} style={{ backgroundColor: selectedElementType === "signature" ? "#127c8d" : "#17a2b8", color: "#fff", border: "none", borderRadius: "4px", padding: "10px", cursor: "pointer" }}>
        <img aria-hidden="true" alt="signature" src="https://openui.fly.dev/openui/24x24.svg?text=✒️" />
        <span className="text-xs">Signature</span>
      </button>
      <button className="flex flex-col items-center p-2 hover:bg-muted rounded" onClick={handleXAdd} style={{ backgroundColor: selectedElementType === "x" ? "#a71d2a" : "#dc3545", color: "#fff", border: "none", borderRadius: "4px", padding: "10px", cursor: "pointer" }}>
        <img aria-hidden="true" alt="x" src="https://openui.fly.dev/openui/24x24.svg?text=X" />
        <span className="text-xs">X</span>
      </button>
      <button className="flex flex-col items-center p-2 hover:bg-muted rounded" onClick={handleTickAdd} style={{ backgroundColor: selectedElementType === "tick" ? "#1c7430" : "#28a745", color: "#fff", border: "none", borderRadius: "4px", padding: "10px", cursor: "pointer" }}>
        <img aria-hidden="true" alt="tick" src="https://openui.fly.dev/openui/24x24.svg?text=✔️" />
        <span className="text-xs">Tick</span>
      </button>
      <button className="flex flex-col items-center p-2 hover:bg-muted rounded" onClick={handleImageAdd} style={{ backgroundColor: selectedElementType === "image" ? "#a71d2a" : "#dc3545", color: "#fff", border: "none", borderRadius: "4px", padding: "10px", cursor: "pointer" }}>
        <img aria-hidden="true" alt="image" src="https://openui.fly.dev/openui/24x24.svg?text=🖼️" />
        <span className="text-xs">Image</span>
      </button>
      <button className="flex flex-col items-center p-2 hover:bg-muted rounded" onClick={handleDrawingStart} style={{ backgroundColor: selectedElementType === "drawing" ? "#a71d2a" : "#dc3545", color: "#fff", border: "none", borderRadius: "4px", padding: "10px", cursor: "pointer" }}>
        <img aria-hidden="true" alt="draw" src="https://openui.fly.dev/openui/24x24.svg?text=🖌️" />
        <span className="text-xs">Draw</span>
      </button>
      <button className="flex flex-col items-center p-2 hover:bg-muted rounded" onClick={handleHighlightStart} style={{ backgroundColor: selectedElementType === "highlighting" ? "#cc8400" : "#ffc107", color: "#fff", border: "none", borderRadius: "4px", padding: "10px", cursor: "pointer" }}>
        <img aria-hidden="true" alt="highlight" src="https://openui.fly.dev/openui/24x24.svg?text=🖍️" />
        <span className="text-xs">Highlight</span>
      </button>
      <button className="flex flex-col items-center p-2 hover:bg-muted rounded" onClick={handleEraserStart} style={{ backgroundColor: selectedElementType === "erasing" ? "#6c757d" : "#868e96", color: "#fff", border: "none", borderRadius: "4px", padding: "10px", cursor: "pointer" }}>
        <img aria-hidden="true" alt="eraser" src="https://openui.fly.dev/openui/24x24.svg?text=🗑️" />
        <span className="text-xs">Erase</span>
      </button>
      <button className="flex flex-col items-center p-2 hover:bg-muted rounded" onClick={handleSave} style={{ backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", padding: "10px", cursor: "pointer" }}>
        <img aria-hidden="true" alt="save" src="https://openui.fly.dev/openui/24x24.svg?text=💾" />
        <span className="text-xs">Save the modified PDF</span>
      </button>
      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} ref={imageInputRef} />
    </div>
  );
};

const PdfViewer = ({
  pdfPages,
  pageNumber,
  pdfDoc,
  highlights,
  drawings,
  isDrawing,
  isHighlighting,
  isErasing,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  pdfCanvasRef,
}) => {
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
        viewport: viewport,
      };
      page.render(renderContext).promise.then(() => {
        highlights.forEach((highlight) => {
          context.fillStyle = "rgba(255, 255, 0, 0.5)";
          context.fillRect(highlight.x, highlight.y, highlight.width, highlight.height);
        });
        drawings.forEach((drawing) => {
          if (drawing.type === 'begin') {
            context.beginPath();
            context.moveTo(drawing.x, drawing.y);
          } else if (drawing.type === 'draw') {
            context.lineTo(drawing.x, drawing.y);
            context.stroke();
          }
        });
      });
    }
  }, [pdfPages, pageNumber, pdfDoc, highlights, drawings]);

  return (
    <div style={{ position: "relative", margin: "0 auto", maxWidth: "100%", overflow: "hidden" }}>
      <canvas
        id="pdf-render"
        ref={pdfCanvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default PdfComponents;
