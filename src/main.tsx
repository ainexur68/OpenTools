import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./styles/tailwind.css";

if (typeof window !== "undefined" && window.location.pathname.endsWith("index.html")) {
  const { pathname, search, hash } = window.location;
  const nextPathname = pathname.replace(/index\.html$/, "") || "/";
  const nextUrl = `${nextPathname}${search}${hash}`;

  window.history.replaceState(null, "", nextUrl);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
