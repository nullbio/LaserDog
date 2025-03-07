import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import "./FloatingToolbar.css";

const FloatingToolbar = () => {
  const { undo, redo, setIsSettingsPanelOpen, currentProject, currentFile } =
    useAppContext();

  const [position, setPosition] = useState({
    x: "50%",
    y: "calc(100% - 80px)",
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const toolbarRef = useRef(null);

  // Handle starting the drag
  const handleMouseDown = (e) => {
    if (e.target.closest("button") || e.target.closest("input")) return;

    setIsDragging(true);

    const rect = toolbarRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const x = e.clientX - dragOffset.x;
      const y = e.clientY - dragOffset.y;

      setPosition({
        x: `${x}px`,
        y: `${y}px`,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Open settings panel
  const openSettings = () => {
    setIsSettingsPanelOpen(true);
  };

  return (
    <div
      className={`floating-toolbar ${isDragging ? "dragging" : ""}`}
      style={{
        left: position.x,
        top: position.y,
        transform: position.x === "50%" ? "translateX(-50%)" : "none",
      }}
      ref={toolbarRef}
      onMouseDown={handleMouseDown}
    >
      <button onClick={undo} title="Undo">
        ↩
      </button>

      <button onClick={redo} title="Redo">
        ↪
      </button>

      <button
        className="settings-button"
        onClick={openSettings}
        title="Settings"
      >
        ⚙
      </button>
    </div>
  );
};

export default FloatingToolbar;
