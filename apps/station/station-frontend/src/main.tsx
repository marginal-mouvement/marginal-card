import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";

import App from "./App.tsx";

import { ThemeProvider } from "@/components/theme-provider.tsx";
import { ReaderContextProvider } from "@/core/reader/readerContext.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <ReaderContextProvider>
        <Toaster position="top-right" />
        <App />
      </ReaderContextProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
