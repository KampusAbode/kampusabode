"use client";

import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import "./button.css";
import "./icon-button.css";

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "children" | "className"
> & {
  "aria-label": string;
  children: ReactNode;
  className?: string;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { "aria-label": ariaLabel, children, className, type = "button", ...props },
    ref
  ) {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        data-ka-control="true"
        aria-label={ariaLabel}
        className={cn(
          "ka-control",
          "ka-control--compact-hit",
          "ka-icon-button",
          className
        )}
      >
        <span className="ka-icon-button__icon" aria-hidden="true">
          {children}
        </span>
      </button>
    );
  }
);

export default IconButton;
