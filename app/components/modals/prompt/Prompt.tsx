"use client";

import { useEffect } from "react";
import "./prompt.css";
import { Button } from "../../button/Button";

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
        <p className="text-lg">{message}</p>
        <div>
          <Button
            variant="outline"
            size="md"
            onClick={onCancel}
            className="cancel">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onConfirm}
            className="confirm">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Prompt;
