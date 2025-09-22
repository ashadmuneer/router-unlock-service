import React from "react";

const NotFound = () => {
  return (
    <div style={{ display: "flex",
        flexDirection: "column",
        justifyContent: "center", // Horizontal centering
        alignItems: "center",     // Vertical centering
        height: "55vh"}}    // Full viewport height, fontSize: "1.5rem",
        >
      <h1>404</h1>
      <p>Page not found</p>
    </div>
  );
};

export default NotFound;
