"use client";

import {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./notification-system.css";

type DialogFrameProps = {
  id: string;
  labelledBy: string;
  describedBy?: string;
  panelClassName?: string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  returnFocus?: HTMLElement | null;
  onClose: () => void;
  children: ReactNode;
};

export default function DialogFrame({
  id,
  labelledBy,
  describedBy,
  panelClassName = "",
  closeOnBackdrop = true,
  closeOnEscape = true,
  returnFocus,
  onClose,
  children,
}: DialogFrameProps) {
  const reducedMotion = useReducedMotion();
  const isMobileViewport =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 639px)").matches;
  const panelRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  useEffect(() => {
    const activeElement =
      returnFocus ||
      (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = panelRef.current?.querySelector<HTMLElement>(
      'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    );
    (focusable || panelRef.current)?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      activeElement?.focus();
    };
  }, [id, returnFocus]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && closeOnEscape) {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    touchStartY.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (touchStartY.current === null) return;
    setDragOffset(
      reducedMotion ? 0 : Math.max(0, event.clientY - touchStartY.current)
    );
  };
  const handlePointerUp = () => {
    if (dragOffset > 80) onClose();
    touchStartY.current = null;
    setDragOffset(0);
  };

  return (
    <motion.div
      className="ka-dialog-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && closeOnBackdrop) onClose();
      }}
    >
      <motion.div
        ref={panelRef}
        className={`ka-dialog ${panelClassName}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        initial={{
          opacity: 0,
          scale: reducedMotion || isMobileViewport ? 1 : 0.96,
          y: reducedMotion ? 0 : isMobileViewport ? 96 : 6,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: dragOffset || 0,
          transition: {
            duration: reducedMotion ? 0.01 : isMobileViewport ? 0.25 : 0.2,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
        exit={{
          opacity: 0,
          scale: reducedMotion ? 1 : 0.98,
          y: reducedMotion ? 0 : 4,
        }}
      >
        <div
          className="ka-dialog__handle"
          aria-hidden="true"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <span />
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
