import AnalyticsCards from "@/components/analytics-cards";
import DashboardLayout from "@/components/dashboard-layout";

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-5xl font-bold text-white">Dashboard</h1>

        <p className="text-slate-400 mt-2">AI Meeting Intelligence Overview</p>
      </div>

      <AnalyticsCards />
    </DashboardLayout>
  );
}
