import { Suspense } from "react";
import DashboardTopbarHamburgerMenu from "./DashboardTopbarHamburgerMenu";
import DashboardTopbarLogoutButton from "./DashboardTopbarLogoutButton";
import TodayDate from "./TodayDate";
import { cn } from "@/utils/cn";

export default function DashboardTopbar({
  pageName,
  className,
}: {
  pageName: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "components-dashboard-DashboardTopbar mb-2 flex items-center justify-between gap-3 overflow-hidden px-4 pt-2 sm:mb-5",
        className,
      )}
    >
      <div className="flex items-center gap-x-4 text-xl font-semibold">
        <Suspense fallback={<div>...</div>}>
          <DashboardTopbarHamburgerMenu />
        </Suspense>
        <div className="py-1">{pageName}</div>
      </div>
      <div className="flex items-center gap-2.5">
        <TodayDate />
        <Suspense fallback={<div>...</div>}>
          <DashboardTopbarLogoutButton />
        </Suspense>
      </div>
    </div>
  );
}
