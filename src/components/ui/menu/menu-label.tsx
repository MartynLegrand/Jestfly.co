
import * as React from "react";
import * as MenuPrimitive from "@radix-ui/react-menu";
import { cn } from "@/lib/utils";

const MenuLabel = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold text-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  />
));
MenuLabel.displayName = MenuPrimitive.Label.displayName;

export { MenuLabel };
