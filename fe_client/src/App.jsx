
import { useState } from "react";
import ClientShell from "./components/ClientShell";
import ConsumerPage from "./pages/ConsumerPage";
import ClientPage from "./pages/ClientPage";

export default function App() {
  const [page, setPage] = useState("consumer");

  const content = {
    consumer: <ConsumerPage />,
    client: <ClientPage />,
  }[page];

  return (
    <ClientShell page={page} setPage={setPage}>
      {content}
    </ClientShell>
  );
}