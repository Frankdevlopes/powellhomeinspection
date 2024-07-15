import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { v4 as uuidv4 } from "uuid";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { addInspectionForm } from "../auth/firebase"; // Adjusted import path
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Firebase storage

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

  const storage = getStorage(); // Initialize storage here

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

  const handleDropElement = (e) => {
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

  const renderElements = () => {
    return elements.map((element, index) => {
      if (element.type === "text") {
        return (
          <Draggable key={element.id} defaultPosition={{ x: element.x, y: element.y }} onDrag={(e, data) => handleElementDrag(index, data.x, data.y)}>
            <div
              style={{
                padding: "10px",
                border: "1px solid rgba(0, 0, 0, 0.2)",
                borderRadius: "4px",
                background: "rgba(255, 255, 255, 0.7)",
                cursor: "move",
                maxWidth: "100%",
                fontFamily: element.font,
                color: element.color,
                fontWeight: element.fontWeight,
                fontSize: `${element.fontSize}px`,
              }}
              onDoubleClick={() => editMode && handleTextClick(index)}
            >
              {element.content}
            </div>
          </Draggable>
        );
      } else if (element.type === "shape") {
        const shapeStyles = {
          width: "50px",
          height: "50px",
          borderRadius: element.shape === "circle" ? "50%" : "0",
          backgroundColor: element.shape === "triangle" ? "transparent" : "gray",
          border: element.shape === "triangle" ? "25px solid transparent" : "none",
          borderBottom: element.shape === "triangle" ? "50px solid gray" : "none",
          cursor: "move",
        };
        return (
          <Draggable key={element.id} defaultPosition={{ x: element.x, y: element.y }} onDrag={(e, data) => handleElementDrag(index, data.x, data.y)}>
            <div style={shapeStyles}></div>
          </Draggable>
        );
      } else if (element.type === "button") {
        return (
          <Draggable key={element.id} defaultPosition={{ x: element.x, y: element.y }} onDrag={(e, data) => handleElementDrag(index, data.x, data.y)}>
            <button
              style={{
                padding: "10px 20px",
                background: "blue",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "move",
                maxWidth: "100%",
              }}
              onDoubleClick={() => editMode && handleTextClick(index)}
            >
              {element.text}
            </button>
          </Draggable>
        );
      } else if (element.type === "image") {
        return (
          <Draggable key={element.id} defaultPosition={{ x: element.x, y: element.y }} onDrag={(e, data) => handleElementDrag(index, data.x, data.y)}>
            <ResizableBox
              width={element.width}
              height={element.height}
              onResizeStop={(e, data) => handleResize(index, data.size)}
              lockAspectRatio
              minConstraints={[50, 50]}
              maxConstraints={[500, 500]}
            >
              <img
                src={element.src}
                alt="Uploaded"
                style={{
                  width: "100%",
                  height: "100%",
                  cursor: "move",
                }}
              />
            </ResizableBox>
          </Draggable>
        );
      } else if (element.type === "date") {
        return (
          <Draggable key={element.id} defaultPosition={{ x: element.x, y: element.y }} onDrag={(e, data) => handleElementDrag(index, data.x, data.y)}>
            <div
              style={{
                padding: "10px",
                border: "1px solid rgba(0, 0, 0, 0.2)",
                borderRadius: "4px",
                background: "rgba(255, 255, 255, 0.7)",
                cursor: "move",
                maxWidth: "100%",
              }}
            >
              {element.content}
            </div>
          </Draggable>
        );
      } else if (element.type === "signature") {
        return (
          <Draggable key={element.id} defaultPosition={{ x: element.x, y: element.y }} onDrag={(e, data) => handleElementDrag(index, data.x, data.y)}>
            <div
              style={{
                padding: "10px",
                border: "1px solid rgba(0, 0, 0, 0.2)",
                borderRadius: "4px",
                background: "rgba(255, 255, 255, 0.7)",
                cursor: "move",
                maxWidth: "100%",
                fontFamily: "'Great Vibes', cursive",
                fontSize: "32px",
                fontWeight: "bold",
              }}
            >
              {element.content}
            </div>
          </Draggable>
        );
      } else if (element.type === "x") {
        return (
          <Draggable key={element.id} defaultPosition={{ x: element.x, y: element.y }} onDrag={(e, data) => handleElementDrag(index, data.x, data.y)}>
            <div
              style={{
                padding: "10px",
                fontWeight: "bold",
                color: element.color,
                fontSize: "24px",
                cursor: "move",
              }}
            >
              {element.content}
            </div>
          </Draggable>
        );
      } else if (element.type === "tick") {
        return (
          <Draggable key={element.id} defaultPosition={{ x: element.x, y: element.y }} onDrag={(e, data) => handleElementDrag(index, data.x, data.y)}>
            <div
              style={{
                padding: "10px",
                fontWeight: "bold",
                color: element.color,
                fontSize: `${element.fontSize}px`,
                cursor: "move",
              }}
            >
              {element.content}
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
        viewport: viewport,
      };
      page.render(renderContext).promise.then(() => {
        highlights.forEach((highlight) => {
          context.fillStyle = "rgba(255, 255, 0, 0.5)";
          context.fillRect(highlight.x, highlight.y, highlight.width, highlight.height);
        });
      });
    }
  }, [pdfPages, pageNumber, pdfDoc, highlights]);

  const handleDrawingStart = () => {
    setIsDrawing(!isDrawing);
    setSelectedElementType(isDrawing ? null : "drawing");
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

  const handleHighlightStart = () => {
    setIsHighlighting(!isHighlighting);
    setSelectedElementType(isHighlighting ? null : "highlighting");
  };

  const handleEraserStart = () => {
    setIsErasing(!isErasing);
    setSelectedElementType(isErasing ? null : "erasing");
  };

  const handleSave = async () => {
    if (!pdfDoc) return;

    const pdfDocLib = await PDFDocument.load(pdf);
    const pages = pdfDocLib.getPages();
    const page = pages[pageNumber - 1];
    const { width, height } = page.getSize();

    // Load the custom font
    const fontUrl = "/path/to/NotoSans-Regular.ttf"; // Adjust the path to your font file
    const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
    const customFont = await pdfDocLib.embedFont(fontBytes);

    for (const element of elements) {
      if (element.type === "text") {
        const rgbColor = rgb(
          parseInt(element.color.slice(1, 3), 16) / 255,
          parseInt(element.color.slice(3, 5), 16) / 255,
          parseInt(element.color.slice(5, 7), 16) / 255
        );
        page.drawText(element.content, {
          x: element.x,
          y: height - element.y - element.fontSize,
          size: element.fontSize,
          font: customFont,
          color: rgbColor,
          fontWeight: element.fontWeight,
        });
      } else if (element.type === "button") {
        page.drawText(element.text, {
          x: element.x,
          y: height - element.y - 12,
          size: 12,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      } else if (element.type === "image") {
        const imageBytes = await fetch(element.src).then(res => res.arrayBuffer());
        const pdfImage = await pdfDocLib.embedPng(imageBytes);
        page.drawImage(pdfImage, {
          x: element.x,
          y: height - element.y - element.height,
          width: element.width,
          height: element.height,
        });
      } else if (element.type === "date") {
        page.drawText(element.content, {
          x: element.x,
          y: height - element.y - 12,
          size: 12,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      } else if (element.type === "signature") {
        page.drawText(element.content, {
          x: element.x,
          y: height - element.y - 32,
          size: 32,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      } else if (element.type === "x") {
        page.drawText(element.content, {
          x: element.x,
          y: height - element.y - 24,
          size: 24,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      } else if (element.type === "tick") {
        page.drawText(element.content, {
          x: element.x,
          y: height - element.y - 24,
          size: 24,
          font: customFont,
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
    const storageRef = ref(storage, `modified_pdfs/${uuidv4()}.pdf`);
    await uploadBytes(storageRef, file);

    // Optionally, save the file metadata to Firestore
    const fileUrl = await getDownloadURL(storageRef);
    await addInspectionForm({ title: 'Modified PDF', fileUrl });

    // Show the popup message
    setSavePopup(true);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", color: "#333", maxWidth: "100%", overflowX: "hidden" }}>
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
        <button className="flex flex-col items-center p-2 hover:bg-muted rounded" onClick={handleSave} style={{ backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", padding: "10px", cursor: "pointer" }}>
          <img aria-hidden="true" alt="save" src="https://openui.fly.dev/openui/24x24.svg?text=💾" />
          <span className="text-xs">Save the modified PDF</span>
        </button>
        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} ref={imageInputRef} />
      </div>
      <div {...getRootProps()} style={{ border: "2px dashed #ccc", borderRadius: "5px", padding: "30px", textAlign: "center", margin: "20px 0", backgroundColor: "#e9ecef", color: "#6c757d" }}>
        <input {...getInputProps()} />
        <p style={{ margin: 0 }}>Drag & drop a PDF here, or click to select one</p>
      </div>
      {pdf && (
        <div style={{ position: "relative", margin: "0 auto", maxWidth: "100%", overflow: "hidden" }}>
          <canvas id="pdf-render" ref={pdfCanvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} />
          <div className="overlay-elements" style={{ position: "absolute", top: 0, left: 0, maxWidth: "100%" }} onClick={handleDropElement}>
            {renderElements()}
          </div>
        </div>
      )}
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
        <div style={{ position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", padding: "10px 20px", background: "#28a745", color: "#fff", borderRadius: "4px", zIndex: 1000 }}>
          <p style={{ margin: 0 }}>PDF saved successfully!</p>
        </div>
      )}
    </div>
  );
};

export default PdfComponents;

