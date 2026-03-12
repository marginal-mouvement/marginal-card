import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";

import App from "./App.tsx";

import { ThemeProvider } from "@/components/theme-provider.tsx";
import { AuthContextProvider } from "@/modules/auth/auth.context.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider defaultTheme="light">
      <AuthContextProvider>
        <Toaster position="top-center" />
        <App />
      </AuthContextProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
