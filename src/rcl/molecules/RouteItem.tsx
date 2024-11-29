import cn from "classnames";
import Link from "next/link";
import React from "react";

interface Props {
  name: string;
  href: string;
  active: boolean;
}

const RouteItem = ({ name, href, active }: Props) => {
  return (
    <>

      <Link
        className={cn(
          "mx-2 flex items-center p-3 rounded-md text-sm font-medium cursor-pointer relative group",
          {
            "text-gray-600 hover:bg-gray-100 hover:text-gray-900": !active,
            "text-indigo-600 bg-indigo-50 ": active,
          }
        )}
        href={href} passHref>

        <div className="flex items-center h-6 overflow-hidden min-w-6 whitespace-nowrap">
          <span className="ml-2">{name}</span>
        </div>

      </Link>
    </>
  );
};

export default RouteItem;
