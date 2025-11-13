import React from "react";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="w-full max-w-xl mx-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold mb-2">OpenTools</h1>
        <p className="text-sm text-slate-300 mb-4">
          Vite 4 + React + TypeScript + Tailwind 3 scaffold, compatible with Node 18.x.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 mt-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm">
            <div className="font-medium mb-1">Dev</div>
            <code className="text-xs text-slate-300">npm run dev</code>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm">
            <div className="font-medium mb-1">Build</div>
            <code className="text-xs text-slate-300">npm run build</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
