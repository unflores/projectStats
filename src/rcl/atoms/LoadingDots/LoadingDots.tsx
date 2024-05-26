import cn from "classnames";

import styles from "./LoadingDots.module.css";

interface Props {
  className?: string;
}

const LoadingDots = ({ className }: Props) => {
  return (
    <div className={cn(styles.root, className)}>
      <span />
      <span />
      <span />
    </div>
  );
};

export default LoadingDots;
