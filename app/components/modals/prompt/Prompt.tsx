"use client";

import { useEffect } from "react";
import "./prompt.css";

interface PromptProps {
  message: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const Prompt = ({ message, isOpen, onConfirm, onCancel }: PromptProps) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [onCancel]);

  if (!isOpen) return null;

  return (
    <div className="prompt" onClick={onCancel}>
      <div className="wrapper">
        <p className="text-lg mb-4">{message}</p>
        <div>
          <button onClick={onCancel} className="cancel">
            Cancel
          </button>
          <button onClick={onConfirm} className="confirm btn">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Prompt;
