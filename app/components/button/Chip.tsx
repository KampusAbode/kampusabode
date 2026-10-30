"use client";

import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import "./button.css";
import "./chip.css";

export type ChipProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-pressed" | "children" | "className"
> & {
  "aria-pressed"?: boolean;
  badge?: ReactNode;
  children?: ReactNode;
  className?: string;
  leadingIcon?: ReactNode;
};

const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  {
    "aria-pressed": ariaPressed,
    badge,
    children,
    className,
    leadingIcon,
    type = "button",
    ...props
  },
  ref
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      data-ka-control="true"
      aria-pressed={ariaPressed}
      className={cn(
        "ka-control",
        "ka-control--compact-hit",
        "ka-chip",
        className
      )}
    >
      {leadingIcon && (
        <span className="ka-chip__icon" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <span className="ka-chip__label">{children}</span>
      {badge != null && <span className="ka-chip__badge">{badge}</span>}
      {ariaPressed && (
        <Check
          className="ka-chip__selected"
          aria-hidden="true"
          size={16}
          strokeWidth={1.75}
        />
      )}
    </button>
  );
});

export default Chip;
