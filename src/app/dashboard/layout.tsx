"use client";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import { RootState } from "@/lib/store.config";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isSidebarOpen = useSelector((state: RootState) => {return state.isSidebarOpen.value});

  return (
    <div className="text-black  h-[100vh] w-[100vw] bg-[#F5F5F5]">
      <div
        className={`absolute w-[100vw] h-[100vh] sm:hidden  border top-0 left-0 bg-black opacity-35 z-10 ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      ></div>
      <div className={"sm:flex h-full gap-x-2"}>
        <div className={`hidden sm:block basis-1/5 overflow-y-scroll px-3`}>
          <DashboardSidebar />
        </div>
        <div
          className={`absolute rounded-r-lg bg-[#F5F5F5] h-full w-[60%] sm:hidden overflow-y-scroll px-5 z-50 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <DashboardSidebar />
        </div>
        <div className="sm:basis-4/5 rounded-lg overflow-hidden">
          <div className="text-black p-2 bg-[#FFFF] h-full pb-0 ">
            <DashboardTopbar pathName={pathname.split('/')[2]}/>
              {children}
            
          </div>
        </div>
      </div>
    </div>
  );
}
