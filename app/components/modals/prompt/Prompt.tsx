"use client";

import { AnimatePresence } from "framer-motion";
import { useId } from "react";
import DialogSurface from "../../notifications/DialogSurface";

interface PromptProps {
  message: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  destructive?: boolean;
}

const Prompt = ({
  message,
  isOpen,
  onConfirm,
  onCancel,
  title = "Please confirm",
  destructive = false,
}: PromptProps) => {
  const promptId = useId();

  return (
    <AnimatePresence>
      {isOpen && (
        <DialogSurface
          key="prompt"
          id={promptId}
          title={title}
          description={message}
          confirmLabel="Confirm"
          destructive={destructive}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      )}
    </AnimatePresence>
  );
};

export default Prompt;
