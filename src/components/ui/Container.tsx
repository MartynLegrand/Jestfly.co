
import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  containerType?: keyof JSX.IntrinsicElements;
  fluid?: boolean;
}

const Container = ({
  children,
  className,
  containerType = "div",
  fluid = false,
}: ContainerProps) => {
  // Using createElement to avoid conflicts with Three.js types
  return React.createElement(
    containerType,
    {
      className: cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8",
        {
          "max-w-7xl": !fluid,
        },
        className
      ),
    },
    children
  );
};

export default Container;
