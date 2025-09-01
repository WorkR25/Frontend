"use client";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { isSidebarOpenToogle } from "@/features/isSidebarOpen/isSidebarOpenSlice";
import { cn } from "@/utils/cn";
import { getFormattedDate } from "@/utils/getTime";
import { AlignJustify, Calendar, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function DashboardTopbar({
  pageName,
  className,
}: {
  pageName: string;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "components-dashboard-DashboardTopbar flex items-center justify-between px-4 pt-2 overflow-hidden mb-2 sm:mb-5",
        className
      )}
    >
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
        <div className="components-dashboard-DashboardTopbar gap-2 flex items-center ">
          <div className="hidden sm:block">
            <Calendar className="components-dashboard-DashboardTopbar w-5 h-5 hidden sm:block" />
          </div>
          <div className="components-dashboard-DashboardTopbar text-sm hidden sm:block">
            {getFormattedDate()}
          </div>
          <div>
            
            <button
              className="rounded-full bg-blue-200 hover:cursor-pointer hover:bg-blue-300 p-2"
              onClick={() => {
                localStorage.removeItem("AuthJwtToken");
                dispatch(setAuthJwtToken(""))
                router.replace("/login");
              }}
            >
              <LogOut height={20} width={20}/>
            </button>
          </div>
        </div>
        {/* <div className="components-dashboard-DashboardTopbar hidden sm:block">Language</div> */}
      </div>
    </div>
  );
}
