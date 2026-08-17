/**
 * Button — reusable CTA button (renders <Link> when href is provided, else <button>).
 *
 * Variants:
 *   - "primary"   : bleed-red bg, bone-white text
 *   - "secondary" : transparent bg, bleed-red border + text
 *   - "ghost"     : transparent, bone-white text (for dark backgrounds)
 *
 * Sizes:
 *   - "sm" / "md" / "lg"
 */

"use client";

import Link from "next/link";
import { type ReactNode, type CSSProperties } from "react";
import { BLEED_RED, BONE_WHITE } from "@/lib/constants";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  fullWidth?: boolean;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  onClick?: never;
  type?: never;
  disabled?: never;
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

type ButtonProps = ButtonAsLink | ButtonAsButton;

const SIZES: Record<Size, { padding: string; fontSize: number }> = {
  sm: { padding: "8px 16px", fontSize: 13 },
  md: { padding: "14px 28px", fontSize: 15 },
  lg: { padding: "18px 36px", fontSize: 17 },
};

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    children,
    className = "",
    style = {},
    fullWidth = false,
  } = props;

  const dims = SIZES[size];

  const variantStyles: CSSProperties =
    variant === "primary"
      ? {
          background: BLEED_RED,
          color: BONE_WHITE,
          border: `2px solid ${BLEED_RED}`,
        }
      : variant === "secondary"
      ? {
          background: "transparent",
          color: BLEED_RED,
          border: `2px solid ${BLEED_RED}`,
        }
      : {
          background: "transparent",
          color: BONE_WHITE,
          border: `2px solid ${BONE_WHITE}`,
        };

  const baseStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontWeight: 700,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    textDecoration: "none",
    cursor: props.disabled ? "not-allowed" : "pointer",
    opacity: props.disabled ? 0.5 : 1,
    width: fullWidth ? "100%" : "auto",
    transition: "background 0.15s ease, color 0.15s ease",
    ...dims,
    ...variantStyles,
    ...style,
  };

  if (props.href) {
    return (
      <Link href={props.href} className={className} style={baseStyle}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={className}
      style={baseStyle}
    >
      {children}
    </button>
  );
}