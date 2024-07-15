import React, { useEffect } from "react";

const TemplateBuilder = () => {
  useEffect(() => {
    const css = `
      .pdf-components {
        font-family: 'Arial', sans-serif;
        margin: 20px;
        background-color: lightblue; /* Change the background color */
        height: 100vh; /* Ensure it covers the full viewport height */
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .message {
        background-color: papayawhip;
        padding: 10px;
        border-radius: 5px;
        text-align: center;
        font-weight: bold;
        font-size: 18px;
        animation: fadeInOut 2s infinite; /* Apply the animation */
      }

      /* Define the fadeInOut animation */
      @keyframes fadeInOut {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }
    `;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="pdf-components">
      <div className="message">No templates available create one in the pdf overlay section</div>
    </div>
  );
};

export default TemplateBuilder;
