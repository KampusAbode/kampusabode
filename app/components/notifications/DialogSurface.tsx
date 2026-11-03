"use client";

import { Button } from "../button/Button";
import DialogFrame from "./DialogFrame";

export type DialogSurfaceProps = {
  id: string;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  returnFocus?: HTMLElement | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DialogSurface({
  id,
  title,
  description,
  confirmLabel = "Continue",
  cancelLabel = "Cancel",
  destructive = false,
  closeOnBackdrop = true,
  closeOnEscape = true,
  returnFocus,
  onConfirm,
  onCancel,
}: DialogSurfaceProps) {
  return (
    <DialogFrame
      id={id}
      labelledBy={`ka-dialog-title-${id}`}
      describedBy={`ka-dialog-description-${id}`}
      panelClassName={destructive ? "ka-dialog--destructive" : ""}
      closeOnBackdrop={closeOnBackdrop}
      closeOnEscape={closeOnEscape}
      returnFocus={returnFocus}
      onClose={onCancel}
    >
      <>
        <h2 id={`ka-dialog-title-${id}`} className="ka-dialog__title">
          {title}
        </h2>
        <p id={`ka-dialog-description-${id}`} className="ka-dialog__description">
          {description}
        </p>
        <div className="ka-dialog__actions">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={destructive ? "destructive" : "primary"}
            size="md"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </>
    </DialogFrame>
  );
}
