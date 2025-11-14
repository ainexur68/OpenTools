import { useContext } from "react";
import { ThemeContext } from "./themeContext";

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme 必须在 <ThemeProvider> 内部使用");
  }

  return context;
};
