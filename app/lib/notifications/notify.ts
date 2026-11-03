export type NotificationVariant = "success" | "error" | "warning" | "info" | "loading";

export type NotificationAction = {
  label: string;
  onClick: () => void;
};

export type NotificationOptions = {
  id?: string;
  duration?: number;
  action?: NotificationAction;
};

export type ToastNotification = {
  id: string;
  variant: NotificationVariant;
  message: string;
  duration: number;
  action?: NotificationAction;
};

export type ConfirmOptions = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
};

export type DialogRequest = ConfirmOptions & {
  id: string;
  resolve: (confirmed: boolean) => void;
  returnFocus: HTMLElement | null;
};

type NotificationSnapshot = {
  toasts: ToastNotification[];
  dialog: DialogRequest | null;
};

const listeners = new Set<() => void>();
const queue: DialogRequest[] = [];
let snapshot: NotificationSnapshot = { toasts: [], dialog: null };
let nextId = 0;

const createId = () => `notification-${++nextId}`;

const publish = (next: NotificationSnapshot) => {
  snapshot = next;
  listeners.forEach((listener) => listener());
};

const normalizeMessage = (message: unknown) =>
  message instanceof Error ? message.message : String(message ?? "");

const addToast = (
  variant: NotificationVariant,
  message: unknown,
  options: NotificationOptions = {}
) => {
  const id = options.id || createId();
  const duration =
    options.duration ?? (variant === "error" ? 6000 : variant === "loading" ? 0 : 4000);
  const toast: ToastNotification = {
    id,
    variant,
    message: normalizeMessage(message),
    duration,
    action: options.action,
  };
  const withoutDuplicate = snapshot.toasts.filter((item) => item.id !== id);
  publish({ ...snapshot, toasts: [toast, ...withoutDuplicate].slice(0, 3) });
  return id;
};

export const notify = {
  success: (message: unknown, options?: NotificationOptions) =>
    addToast("success", message, options),
  error: (message: unknown, options?: NotificationOptions) =>
    addToast("error", message, options),
  warning: (message: unknown, options?: NotificationOptions) =>
    addToast("warning", message, options),
  info: (message: unknown, options?: NotificationOptions) =>
    addToast("info", message, options),
  loading: (message: unknown, options?: NotificationOptions) =>
    addToast("loading", message, options),
  dismiss: (id?: string) => {
    const toasts = id
      ? snapshot.toasts.filter((toast) => toast.id !== id)
      : [];
    publish({ ...snapshot, toasts });
  },
};

export const confirm = (options: ConfirmOptions) =>
  new Promise<boolean>((resolve) => {
    const request: DialogRequest = {
      ...options,
      id: createId(),
      resolve,
      returnFocus:
        typeof document === "undefined" ||
        !(document.activeElement instanceof HTMLElement)
          ? null
          : document.activeElement,
    };
    if (snapshot.dialog) {
      queue.push(request);
    } else {
      publish({ ...snapshot, dialog: request });
    }
  });

export const subscribeNotifications = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getNotificationSnapshot = () => snapshot;

export const settleDialog = (id: string, confirmed: boolean) => {
  const active = snapshot.dialog;
  if (!active || active.id !== id) return;
  active.resolve(confirmed);
  publish({ ...snapshot, dialog: queue.shift() || null });
};

export const notificationHelpers = {
  formSuccess: (message = "Changes saved successfully.") =>
    notify.success(message),
  networkError: (
    message = "Connection problem. Please try again.",
    onRetry?: () => void
  ) =>
    notify.error(
      message,
      onRetry ? { action: { label: "Retry", onClick: onRetry } } : undefined
    ),
  unsavedChanges: () =>
    confirm({
      title: "Discard unsaved changes?",
      description: "Your changes will be lost if you leave this page.",
      destructive: true,
      confirmLabel: "Discard changes",
    }),
  sessionExpired: () => notify.warning("Your session has expired. Please sign in again."),
  permissionDenied: () => notify.error("You don’t have permission to do that."),
};
