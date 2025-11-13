import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./theme-context"; // import ThemeProvider
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
