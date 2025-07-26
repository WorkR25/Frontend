import { AlignJustify, Bell, Calendar } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export default function DashboardTopbar({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="flex items-center justify-between px-4 pt-2 overflow-hidden mb-5">
      <div className="text-xl flex items-center text-center gap-x-7 font-semibold">
        <div
          className="sm:hidden hover:cursor-pointer"
          onClick={() => {
            setIsSidebarOpen((prev) => {
              return !prev;
            });
          }}
        >
          <AlignJustify />
        </div>
        <div>Overview</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="pr-4">
          <Bell strokeWidth={2} className="w-5 h-5 font-bold " />
        </div>
        <div className="gap-2 hidden sm:flex">
          <div>
            <Calendar className="w-5 h-5 hidden sm:block" />
          </div>
          <div className="text-sm hidden sm:block">January 24, 2025</div>
        </div>
        <div className="hidden sm:block">Language</div>
      </div>
    </div>
  );
}
