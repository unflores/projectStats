import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";

import RouteItem from "./RouteItem";

export type Route = {
  name: string;
  href: string;
  isActive: (route: string) => boolean;
  Icon: React.FC<{ className?: string; ariaHidden?: string }>;
}

interface Props {
  navigation: Route[];

  className?: string;
}

const SideBar = ({ navigation, className }: Props) => {
  const router = useRouter();
  return (
    <div className={cn("fixed z-40 min-h-screen no-print", className)}>
      <div
        className={cn(
          "flex flex-col transition-all duration-200 ease-in-out bg-white border-r border-gray-200 w-[232px]",
        )}
      >
        <div className="flex flex-col flex-1">
          <div className="h-16 p-5">
            <div className="relative h-5 overflow-hidden">

              <Link href="/">
                <a className={cn("absolute block w-[134px] h-5", { invisible: !menuOpen })}>
                  Logo
                </a>
              </Link>
            </div>
          </div>

          <nav aria-label="Sidebar" className="flex flex-col">
            {navigation.map(({ name, href, isActive, Icon }) => (
              <RouteItem
                key={href}
                name={name}
                href={href}
                active={isActive(router.pathname)}
                Icon={Icon}
                menuOpen={menuOpen}
              />
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
