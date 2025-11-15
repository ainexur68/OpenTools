import React from "react";
import { getToolIcon } from "@/assets/icons";

export interface ToolIconProps extends React.ComponentPropsWithoutRef<"img"> {
  readonly name: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, className, alt, ...rest }) => {
  const src = getToolIcon(name);

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-slate-100/80 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/80 dark:text-slate-200 ${className ?? ""}`}
      >
        {name.slice(0, 2)}
      </div>
    );
  }

  return <img src={src} alt={alt ?? name} className={className} {...rest} />;
};
