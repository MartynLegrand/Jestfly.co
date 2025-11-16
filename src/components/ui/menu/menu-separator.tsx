
import * as React from "react";
import * as MenuPrimitive from "@radix-ui/react-menu";
import { cn } from "@/lib/utils";

const MenuSeparator = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
MenuSeparator.displayName = MenuPrimitive.Separator.displayName;

export { MenuSeparator };
