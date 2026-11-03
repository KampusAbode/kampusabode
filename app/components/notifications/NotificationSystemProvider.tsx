"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  LoaderCircle,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  ReactNode,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import IconButton from "../button/IconButton";
import { Button } from "../button/Button";
import {
  getNotificationSnapshot,
  notify,
  settleDialog,
  subscribeNotifications,
  ToastNotification,
} from "../../lib/notifications/notify";
import DialogSurface from "./DialogSurface";

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: TriangleAlert,
  info: Info,
  loading: LoaderCircle,
};

function ToastItem({
  toast,
  dismiss,
}: {
  toast: ToastNotification;
  dismiss: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAt = useRef(0);
  const remaining = useRef(toast.duration);
  const hovered = useRef(false);
  const focused = useRef(false);
  const closing = useRef(false);
  const Icon = icons[toast.variant];

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    dismiss();
  };

  const pauseTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
      remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt.current));
    }
  };

  const resumeTimer = () => {
    if (
      toast.duration <= 0 ||
      remaining.current <= 0 ||
      closing.current ||
      hovered.current ||
      focused.current
    ) {
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    startedAt.current = Date.now();
    timer.current = setTimeout(() => {
      timer.current = null;
      close();
    }, remaining.current);
  };

  useEffect(() => {
    remaining.current = toast.duration;
    if (toast.duration > 0) resumeTimer();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [toast.id, toast.duration]);

  const handleAction = () => {
    toast.action?.onClick();
    close();
  };

  return (
    <motion.li
      layout
      className={`ka-notification ka-notification--${toast.variant}`}
      role={toast.variant === "error" ? "alert" : "status"}
      aria-live={toast.variant === "error" ? "assertive" : "polite"}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 8, scale: reducedMotion ? 1 : 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : -8, scale: reducedMotion ? 1 : 0.98 }}
      transition={{
        duration: reducedMotion ? 0.01 : closing ? 0.15 : 0.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => {
        hovered.current = true;
        pauseTimer();
      }}
      onMouseLeave={() => {
        hovered.current = false;
        resumeTimer();
      }}
      onFocus={() => {
        focused.current = true;
        pauseTimer();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          focused.current = false;
          resumeTimer();
        }
      }}
    >
      <Icon className="ka-notification__icon" aria-hidden="true" size={20} />
      <p className="ka-notification__message">{toast.message}</p>
      {toast.action && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="ka-notification__action"
          onClick={handleAction}
        >
          {toast.action.label}
        </Button>
      )}
      <IconButton
        type="button"
        className="ka-notification__close"
        aria-label="Dismiss notification"
        onClick={close}
      >
        <X aria-hidden="true" size={18} />
      </IconButton>
    </motion.li>
  );
}

function ConfirmDialog({
  dialog,
}: {
  dialog: NonNullable<ReturnType<typeof getNotificationSnapshot>["dialog"]>;
}) {
  return (
    <DialogSurface
      id={dialog.id}
      title={dialog.title}
      description={dialog.description}
      confirmLabel={dialog.confirmLabel}
      cancelLabel={dialog.cancelLabel}
      destructive={dialog.destructive}
      closeOnBackdrop={dialog.closeOnBackdrop}
      closeOnEscape={dialog.closeOnEscape}
      returnFocus={dialog.returnFocus}
      onCancel={() => settleDialog(dialog.id, false)}
      onConfirm={() => settleDialog(dialog.id, true)}
    />
  );
}

export default function NotificationSystemProvider({
  children,
}: {
  children: ReactNode;
}) {
  const state = useSyncExternalStore(
    subscribeNotifications,
    getNotificationSnapshot,
    getNotificationSnapshot
  );

  return (
    <>
      {children}
      <ol className="ka-notification-stack" aria-label="Notifications">
        <AnimatePresence initial={false}>
          {state.toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              dismiss={() => notify.dismiss(toast.id)}
            />
          ))}
        </AnimatePresence>
      </ol>
      <AnimatePresence>
        {state.dialog && <ConfirmDialog key={state.dialog.id} dialog={state.dialog} />}
      </AnimatePresence>
    </>
  );
}
