import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        incoming:
          "border-transparent bg-[#FFA500] text-white shadow hover:bg-[#FFA500]/80",
        process:
          "border-transparent bg-blue-500 text-white shadow hover:bg-blue-500/80",
        done: "border-transparent bg-green-500 text-white shadow hover:bg-green-500/80",
        reject:
          "border-transparent bg-red-500 text-white shadow hover:bg-red-500/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  console.log(variant, "<<variant");

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
