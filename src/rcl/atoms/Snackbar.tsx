import {
  CheckmarkFilled,
  Close,
  ErrorFilled,
  InformationFilled,
  WarningFilled,
} from "@carbon/icons-react";
import { Transition } from "@headlessui/react";
import classNames from "classnames";
import type { ReactNode } from "react";
import { useState } from "react";

import s from "./Snackbar.module.css";

interface IProps {
  type: "info" | "error" | "warning" | "success";
  action?: ReactNode;
  children: ReactNode;
  open?: boolean;
  className?: string;
  setOpen?: (open: boolean) => void;
  closeable?: boolean;
}

const Snackbar = ({
  type,
  className,
  action,
  children,
  open,
  setOpen,
  closeable = true,
}: IProps) => {
  const [_open, _setOpen] = useState<boolean>(true);

  const onClose = () => {
    if (setOpen !== undefined) {
      setOpen(false);
    } else {
      _setOpen(false);
    }
  };

  return (
    <Transition
      show={open === undefined ? _open : open}
      enter="transform ease-in-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2 max-h-0 scale-y-0"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0 max-h-screen"
      leave="transition ease-in-out duration-100 max-h-screen"
      leaveFrom="opacity-100"
      leaveTo="opacity-0 max-h-0 scale-y-0"
    >
      <div className={classNames(className, s.base, s[type])}>
        <div className="mb-auto"> {icons[type]}</div>
        {children}
        {action && <div className={s.action}>{action}</div>}
        {closeable && (
          <button className={s.closeButton} onClick={onClose}>
            <Close className="ml-auto" />
          </button>
        )}
      </div>
    </Transition>
  );
};

const icons: { [key in IProps["type"]]: ReactNode } = {
  warning: <WarningFilled className={classNames(s.icon, s.warning)} />,
  info: <InformationFilled className={classNames(s.icon, s.info)} />,
  error: <ErrorFilled className={classNames(s.icon, s.error)} />,
  success: <CheckmarkFilled className={classNames(s.icon, s.success)} />,
};

export default Snackbar;
