
import * as React from "react";
import * as MenuPrimitive from "@radix-ui/react-menu";
import { cn } from "@/lib/utils";

const MenuTrigger = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <MenuPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props}
  >
    {children}
  </MenuPrimitive.Trigger>
));
MenuTrigger.displayName = MenuPrimitive.Trigger.displayName;

export { MenuTrigger };
