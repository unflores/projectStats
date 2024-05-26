import cn from "classnames";


const levelClasses = (level: number) => {
  switch(level){
    case 1:
      return "my-2 text-2xl leading-9 tracking-tight lg:text-3xl"
    case 2:
      return "my-1.5 text-xl leading-7 tracking-tight lg:text-2xl"
    case 3:
      return "my-1 text-lg leading-6 tracking-tight lg:text-xl"
    case 4:
      return "text-base leading-5 lg:text-lg font-sans-serif"
    case 5:
      return "text-base font-sans-serif"
    case 3:
      return "text-sm font-sans-serif"
  }
}


interface Props {
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: any;
  id?: string;
  title?: string;
}

function Title({ className, level = 1, children, id, title }: Props) {
  const CustomTag: any = `h${level}`;

  return (
    <CustomTag title={title} id={id} className={cn(levelClasses(level), "mt-3", className)}>
      {children}
    </CustomTag>
  );
}

export default Title;
