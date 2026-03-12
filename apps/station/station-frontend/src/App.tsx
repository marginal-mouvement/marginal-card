import { Routes, Route, Navigate } from "react-router";
import { use } from "react";

import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { Menu } from "@/parts/menu.tsx";
import { ReaderContext } from "@/core/reader/reader.context.tsx";
import { SettingsPage } from "@/pages/settings/settings.page.tsx";
import { ReaderPage } from "@/pages/reader/reader.page.tsx";

export function App() {
  const { readerList } = use(ReaderContext);
  return (
    <SidebarProvider>
      <Menu />
      <Routes>
        <Route path="/station/settings" element={<SettingsPage />} />
        {readerList.map((reader) => (
          <Route
            key={reader.id}
            path={`/reader/${reader.id}`}
            element={
              <ReaderPage readerId={reader.id} readerName={reader.name} />
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/station/settings" />} />
      </Routes>
    </SidebarProvider>
  );
}

export default App;
