import React from "react";

const LoaderText = ({ progress, stage }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        color: "white",
      }}
    >
      <p
        style={{
          letterSpacing: "0.4em",
          fontSize: 10,
          marginBottom: 12,
          opacity: stage === "fall" ? 0.7 : 1,
        }}
      >
        HEAVENSINN
      </p>

      <div
        style={{
          fontSize: "9rem",
          lineHeight: 1,
          fontWeight: 600,
          transform:
            stage === "fall"
              ? "translateY(120px) scale(0.9)"
              : "translateY(0)",
          transition: "transform 0.6s ease",
          opacity: stage === "fade" ? 0 : 1,
        }}
      >
        {progress}%
      </div>

      <p style={{ fontSize: 11, marginTop: 12, opacity: 0.4 }}>
        Creating your experience…
      </p>
    </div>
  );
};

export default LoaderText;
