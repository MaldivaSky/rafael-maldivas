"use client";

import { useState, useRef, useEffect } from "react";
import { MoveHorizontal } from "lucide-react";

interface BeforeAfterProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
}

export default function BeforeAfter({
  beforeImage,
  afterImage,
  beforeAlt = "Antes",
  afterAlt = "Depois",
  className = "",
}: BeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const onPointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = "none";
    } else {
      document.body.style.userSelect = "auto";
    }
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={`before-after-container ${className}`}
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        borderRadius: "24px",
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
        border: "1px solid var(--line-strong)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Imagem de Fundo (Antes) */}
      <img
        src={beforeImage}
        alt={beforeAlt}
        style={{
          width: "100%",
          display: "block",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />
      
      {/* Label Antes */}
      <div style={{
        position: "absolute",
        top: "24px",
        left: "24px",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        color: "white",
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: 600,
        letterSpacing: "0.05em",
        zIndex: 10
      }}>
        {beforeAlt}
      </div>

      {/* Imagem Sobreposta (Depois) com Clip-Path */}
      <img
        src={afterImage}
        alt={afterAlt}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
          clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
        }}
      />

      {/* Label Depois */}
      <div style={{
        position: "absolute",
        top: "24px",
        right: "24px",
        background: "rgba(217, 31, 39, 0.9)",
        color: "white",
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: 600,
        letterSpacing: "0.05em",
        zIndex: 10,
        boxShadow: "0 4px 12px rgba(217, 31, 39, 0.3)"
      }}>
        {afterAlt}
      </div>

      {/* Linha Divisória e Botão Central */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${sliderPosition}%`,
          width: "4px",
          background: "white",
          transform: "translateX(-50%)",
          pointerEvents: "none",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          zIndex: 20
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "48px",
            height: "48px",
            background: "white",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "black",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}
        >
          <MoveHorizontal size={24} />
        </div>
      </div>
    </div>
  );
}
