"use client";
import CreateJobForm from "@/components/createJob/createJobForm";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import UpdateJobForm from "@/components/updateJob/UpdateJobForm";
import { RootState } from "@/lib/store.config";
import { useSelector } from "react-redux";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jobId= useSelector((state: RootState)=> {return state.jobId.value})

  const isSidebarOpen = useSelector((state: RootState) => {
    return state.isSidebarOpen.value;
  });

  const showJobCreateForm = useSelector(
    (state: RootState) => state.showJobCreateForm.value
  );

  const showJobUpdateForm = useSelector((state: RootState)=> state.showJobUpdateForm.value);

  return (
    <div className="text-black  h-[100vh] w-[100vw] bg-[#F5F5F5]">
      {showJobCreateForm && (
        <div className="hidden sm:block sm:absolute top-[10%] right-[10%] rounded-lg shadow-xl px-10 hide-scrollbar justify-center z-20 h-screen w-full sm:w-[79%] bg-[#F5F5F5] overflow-y-auto">
          <div className="flex flex-col justify-center items-center  w-full min-h-full">
            <CreateJobForm className=" h-screen w-full" />
          </div>
        </div>
      )}

      {showJobUpdateForm && (
        <div className="hidden sm:block sm:absolute top-[10%] right-[10%] rounded-lg shadow-xl px-10 hide-scrollbar justify-center z-20 h-screen w-full sm:w-[79%] bg-[#F5F5F5] overflow-y-auto">
          <div className="flex flex-col justify-center items-center  w-full min-h-full">
            <UpdateJobForm id={Number(jobId)} className=" h-screen w-full" />
          </div>
        </div>
      )}
      <div
        className={`absolute w-[100vw] h-[100vh] sm:hidden  border top-0 left-0 bg-black opacity-35 z-10 ${
          isSidebarOpen ? (showJobCreateForm ? "hidden" : "block") : "hidden"
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
          {showJobCreateForm && (
            // {/* // sm:flex */}
            <div className="absolute sm:hidden px-10 hide-scrollbar flex justify-center z-40 h-screen w-full sm:w-[79%] bg-white overflow-y-auto">
              <div className="flex flex-col justify-center items-center  w-full min-h-full">
                <CreateJobForm className=" h-screen w-full" />
              </div>
            </div>
          )}

          {showJobUpdateForm && (
            // {/* // sm:flex */}
            <div className="absolute sm:hidden px-10 hide-scrollbar flex justify-center z-40 h-screen w-full sm:w-[79%] bg-white overflow-y-auto">
              <div className="flex flex-col justify-center items-center  w-full min-h-full">
                <UpdateJobForm id={Number(jobId)} className=" h-screen w-full" />
              </div>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
