'use client'

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}