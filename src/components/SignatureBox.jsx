// components/SignatureBox.js
import React from 'react';

const SignatureBox = ({
  signatureContent,
  setSignatureContent,
  handleSignatureSubmit,
  setSignatureBoxVisible,
}) => {
  return (
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
  );
};

export default SignatureBox;
