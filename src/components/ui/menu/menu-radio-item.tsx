
import * as React from "react";
import * as MenuPrimitive from "@radix-ui/react-menu";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const MenuRadioItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenuPrimitive.ItemIndicator>
    </span>
    {children}
  </MenuPrimitive.RadioItem>
));
MenuRadioItem.displayName = MenuPrimitive.RadioItem.displayName;

export { MenuRadioItem };
