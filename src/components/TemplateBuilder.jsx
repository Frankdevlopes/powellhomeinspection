import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import Draggable from "react-draggable";
import { v4 as uuidv4 } from "uuid";
import TextEditor from "./textEditor";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../auth/firebase";
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
  const [pdfText, setPdfText] = useState("");
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
      extractTextFromPdf();
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
    const textPromises = [];

    for (let i = 1; i <= numPages; i++) {
      const textPromise = pdfDoc.getPage(i).then(async (page) => {
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + " ";
      });
      textPromises.push(textPromise);
    }

    await Promise.all(textPromises);
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
          <Draggable
            key={element.id}
            defaultPosition={{ x: element.x, y: element.y }}
            onStop={(e, data) => handleElementDrag(index, data.x, data.y)}
          >
            <div
              className="text-box"
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                backgroundColor: "white",
                borderRadius: "5px",
              }}
            >
              <TextEditor
                content={element.content}
                onContentChange={(content) => {
                  const updatedElements = [...elements];
                  updatedElements[index].content = content;
                  setElements(updatedElements);
                }}
              />
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
      page.render(renderContext);
    }
  }, [pdfPages, pageNumber, pdfDoc]);

  const saveReport = () => {
    if (!pdfText.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please add some content in the text editor before saving the report!",
      });
      return;
    }

    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const element = document.querySelector(".pdf-text");
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 0, 0);
        const pdfBlob = pdf.output("blob");

        const storageRef = ref(storage, `reports/${uuidv4()}.pdf`);
        await uploadBytes(storageRef, pdfBlob);

        Swal.fire("Saved!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const clearForm = () => {
    setPdf(null);
    setNumPages(null);
    setPageNumber(1);
    setElements([]);
    setSelectedElementType(null);
    setPdfDoc(null);
    setPdfPages([]);
    setRendered(false);
    setPdfError(null);
    setPdfText("");
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const extractText = () => {
    if (!pdfDoc) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please upload a PDF document first!",
      });
      return;
    }

    extractTextFromPdf();
    Swal.fire("Text Extracted!", "The text from the PDF has been extracted to the text editor.", "success");
  };

  return (
    <div
      className="pdf-components"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{ fontFamily: "'Arial', sans-serif", margin: "20px" }}
    >
      {/* Instructions */}
      <div
        className="instructions"
        style={{
          backgroundColor: "papayawhip",
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "5px",
        }}
      >
        <p>
          Please upload a PDF document to edit. You can drag and drop elements onto the PDF canvas and modify text in the text editor below.
        </p>
      </div>

      {/* Tools Card */}
      <div
        className="tools-card"
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={saveReport}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Save Report
        </button>
        <button
          onClick={refreshPage}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
        <button
          onClick={clearForm}
          style={{
            padding: "10px 20px",
            backgroundColor: "#FFD700",
            color: "#FF6347",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Clear Form
        </button>
        <button
          onClick={extractText}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Extract Text
        </button>
      </div>

      {/* PDF Canvas */}
      <div
        className="pdf-canvas"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          className="upload-area"
          {...getRootProps()}
          style={{
            border: "2px dashed #ddd",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
            borderRadius: "10px",
            marginBottom: "20px",
            width: "80%",
          }}
        >
          <input {...getInputProps()} />
          <p>Drag & drop a PDF here, or click to select one</p>
        </div>
        {pdf && (
          <div className="pdf-container" style={{ position: "relative" }}>
            <canvas
              id="pdf-render"
              ref={pdfCanvasRef}
              style={{ border: "1px solid #ddd", borderRadius: "10px" }}
            ></canvas>
            <div className="overlay-elements" style={{ position: "absolute", top: 0, left: 0 }}>
              {renderElements()}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {numPages && (
        <div
          className="pagination"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <button
            disabled={pageNumber <= 1}
            onClick={() => handlePageChange(pageNumber - 1)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Previous
          </button>
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <button
            disabled={pageNumber >= numPages}
            onClick={() => handlePageChange(pageNumber + 1)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* PDF Text */}
      {pdfError && (
        <div
          className="pdf-error"
          style={{
            color: "red",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          {pdfError}
        </div>
      )}
      <div
        className="pdf-text"
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          backgroundColor: "white",
        }}
      >
        <h3>Extracted Text</h3>
        <TextEditor content={pdfText} onContentChange={setPdfText} />
      </div>
    </div>
  );
};

export default PdfComponents;
