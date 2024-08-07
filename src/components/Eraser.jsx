import React, { useRef, useEffect } from 'react';

const Eraser = ({ isActive, pdfCanvasRef, drawings, setDrawings }) => {
  const isErasing = useRef(false);

  const handleMouseDown = (e) => {
    if (!isActive) return;

    isErasing.current = true;
    const canvas = pdfCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const { offsetX, offsetY } = e.nativeEvent;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 10; // Adjust the width as needed
    setDrawings([...drawings, { x: offsetX, y: offsetY, type: "begin" }]);
  };

  const handleMouseMove = (e) => {
    if (!isActive || !isErasing.current) return;

    const canvas = pdfCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const { offsetX, offsetY } = e.nativeEvent;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    setDrawings([...drawings, { x: offsetX, y: offsetY, type: "draw" }]);
  };

  const handleMouseUp = () => {
    if (!isActive) return;

    isErasing.current = false;
  };

  useEffect(() => {
    const canvas = pdfCanvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isActive, drawings]);

  return null;
};

export default Eraser;
