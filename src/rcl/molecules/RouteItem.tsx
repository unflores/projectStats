import cn from "classnames";
import Link from "next/link";

interface Props {
  name: string;
  href?: string;
  active: boolean;
}

const RouteItem = ({ name, href, active }: Props) => {
  return href
    ? (
      <Link
        className={cn(
          "mx-2 flex items-center p-3 rounded-md text-sm font-medium cursor-pointer relative group",
          {
            "text-gray-600 hover:bg-gray-100 hover:text-gray-900": !active,
            "text-indigo-600 bg-indigo-50 ": active,
          }
        )}
        href={href} passHref>

        <div className="w-full h-6 overflow-hidden text-center whitespace-nowrap">
          {name}
        </div>

      </Link>
    )
    : (
      <span
        className={cn(
          "p-3 text-sm font-medium text-gray-600"
        )}
      >
        <div className="items-center h-6 overflow-hidden text-center min-w-6 whitespace-nowrap">
          {name}
        </div>

      </span>
    );
};

export default RouteItem;
