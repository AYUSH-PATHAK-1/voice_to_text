"use client";

import Link from "next/link";
import LogoutButton from "./logout-button";

export default function Sidebar() {
  const email =
    typeof window !== "undefined" ? localStorage.getItem("email") : "";

  return (
    <aside className="w-72 min-h-screen bg-slate-950 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white">AI Meeting</h1>

        <p className="text-sm text-slate-400 mt-1">Intelligence Platform</p>
      </div>

      <nav className="p-4 space-y-3 flex-1">
        <Link
          href="/"
          className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition">
          📊 Dashboard
        </Link>

        <Link
          href="/upload"
          className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition">
          🎤 Upload
        </Link>

        <Link
          href="/meetings"
          className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition">
          📁 Meetings
        </Link>

        <Link
          href="/analytics"
          className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition">
          📈 Analytics
        </Link>

        <Link
          href="/chat"
          className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition">
          💬 Global Chat
        </Link>

        <Link
          href="/search"
          className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition">
          🔍 Search
        </Link>

        <Link
          href="/insights"
          className="block rounded-xl px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition">
          💡 Insights
        </Link>
        <div className="border-t border-slate-800 p-4">
          {/* <p className="text-xs text-slate-500 mb-3 truncate">{email}</p> */}

          <LogoutButton />
        </div>
      </nav>
    </aside>
  );
}
