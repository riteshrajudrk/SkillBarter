import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

export default function AppShell() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
