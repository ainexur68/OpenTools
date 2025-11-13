import React from "react";
import { toolId, toolMeta } from "./meta";

export { toolId, toolMeta };

export const DateDiffTool: React.FC = () => {
  return (
    <div className="p-4 space-y-3">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">
          {toolMeta.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {toolMeta.description}
        </p>
      </header>

      <section className="text-sm text-muted-foreground">
        <p>TODO: 在这里实现 <strong>{toolMeta.title}</strong> 的具体功能。</p>
        <p className="mt-2">
          你可以参考其他工具的实现，复用常用组件、hooks 和样式。
        </p>
      </section>
    </div>
  );
};

export default DateDiffTool;
