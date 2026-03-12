import { Routes, Route, Navigate } from "react-router";

import { RegisterPage } from "@/pages/register/register.page.tsx";
import { LandingPage } from "@/pages/landing/landing.page.tsx";

export const UnauthenticatedContainer = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/k/:keyId" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
