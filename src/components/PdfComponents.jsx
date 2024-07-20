import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as fontkit from "fontkit";
import { storage, db } from "../auth/firebase";
import TextBox from "./TextBox";
import SignatureBox from "./SignatureBox";
import Toolbar from "./Toolbar";
import PdfViewer from "./PdfViewer";

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
      setElements([...elements, { type: "text", id: uuidv4(), content: textBoxContent, x: 50, y: 50, font: textBoxFont, color: textBoxColor, fontWeight: textBoxFontWeight, fontSize: textBoxFontSize }]);
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
    setElements([...elements, { type: "shape", id: uuidv4(), shape, x: 50, y: 50 }]);
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
      setElements([...elements, { type: "image", id: uuidv4(), src: reader.result, x: 50, y: 50, width: 100, height: 100 }]);
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
    setElements([...elements, { type: "date", id: uuidv4(), content: currentDate, x: 50, y: 50 }]);
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
      setElements([...elements, { type: "signature", id: uuidv4(), content: signatureContent, x: 50, y: 50 }]);
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
    setElements([...elements, { type: "x", id: uuidv4(), content: "x", x: 50, y: 50, color: "black" }]);
    setSelectedElementType(null);
  };

  const handleTickAdd = () => {
    if (!pdf) {
      setErrorPopup(true);
      return;
    }
    setElements([...elements, { type: "tick", id: uuidv4(), content: "✔", x: 50, y: 50, color: "black", fontSize: 24 }]);
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
      setElements([...elements, { type: selectedElementType, id: uuidv4(), x: offsetX, y: offsetY }]);
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
      const canvas = pdfCanvasRef.current;
      const ctx = canvas.getContext("2d");
      const { offsetX, offsetY } = e.nativeEvent;
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
      setDrawings([...drawings, { x: offsetX, y: offsetY, type: "begin" }]);
    } else if (isErasing) {
      const { offsetX, offsetY } = e.nativeEvent;
      startX.current = offsetX;
      startY.current = offsetY;
    }
  };

  const handleMouseMove = (e) => {
    if (isHighlighting) return;
    if (!isDrawing) return;
    const canvas = pdfCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const { offsetX, offsetY } = e.nativeEvent;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    setDrawings([...drawings, { x: offsetX, y: offsetY, type: "draw" }]);
  };

  const handleMouseUp = (e) => {
    if (isHighlighting) {
      const { offsetX, offsetY } = e.nativeEvent;
      const width = offsetX - startX.current;
      const height = offsetY - startY.current;
      setHighlights([...highlights, { x: startX.current, y: startY.current, width, height }]);
    } else if (isDrawing) {
      const canvas = pdfCanvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.closePath();
    } else if (isErasing) {
      const { offsetX, offsetY } = e.nativeEvent;
      const width = offsetX - startX.current;
      const height = offsetY - startY.current;
      eraseHighlightArea(startX.current, startY.current, width, height);
    }
  };

  const eraseHighlightArea = (x, y, width, height) => {
    const canvas = pdfCanvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(x, y, width, height);
    setHighlights(highlights.filter(highlight => !(
      highlight.x >= x &&
      highlight.y >= y &&
      highlight.x + highlight.width <= x + width &&
      highlight.y + highlight.height <= y + height
    )));
  };

  const handleSave = async () => {
    if (!pdfDoc) return;

    const pdfDocLib = await PDFDocument.load(pdf);
    pdfDocLib.registerFontkit(fontkit);
    const pages = pdfDocLib.getPages();
    const page = pages[pageNumber - 1];
    const { width, height } = page.getSize();

    const font = await pdfDocLib.embedFont(StandardFonts.Helvetica);

    for (const element of elements) {
      const yPos = height - element.y; // Correct y position for PDF rendering

      if (element.type === "text") {
        const rgbColor = rgb(
          parseInt(element.color.slice(1, 3), 16) / 255,
          parseInt(element.color.slice(3, 5), 16) / 255,
          parseInt(element.color.slice(5, 7), 16) / 255
        );
        page.drawText(element.content, {
          x: element.x,
          y: yPos - element.fontSize,
          size: element.fontSize,
          font,
          color: rgbColor,
          fontWeight: element.fontWeight,
        });
      } else if (element.type === "shape") {
        // Handle shapes
        if (element.shape === "circle") {
          page.drawEllipse({
            x: element.x + element.width / 2,
            y: yPos - element.height / 2,
            xScale: element.width / 2,
            yScale: element.height / 2,
            borderColor: rgb(0.5, 0.5, 0.5),
            borderWidth: 2,
          });
        }
        // Add more shapes as needed
      } else if (element.type === "image") {
        const imageBytes = await fetch(element.src).then(res => res.arrayBuffer());
        const pdfImage = await pdfDocLib.embedPng(imageBytes);
        page.drawImage(pdfImage, {
          x: element.x,
          y: yPos - element.height,
          width: element.width,
          height: element.height,
        });
      } else if (element.type === "date") {
        page.drawText(element.content, {
          x: element.x,
          y: yPos - 12,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
      } else if (element.type === "signature") {
        const fontBytes = await fetch('https://url-to-great-vibes-font-file.ttf').then(res => res.arrayBuffer());
        const customFont = await pdfDocLib.embedFont(fontBytes);
        page.drawText(element.content, {
          x: element.x,
          y: yPos - 32,
          size: 32,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      } else if (element.type === "x") {
        page.drawText(element.content, {
          x: element.x,
          y: yPos - 24,
          size: 24,
          font,
          color: rgb(0, 0, 0),
        });
      } else if (element.type === "tick") {
        page.drawText(element.content, {
          x: element.x,
          y: yPos - 24,
          size: 24,
          font,
          color: rgb(0, 1, 0),
        });
      }
    }

    highlights.forEach((highlight) => {
      page.drawRectangle({
        x: highlight.x,
        y: height - highlight.y - highlight.height,
        width: highlight.width,
        height: highlight.height,
        color: rgb(1, 1, 0),
        opacity: 0.5,
      });
    });

    const pdfBytes = await pdfDocLib.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const file = new File([blob], 'modified.pdf', { type: 'application/pdf' });

    // Save the modified PDF to Firebase storage
    const storageRef = storage.ref();
    const fileRef = storageRef.child(`modified_pdfs/${uuidv4()}.pdf`);
    await fileRef.put(blob);

    // Optionally, save the file metadata to Firestore
    await db.collection('inspectionForms').add({ title: 'Modified PDF', fileUrl: await fileRef.getDownloadURL() });

    // Show the popup message
    setSavePopup(true);
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
      {pdf && (
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
      )}
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
        </div>
      )}
    </div>
  );
};

export default PdfComponents;
