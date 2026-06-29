"use client";
import { useRef, useState } from "react";

export default function ARPage() {
  const videoRef = useRef(null);
  const [camaraActiva, setCamaraActiva] = useState(false);
  const [error, setError] = useState("");

  const activarCamara = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setCamaraActiva(true);
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "100%",
          height: "100vh",
          objectFit: "cover",
          display: camaraActiva ? "block" : "none",
        }}
      />

      {!camaraActiva && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          {error && (
            <p style={{ color: "#f87171", fontSize: 14, textAlign: "center", maxWidth: 300 }}>
              Error: {error}
            </p>
          )}
          <button
            onClick={activarCamara}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "16px 32px",
              fontSize: 20,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ACTIVAR CÁMARA
          </button>
        </div>
      )}
    </div>
  );
}
