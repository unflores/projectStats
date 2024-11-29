import cn from "classnames";
import type { FC } from "react";
import React from "react";

interface Props {
  children?: React.ReactNode;
  className?: string;
  el?: HTMLElement;
  clean?: boolean;
  fullWidth?: boolean;
}

const Container: FC<Props> = ({ children, className, el = "div" }) => {
  const rootClassName = cn("mx-auto px-4 w-32 w-[80vw] bg-white rounded shadow-lg py-8 space-y-8", className);

  const Component: React.ComponentType<React.HTMLAttributes<HTMLDivElement>> = el as unknown as React.ComponentType<React.HTMLAttributes<HTMLDivElement>>;

  return <Component className={rootClassName}>{children}</Component>;
};

export default Container;
