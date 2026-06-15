import Sidebar from "./sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-slate-900 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}