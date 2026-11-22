"use client";

import { useRef, useState } from "react";

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Tilt3DCard({
  children,
  className = "",
}: Tilt3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    "perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
  );
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Skip 3D tilt on touchscreens or when reduced motion is enabled
    if (
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      return;
    }

    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setTransform(
      `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
        2,
      )}deg) scale3d(1.015, 1.015, 1.015)`,
    );
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.14,
    });
  };

  const handleMouseLeave = () => {
    setTransform(
      "perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    );
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transformStyle: "preserve-3d",
        transition:
          glare.opacity === 0
            ? "transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)"
            : "transform 0.08s ease-out",
      }}
      className={`relative h-full will-change-transform ${className}`}
    >
      {/* Dynamic Specular Light Glare */}
      <div
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.85), transparent 60%)`,
          opacity: glare.opacity,
          transition: "opacity 0.3s ease",
        }}
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl"
      />
      {children}
    </div>
  );
}
