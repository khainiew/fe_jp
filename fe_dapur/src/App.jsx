import { useState } from "react";
import AppShell from "./components/AppShell";
import Dashboard from "./pages/Dashboard";
import ControlPoints from "./pages/ControlPoints";
import ConsumerPage from "./pages/ConsumerPage";

export default function App() {
  const [page, setPage] = useState("dashboard");

  const content = {
    dashboard: <Dashboard />,
    control: <ControlPoints />,
    consumer: <ConsumerPage />
  }[page];

  return (
    <AppShell page={page} setPage={setPage}>
      {content}
    </AppShell>
  );
}