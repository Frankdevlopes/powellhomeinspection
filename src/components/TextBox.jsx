// components/TextBox.js
import React from 'react';

const TextBox = ({
  textBoxContent,
  setTextBoxContent,
  textBoxFont,
  setTextBoxFont,
  textBoxFontWeight,
  setTextBoxFontWeight,
  textBoxFontSize,
  setTextBoxFontSize,
  textBoxColor,
  setTextBoxColor,
  handleTextSubmit,
  setTextBoxVisible,
}) => {
  return (
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
  );
};

export default TextBox;
