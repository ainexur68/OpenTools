import React from "react";
import { toolIcons } from "@/assets/icons";

export interface ToolIconProps extends React.ComponentPropsWithoutRef<"img"> {
  readonly name: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, className, alt, ...rest }) => {
  const src = toolIcons[name];

  if (!src) {
    return (
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-slate-300 text-xs font-semibold uppercase text-slate-400 ${className ?? ""}`}
      >
        {name.slice(0, 2)}
      </div>
    );
  }

  return <img src={src} alt={alt ?? name} className={className} {...rest} />;
};
