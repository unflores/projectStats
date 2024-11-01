import cn from "classnames";
import Link from "next/link";
import React from "react";

interface Props {
  name: string;
  href: string;
  active: boolean;
  Icon: React.FC<{ className?: string; ariaHidden?: string }>;
}

const RouteItem = ({ name, href, active, Icon }: Props) => {
  return (
    <>

      <Link href={href} passHref>
        <a
          className={cn(
            "mx-2 flex items-center p-3 rounded-md text-sm font-medium cursor-pointer relative group",
            {
              "text-gray-600 hover:bg-gray-100 hover:text-gray-900": !active,
              "text-indigo-600 bg-indigo-50 ": active,
            }
          )}
        >
          <div className="flex items-center h-6 overflow-hidden min-w-6 whitespace-nowrap">
            <Icon className="inline-block w-6 h-6 min-w-6" aria-hidden="true" />
            <span className="ml-2">{name}</span>
          </div>
        </a>
      </Link>
    </>
  );
};

export default RouteItem;
