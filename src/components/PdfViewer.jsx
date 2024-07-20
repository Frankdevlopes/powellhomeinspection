// components/PdfViewer.js
import React, { useEffect, useRef } from 'react';

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

export default PdfViewer;
