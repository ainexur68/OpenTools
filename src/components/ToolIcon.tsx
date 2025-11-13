import React from "react";
import { toolIcons } from "@/icons";

export interface ToolIconProps extends React.ComponentPropsWithoutRef<"img"> {
  readonly name: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, className, alt, ...rest }) => {
  const src = toolIcons[name];

  if (!src) {
    return null;
  }

  return <img src={src} alt={alt ?? name} className={className} {...rest} />;
};
