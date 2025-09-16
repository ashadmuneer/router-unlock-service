import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-container" role="status" aria-live="polite">
      <div className="typing-wrap">
        <h1 className="typing">Genuine Unlocker</h1>
      </div>
    </div>
  );
};

export default Loader;
