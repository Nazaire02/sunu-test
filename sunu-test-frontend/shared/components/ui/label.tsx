import * as React from "react";
import { cn } from "@/lib/utils";

const getLabelClasses = (className?: string) => {
  const baseClasses =
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
  return cn(baseClasses, className);
};

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={getLabelClasses(className)}
      {...props}
    />
  )
);
Label.displayName = "Label";

export { Label };