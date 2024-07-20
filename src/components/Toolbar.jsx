// components/Toolbar.js
import React from 'react';

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

export default Toolbar;
