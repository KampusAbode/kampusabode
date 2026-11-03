"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import IconButton from "../button/IconButton";

type InlineBannerProps = {
  variant?: "success" | "error" | "warning" | "info";
  children: React.ReactNode;
  dismissible?: boolean;
};

const bannerIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: TriangleAlert,
  info: Info,
};

export default function InlineBanner({
  variant = "info",
  children,
  dismissible = false,
}: InlineBannerProps) {
  const [visible, setVisible] = useState(true);
  const Icon = bannerIcons[variant];

  if (!visible) return null;

  return (
    <div
      className={`ka-inline-banner ka-inline-banner--${variant}`}
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
    >
      <Icon className="ka-inline-banner__icon" aria-hidden="true" size={20} />
      <div>{children}</div>
      {dismissible && (
        <IconButton
          type="button"
          className="ka-inline-banner__close"
          aria-label="Dismiss message"
          onClick={() => setVisible(false)}
        >
          <X aria-hidden="true" size={18} />
        </IconButton>
      )}
    </div>
  );
}
