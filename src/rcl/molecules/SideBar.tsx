"use client";
import cn from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

import RouteItem from "./RouteItem";

export type Route = {
  name: string;
  href?: string;
  isActive?: (route: string | null) => boolean;
};

interface Props {
  navigation: Route[];
  className?: string;
}

const SideBar = ({ navigation, className }: Props) => {
  const pathname = usePathname();
  return (
    <div className={cn("px-0 md:fixed md:flex z-40 md:min-h-screen no-print", className)}>
      <div
        className={
          "flex flex-col transition-all duration-200 ease-in-out bg-white md:border-r md:border-gray-200 md:w-[10rem]"
        }
      >
        <div className="flex flex-col flex-1">
          <div className="h-16 p-5">
            <div className="relative h-5 overflow-hidden">
              <Link className={cn("absolute block w-[134px] h-5")} href="/">
                Projects
              </Link>
            </div>
          </div>

          <nav aria-label="Sidebar" className="flex flex-col">
            {navigation.map(({ name, href, isActive }) => (
              <RouteItem
                key={href}
                name={name}
                href={href}
                active={isActive ? isActive(pathname) : href === pathname}
              />
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
