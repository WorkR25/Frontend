"use client";
import CreateJobForm from "@/components/createJob/createJobForm";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import UpdateJobForm from "@/components/updateJob/UpdateJobForm";
import ViewApplicants from "@/components/viewApplicants/ViewApplicants";
import { RootState } from "@/lib/store.config";
import { useSelector } from "react-redux";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const isSidebarOpen = useSelector((state: RootState) => {
    return state.isSidebarOpen.value;
  });

  const showJobApplicants= useSelector((state: RootState)=>{
    return state.showJobApplicants.value
  })

  const jobId= useSelector((state: RootState)=>{
    return state.jobId.value
  })

  const showJobCreateForm = useSelector(
    (state: RootState) => state.showJobCreateForm.value
  );

  const showJobUpdateForm = useSelector((state: RootState)=> state.showJobUpdateForm.value);

  return (
    <div className="dashboard-layout text-black  h-[100vh] w-[100vw] bg-[#F5F5F5]">
      
      {showJobApplicants && (
        <div className="shadow-gray-500 border border-gray-700 dashboard-layout hidden sm:block sm:absolute top-[10%] right-[10%] rounded-lg shadow-lg px-10 hide-scrollbar justify-center z-20 h-[calc(100vh-20%)] w-full sm:w-[79%] bg-[#F5F5F5] overflow-y-auto">
          <div className="dashboard-layout w-full min-h-full">
          <ViewApplicants jobId={Number(jobId)}/>
          </div>
        </div>
      )}

      {showJobCreateForm && (
        <div className="dashboard-layout hidden sm:block sm:absolute top-[10%] right-[10%] rounded-lg shadow-xl px-10 hide-scrollbar justify-center z-20 h-[calc(100vh-20%)] w-full sm:w-[79%] bg-[#F5F5F5] overflow-y-auto">
          <div className="dashboard-layout flex flex-col justify-center items-center  w-full min-h-full">
            <CreateJobForm className="dashboard-layout h-screen w-full" />
          </div>
        </div>
      )}

      {showJobUpdateForm && (
        <div className="dashboard-layout hidden sm:block sm:absolute top-[10%] right-[10%] rounded-lg shadow-xl px-10 hide-scrollbar justify-center z-20 h-[calc(100vh-20%)] w-full sm:w-[79%] bg-[#F5F5F5] overflow-y-auto">
          <div className="dashboard-layout  flex flex-col justify-center items-center  w-full min-h-full">
            <UpdateJobForm id={Number(jobId)} className="dashboard-layout h-screen w-full" />
          </div>
        </div>
      )}
      <div
        className={`dashboard-layout absolute w-[100vw] h-[100vh] sm:hidden  border top-0 left-0 bg-black opacity-35 z-10 ${
          isSidebarOpen ? (showJobCreateForm ? "hidden" : "block") : "hidden"
        }`}
      ></div>
      <div className={"dashboard-layout sm:flex h-full gap-x-2"}>
        <div className={`dashboard-layout hidden sm:block basis-1/5 overflow-y-scroll px-3`}>
          <DashboardSidebar />
        </div>
        <div
          className={`dashboard-layout absolute rounded-r-lg bg-[#F5F5F5] h-full w-[60%] sm:hidden overflow-y-scroll px-5 z-50 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <DashboardSidebar />
        </div>
        <div className="dashboard-layout sm:basis-4/5 rounded-lg overflow-hidden">
          
          {showJobApplicants && (
            <div className="dashboard-layout absolute sm:hidden px-5 hide-scrollbar flex justify-center z-40 h-screen w-full sm:w-[79%] bg-white overflow-y-auto">
              <div className="dashboard-layout w-full min-h-full">
                <ViewApplicants jobId={Number(jobId)}/>
              </div>
            </div>
          )}

          {showJobCreateForm && (
            <div className="dashboard-layout absolute sm:hidden px-10 hide-scrollbar flex justify-center z-40 h-screen w-full sm:w-[79%] bg-white overflow-y-auto">
              <div className="dashboard-layout flex flex-col justify-center items-center  w-full min-h-full">
                <CreateJobForm className="dashboard-layout  h-screen w-full" />
              </div>
            </div>
          )}

          {showJobUpdateForm && (
            <div className="dashboard-layout absolute sm:hidden px-10 hide-scrollbar flex justify-center z-40 h-screen w-full sm:w-[79%] bg-white overflow-y-auto">
              <div className="dashboard-layout flex flex-col justify-center items-center  w-full min-h-full">
                <UpdateJobForm id={Number(jobId)} className="dashboard-layout h-screen w-full" />
              </div>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
