import cn from "classnames";

import type { FC } from "react";
import React from "react";
import "../globals.css";



const BaseLayout: FC<{
  children: React.ReactNode;
  Breadcrumbs?: React.FunctionComponent;
  navigation: Array<{
    name: string;
    href: string;
    isActive: (route: string) => boolean;
    icon: React.FC<{ className?: string; ariaHidden?: string }>;
  }>;
}> = ({ children }) => {

  return (
    <div className=" flex min-h-screen">

        <main
          className={cn("m-auto mt-20 print-me")}
        >
          {children}
        </main>
      </div>


  );
};

export default BaseLayout;
