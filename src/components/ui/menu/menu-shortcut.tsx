
import * as React from "react";
import { cn } from "@/lib/utils";

const MenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};
MenuShortcut.displayName = "MenuShortcut";

export { MenuShortcut };
