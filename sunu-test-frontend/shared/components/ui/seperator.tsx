"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      ...props
    },
    ref
  ) => {
    const ariaOrientation = orientation === "vertical" ? "vertical" : "horizontal";
    if (decorative) {
      return (
        <div
          ref={ref}
          className={cn(
            "shrink-0 bg-border",
            orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
            className
          )}
          {...props}
        />
      );
    }

    if (orientation === "horizontal") {
      return (
        <hr
          ref={ref as React.RefObject<HTMLHRElement>}
          className={cn(
            "h-[1px] w-full border-0 bg-border shrink-0",
            className
          )}
          {...props}
        />
      );
    }
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={ariaOrientation}
        className={cn(
          "h-full w-[1px] bg-border shrink-0",
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";

export { Separator };