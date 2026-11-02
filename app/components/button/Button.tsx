"use client";

import Link, { LinkProps } from "next/link";
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  forwardRef,
  ReactNode,
} from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import "./button.css";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "link";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  className?: string;
  children?: ReactNode;
}

type NativeButtonProps = ButtonStyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    href?: never;
  };

type ButtonLinkProps = ButtonStyleProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "href"> &
  LinkProps & {
    href: LinkProps["href"];
    disabled?: boolean;
  };

export type SharedButtonProps = NativeButtonProps | ButtonLinkProps;

const buttonClasses = (
  variant: ButtonVariant,
  size: ButtonSize,
  className: string | undefined,
  loading: boolean,
  hasRightIcon: boolean
) =>
  cn(
    "ka-button",
    `ka-button--${variant}`,
    `ka-button--${size}`,
    loading && "ka-button--loading",
    hasRightIcon && "ka-button--has-right-icon",
    className
  );

function ButtonContent({
  children,
  leftIcon,
  rightIcon,
  loading,
}: Pick<ButtonStyleProps, "children" | "leftIcon" | "rightIcon" | "loading">) {
  return (
    <>
      {leftIcon && (
        <span className="ka-button__icon" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {children != null && (
        <span className="ka-button__label">{children}</span>
      )}
      {rightIcon && (
        <span
          className="ka-button__icon ka-control__icon--right"
          aria-hidden="true"
        >
          {rightIcon}
        </span>
      )}
      {loading && (
        <LoaderCircle
          className="ka-control__spinner ka-button__spinner"
          aria-hidden="true"
          size={20}
          strokeWidth={1.75}
        />
      )}
    </>
  );
}

const NativeButton = forwardRef<HTMLButtonElement, NativeButtonProps>(
  function NativeButton(
    {
      variant = "primary",
      size = "md",
      leftIcon,
      rightIcon,
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) {
    return (
      <button
        {...props}
        ref={ref}
        data-ka-control="true"
        className={cn(
          "ka-control",
          buttonClasses(variant, size, className, loading, Boolean(rightIcon))
        )}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
      >
        <ButtonContent
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          loading={loading}
        >
          {children}
        </ButtonContent>
      </button>
    );
  }
);

function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      href={href}
      data-ka-control="true"
      className={cn(
        "ka-control",
        buttonClasses(variant, size, className, loading, Boolean(rightIcon))
      )}
      aria-disabled={disabled || loading || undefined}
      aria-busy={loading || undefined}
      tabIndex={disabled || loading ? -1 : props.tabIndex}
      onClick={(event) => {
        if (disabled || loading) {
          event.preventDefault();
          return;
        }
        props.onClick?.(event);
      }}
    >
      <ButtonContent
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        loading={loading}
      >
        {children}
      </ButtonContent>
    </Link>
  );
}

export { NativeButton as Button, ButtonLink };
