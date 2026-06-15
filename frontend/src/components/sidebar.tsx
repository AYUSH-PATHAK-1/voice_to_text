"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Upload, 
  Folder, 
  BarChart3, 
  MessageSquare, 
  Search, 
  Lightbulb,
} from "lucide-react";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard", color: "text-neon-purple" },
  { href: "/upload", icon: Upload, label: "Upload", color: "text-neon-blue" },
  { href: "/meetings", icon: Folder, label: "Meetings", color: "text-neon-cyan" },
  { href: "/analytics", icon: BarChart3, label: "Analytics", color: "text-neon-green" },
  { href: "/chat", icon: MessageSquare, label: "Chat", color: "text-neon-pink" },
  { href: "/search", icon: Search, label: "Search", color: "text-neon-purple" },
  { href: "/insights", icon: Lightbulb, label: "Insights", color: "text-neon-blue" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 min-h-screen bg-slate-950/80 backdrop-blur-2xl border-r border-slate-800/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-3xl" />
      
      <div className="p-6 border-b border-slate-800/50">
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">AI Audio</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">Transcription Suite</p>
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all group ${
                isActive
                  ? "text-white bg-gradient-to-r from-slate-800 to-slate-800/50"
                  : "text-slate-400 hover:text-white"
              }`}
              scroll={false}
            >
              {isActive && (
                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full" />
              )}
              
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-all ${isActive ? item.color : "group-hover:" + item.color}`}
                />
              </div>
              
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-4 right-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm">Audio AI</p>
              <p className="text-slate-400 text-xs truncate">v2.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}