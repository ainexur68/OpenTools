import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import { ToolLayout } from "@/features/tools/layouts/ToolLayout";
import { ToolHubPage } from "@/features/tools/pages/ToolHub";

const NotFound: React.FC = () => (
  <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/60 dark:text-amber-200">
    <p className="font-medium">页面不存在</p>
    <p className="mt-1 text-xs">请检查地址或返回首页。</p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <ToolHubPage /> },
      { path: "tools/:toolId", element: <ToolLayout /> },
      { path: "*", element: <NotFound /> }
    ]
  }
]);

export default router;
