import DashboardRightside from "@/components/dashboard/DashboardRightside";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="text-black  h-[100vh] w-[100vw] p-2 bg-[#F5F5F5]">
      <div className="flex h-full gap-x-2">
        <div className="basis-1/5 overflow-y-scroll px-3">
          <DashboardSidebar />
        </div>
        <div className="basis-4/5 rounded-lg overflow-hidden">
          <div className="text-black p-2 bg-[#FFFF] h-full  ">
            <DashboardTopbar />
            <div className="flex m-4 h-full w-full">
              {children}
              <DashboardRightside />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
