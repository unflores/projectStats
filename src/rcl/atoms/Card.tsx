import cn from "classnames";
import type { ReactNode } from "react";
import React from "react";

interface Props {
  className?: string;
  children: ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, Props>(
  ({ children, className, ...rest }, ref) => {
    const rootClassName = cn(
      "bg-white rounded-lg border border-gray-200 p-4",
      className
    );

    return (
      <div ref={ref} {...rest} className={rootClassName}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
