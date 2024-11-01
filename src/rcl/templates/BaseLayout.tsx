import { Menu } from "@carbon/icons-react";
import cn from "classnames";
import Image from "next/image";
import logo from "public/images/icons/logo.svg";
import type { PropsWithChildren } from "react";
import React from "react";

import SideBar from "@/rcl/molecules/SideBar";
import type { Route } from "@/rcl/molecules/SideBar";

interface Props {
  Breadcrumbs?: React.FC;
  navigation: Route[];
}

const BaseLayout = ({ children, navigation, Breadcrumbs }: PropsWithChildren<Props>) => {
    return (
    <div className="relative z-40 flex min-h-screen">
      <SideBar
        navigation={navigation}
        className="hidden lg:flex"
      />

      <div className="relative flex-1 min-w-0">
        <div
          className={cn("top-0 sticky z-40 no-print lg:ml-[232px]", {
            "lg:hidden": !Breadcrumbs,
          })}
        >
          <div className="top-0 flex items-center w-full h-12 px-4 bg-white border-b bg-white-600 lg:px-6">
                    {Breadcrumbs ? (
              <div className="h-full overflow-x-scroll md:overflow-hidden flex-center">
                <Breadcrumbs />
              </div>
            ) : (
              <div className="relative w-64 h-6 ml-auto mr-6 justify-self-end lg:hidden">
                <Image
                  src={logo}
                  alt="Genesis"
                  layout="fill"
                  objectFit="contain"
                  objectPosition="right"
                />
              </div>
            )}
          </div>
        </div>

        <main
          className={cn("lg:mt-0 print-content lg:ml-[232px]", {
            fit: !!Breadcrumbs,
            "min-h-screen": !Breadcrumbs,

          })}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;
