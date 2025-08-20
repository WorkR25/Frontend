'use client'
import { isSidebarOpenToogle } from "@/features/isSidebarOpen/isSidebarOpenSlice";
import { cn } from "@/utils/cn";
import { getFormattedDate } from "@/utils/getTime";
import { AlignJustify, Bell, Calendar } from "lucide-react";
import { useDispatch } from "react-redux";

export default function DashboardTopbar({
  pageName,
  className,
}: {
  pageName:string,
  className?: string,
}) {

  const dispatch = useDispatch();
  return (
    <div className={cn("components-dashboard-DashboardTopbar flex items-center justify-between px-4 pt-2 overflow-hidden mb-2 sm:mb-5", className)}>
      <div className="components-dashboard-DashboardTopbar text-xl flex items-center text-center gap-x-7 font-semibold">
        <div
          className="components-dashboard-DashboardTopbar sm:hidden hover:cursor-pointer"
          onClick={() => {
            dispatch(isSidebarOpenToogle(true));
          }}
        >
          <AlignJustify />
        </div>
        <div>{pageName}</div>
      </div>
      <div className="components-dashboard-DashboardTopbar flex items-center gap-3">
        {/* <div className="pr-4">
          <Bell strokeWidth={2} className="components-dashboard-DashboardTopbar w-5 h-5 font-bold " />
        </div> */}
        <div className="components-dashboard-DashboardTopbar gap-2 hidden sm:flex">
          <div>
            <Calendar className="components-dashboard-DashboardTopbar w-5 h-5 hidden sm:block" />
          </div>
          <div className="components-dashboard-DashboardTopbar text-sm hidden sm:block">{getFormattedDate()}</div>
        </div>
        {/* <div className="components-dashboard-DashboardTopbar hidden sm:block">Language</div> */}
      </div>
    </div>
  );
}
