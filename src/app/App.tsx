import React from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/shared/theme/themeContext";
import { router } from "@/app/router";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
