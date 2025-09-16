import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  children,
  padding = "md",
  ...props 
}, ref) => {
  const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };
  
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-xl shadow-sm border border-secondary-200",
        "hover:shadow-md transition-shadow duration-200",
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;