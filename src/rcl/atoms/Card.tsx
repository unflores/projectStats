import cn from "classnames";
import type { JSXElementConstructor, ReactNode } from "react";
import React from "react";

interface Props {
  Component?: string | JSXElementConstructor<any>;
  className?: string;
  children: ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, Props>(
  ({ children, className, Component = "div", ...rest }, ref) => {
    const rootClassName = cn(
      "bg-white rounded-lg border border-gray-200 p-4",

      className
    );

    return (
      <Component ref={ref} {...rest} className={rootClassName}>
        {children}
      </Component>
    );
  }
);

Card.displayName = "Card";

export default Card;
