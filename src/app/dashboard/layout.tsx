"use client";
import AddLocationForm from "@/components/addLocation/AddLocationForm";
import AddSkill from "@/components/addSkill/AddSkillForm";
import AddTitleForm from "@/components/addTitle/AddTitleForm";
import AllCandidates from "@/components/allCandidates/AllCandidates";
import ConfirmLoginDialog from "@/components/ConfirmLogin";
import CreateCompanyForm from "@/components/createCompany/CreateCompanyForm";
import CreateJobForm from "@/components/createJob/CreateJobForm";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import EditSkills from "@/components/me/EditSkills";
import UpdateJobForm from "@/components/updateJob/UpdateJobForm";
import ViewApplicants from "@/components/viewApplicants/ViewApplicants";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { setLoginRequiredDialogBox } from "@/features/loginRequiredDialogBox/loginRequiredDialogBoxSlice";
import { RootState } from "@/lib/store.config";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const isSidebarOpen = useSelector((state: RootState) => {
    return state.isSidebarOpen.value;
  });

  const showJobApplicants = useSelector((state: RootState) => {
    return state.showJobApplicants.value;
  });

  const jobId = useSelector((state: RootState) => {
    return state.jobId.value;
  });

  const showJobCreateForm = useSelector(
    (state: RootState) => state.showJobCreateForm.value
  );

  const showCreateCompanyForm = useSelector((state: RootState) => {
    return state.showCreateCompanyForm.value;
  });

  const showEditSkills = useSelector(
    (state: RootState) => state.showEditSkills
  );

  const showJobUpdateForm = useSelector(
    (state: RootState) => state.showJobUpdateForm.value
  );

  const showAddLocation = useSelector((state: RootState) => {
    return state.showAddLocationForm.value;
  });

  const showAddSkillsForm = useSelector((state: RootState) => {
    return state.showAddSkillsForm.value;
  });

  const showAddTitleForm = useSelector((state: RootState) => {
    return state.showAddTitleForm.value;
  });

  const showAllCandidates = useSelector((state: RootState) => {
    return state.showAllCandidates.value;
  });

  // const jwtToken = useSelector((state: RootState) => {
  //   return state.authJwtToken.value;
  // });

  const loginRequiredDialogBox = useSelector(
    (state: RootState) => state.setLoginRequiredDialogBox.value
  );

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) {
      dispatch(setAuthJwtToken(token));
    }
  }, [dispatch]);
  // const { isError, isPending } = useGetUser(jwtToken);

  // useEffect(() => {
  //   if (isError) {
  //     router.replace("/login");
  //   }
  // }, [isError, router]);

  // if(isPending || isError ){
  //   return (
  //     <TripleDotLoader />
  //   )
  // }

  return (
    // {h-[100vh]}
    <div className="dashboard-layout text-black  h-[100%] w-[100%] bg-[#F5F5F5]">
      <ToastContainer position="top-right" autoClose={3000} className="z-20" />
      <ConfirmLoginDialog
        isOpen={loginRequiredDialogBox}
        onClose={() => {
          dispatch(setLoginRequiredDialogBox(false));
        }}
        onLogin={() => {
          router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
          dispatch(setLoginRequiredDialogBox(false));
        }}
        onSignup={() => {
          router.push(`/signup?returnUrl=${encodeURIComponent(pathname)}`);
          dispatch(setLoginRequiredDialogBox(false));
        }}
      />
      {showAddLocation && (
        <div className="shadow-gray-500 border border-gray-700 dashboard-layout hidden sm:block sm:absolute top-[10%] right-[10%] rounded-lg shadow-lg px-10 hide-scrollbar justify-center z-20 h-[calc(100vh-20%)] w-full sm:w-[79%] bg-[#F5F5F5] overflow-y-auto">
          <div className="dashboard-layout w-full min-h-full">
            <AddLocationForm />
          </div>
        </div>
      )}

      {showAddTitleForm && (
        <div className="shadow-gray-500 border border-gray-700 dashboard-layout hidden sm:block sm:absolute top-[10%] right-[10%] rounded-lg shadow-lg px-10 hide-scrollbar justify-center z-20 h-[calc(100vh-20%)] w-full sm:w-[79%] bg-[#F5F5F5] overflow-y-auto">
          <div className="dashboard-layout w-full min-h-full">
            <AddTitleForm />
          </div>
        </div>
      )}
      {showCreateCompanyForm && (
        <div className="shadow-gray-500 border border-gray-700 dashboard-layout hidden sm:block sm:absolute top-[10%] right-[10%] rounded-lg shadow-lg px-10 hide-scrollbar justify-center z-20 h-[calc(100vh-20%)] w-full sm:w-[79%] bg-[#F5F5F5] overflow-y-auto">
          <div className="dashboard-layout w-full min-h-full">
            <CreateCompanyForm />
          </div>
        </div>
      )}

      {showAddSkillsForm && (
        <div className="shadow-gray-500 border border-gray-700 dashboard-layout hidden sm:block sm:absolute top-[10%] right-[10%] rounded-lg shadow-lg px-10 hide-scrollbar justify-center z-20 h-[calc(100vh-20%)] w-full sm:w-[79%] bg-[#F5F5F5] overflow-y-auto">
          <div className="dashboard-layout w-full min-h-full">
            <AddSkill />
          </div>
        </div>
      )}

      {showEditSkills.value && (
        <div className="shadow-gray-500 border border-gray-700 dashboard-layout hidden sm:block sm:absolute top-[10%] right-[10%] rounded-lg shadow-lg px-10 hide-scrollbar justify-center z-20 h-[calc(100vh-20%)] w-full sm:w-[79%] bg-[#F5F5F5] overflow-y-auto">
          <div className="dashboard-layout w-full min-h-full">
            <EditSkills
              fieldName={showEditSkills.fieldName!}
              setValue={showEditSkills.setValue}
              error={showEditSkills.error}
              jwtToken={showEditSkills.jwtToken}
              fieldValue={showEditSkills.fieldValue}
            />
          </div>
        </div>
      )}

      {showAllCandidates && (
        <div className="shadow-gray-500 border border-gray-700 dashboard-layout hidden sm:block sm:absolute top-[10%] right-[10%] rounded-lg shadow-lg px-10 hide-scrollbar justify-center z-20 h-[calc(100vh-20%)] w-full sm:w-[79%] bg-[#F5F5F5] overflow-y-auto">
          <div className="dashboard-layout w-full h-full">
            <AllCandidates />
          </div>
        </div>
      )}

      {showJobApplicants && (
        <div className="shadow-gray-500 border border-gray-700 dashboard-layout hidden sm:block sm:absolute top-[10%] right-[10%] rounded-lg shadow-lg px-10 hide-scrollbar justify-center z-20 h-[calc(100vh-20%)] w-full sm:w-[79%] bg-[#F5F5F5] overflow-y-auto">
          <div className="dashboard-layout w-full h-full">
            <ViewApplicants jobId={Number(jobId)} />
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
            <UpdateJobForm
              id={Number(jobId)}
              className="dashboard-layout h-screen w-full"
            />
          </div>
        </div>
      )}
      <div
        className={`dashboard-layout absolute w-[100%] h-[100%] sm:hidden  border top-0 left-0 bg-black opacity-35 z-10 ${
          isSidebarOpen ? (showJobCreateForm ? "hidden" : "block") : "hidden"
        }`}
      ></div>
      <div className={"dashboard-layout flex h-full w-full gap-x-2"}>
        <div
          className={`dashboard-layout hidden sm:block basis-1/5 overflow-y-scroll hide-scrollbar px-3`}
        >
          <DashboardSidebar />
        </div>
        <div
          className={`dashboard-layout absolute rounded-r-lg bg-[#F5F5F5] h-full w-[75%] sm:hidden overflow-y-scroll px-5 z-50 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <DashboardSidebar />
        </div>
        <div className="dashboard-layout w-full h-full sm:basis-4/5 rounded-lg overflow-hidden">
          {showEditSkills.value && (
            <div className="dashboard-layout absolute sm:hidden px-5 hide-scrollbar flex justify-center z-40 h-screen w-full sm:w-[79%] bg-white overflow-y-auto">
              <div className="dashboard-layout w-full min-h-full">
                <EditSkills
                  fieldName={showEditSkills.fieldName!}
                  setValue={showEditSkills.setValue}
                  error={showEditSkills.error}
                  jwtToken={showEditSkills.jwtToken}
                  fieldValue={showEditSkills.fieldValue}
                />
              </div>
            </div>
          )}

          {showCreateCompanyForm && (
            <div className="dashboard-layout absolute sm:hidden px-5 hide-scrollbar flex justify-center z-40 h-screen w-full sm:w-[79%] bg-white overflow-y-auto">
              <div className="dashboard-layout w-full min-h-full">
                <CreateCompanyForm />
              </div>
            </div>
          )}

          {showAddTitleForm && (
            <div className="dashboard-layout absolute sm:hidden px-5 hide-scrollbar flex justify-center z-40 h-screen w-full sm:w-[79%] bg-white overflow-y-auto">
              <div className="dashboard-layout w-full min-h-full">
                <AddTitleForm />
              </div>
            </div>
          )}

          {showAllCandidates && (
            <div className="dashboard-layout absolute sm:hidden px-5 hide-scrollbar flex justify-center z-40 h-screen w-full sm:w-[79%] bg-white overflow-y-auto">
              <div className="dashboard-layout w-full min-h-full">
                <AllCandidates />
              </div>
            </div>
          )}

          {showJobApplicants && (
            <div className="dashboard-layout absolute sm:hidden px-5 hide-scrollbar flex justify-center z-40 h-screen w-full sm:w-[79%] bg-white overflow-y-auto">
              <div className="dashboard-layout w-full min-h-full">
                <ViewApplicants jobId={Number(jobId)} />
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
                <UpdateJobForm
                  id={Number(jobId)}
                  className="dashboard-layout h-screen w-full"
                />
              </div>
            </div>
          )}
          
          {children}
        </div>
      </div>
    </div>
  );
}
