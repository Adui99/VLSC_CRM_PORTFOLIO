import React, { CSSProperties } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
  hoverOnly?: boolean;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "1.5px",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(0, 0, 0, 1)",
      className,
      children,
      hoverOnly = false,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)]",
          "transform-gpu transition-all duration-300 ease-in-out active:translate-y-px",
          className,
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          style={{
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "var(--cut)",
            borderRadius: "var(--radius)"
          }}
          className={cn(
            "absolute inset-0 overflow-hidden pointer-events-none",
            hoverOnly ? "opacity-0 transition-opacity duration-300 group-hover:opacity-100" : ""
          )}
        >
          {/* spark */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] aspect-square animate-spin-around [background:conic-gradient(from_-270deg_at_50%_50%,transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 pointer-events-none flex items-center justify-center">
          {children}
        </div>
      </button>
    );
  },
);

ShimmerButton.displayName = "ShimmerButton";
