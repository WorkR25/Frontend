import { Bell, Calendar } from "lucide-react";

export default function DashboardTopbar() {
  return (
    <div className="flex items-center justify-between px-4 overflow-hidden mb-5">
      <div className="text-xl font-semibold">Overview</div>
      <div className="flex items-center gap-3">
        <div className="pr-4">
          <Bell strokeWidth={2} className="w-5 h-5 font-bold " />
        </div>
        <div className="flex gap-2">
          <div>
            <Calendar className="w-5 h-5" />
          </div>
          <div className="text-sm">January 24, 2025</div>
        </div>
        <div>Language</div>
      </div>
    </div>
  );
}
