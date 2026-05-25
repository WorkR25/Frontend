"use client";
import AddLocationForm from "@/components/addLocation/AddLocationForm";
import AddRoles from "@/components/addRoles/AddRolesForm";
import AddSkill from "@/components/addSkill/AddSkillForm";
import AddTitleForm from "@/components/addTitle/AddTitleForm";
import AllCandidates from "@/components/allCandidates/AllCandidates";
import ConfirmLoginDialog from "@/components/ConfirmLogin";
import CreateCompanyForm from "@/components/createCompany/CreateCompanyForm";
import CreateJobForm from "@/components/createJob/CreateJobForm";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import EditSkills from "@/components/me/EditSkills";
import SearchCandidatesByEmail from "@/components/searchCandidates/SearchCandidatesByEmail";
import SearchCandidatesByName from "@/components/searchCandidates/SearchCandidatesByName";
// import NameSearchWithParams from "@/components/searchCandidates/SearchCandidatesByName";
// import SearchCandidatesCard from "@/components/searchCandidates/SearchCandidatesCard";
import UpdateJobForm from "@/components/updateJob/UpdateJobForm";
import ViewApplicants from "@/components/viewApplicants/ViewApplicants";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { setLoginRequiredDialogBox } from "@/features/loginRequiredDialogBox/loginRequiredDialogBoxSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const isSidebarOpen = useAppSelector((state) => state.isSidebarOpen.value);

  const showJobApplicants = useAppSelector((state) => {
    return state.showJobApplicants.value;
  });

  const jobId = useAppSelector((state) => {
    return state.jobId.value;
  });

  const showJobCreateForm = useAppSelector(
    (state) => state.showJobCreateForm.value,
  );

  const showCreateCompanyForm = useAppSelector((state) => {
    return state.showCreateCompanyForm.value;
  });

  const showEditSkills = useAppSelector((state) => state.showEditSkills);

  const showJobUpdateForm = useAppSelector(
    (state) => state.showJobUpdateForm.value,
  );

  const showAddLocation = useAppSelector((state) => {
    return state.showAddLocationForm.value;
  });

  const showAddSkillsForm = useAppSelector((state) => {
    return state.showAddSkillsForm.value;
  });

  const showAddTitleForm = useAppSelector((state) => {
    return state.showAddTitleForm.value;
  });

  const showAllCandidates = useAppSelector((state) => {
    return state.showAllCandidates.value;
  });

  const showSearchCandidates = useAppSelector((state) => {
    return state.showSearchCandidates.value;
  });

  const showSearchCandidatesByName = useAppSelector((state) => {
    return state.showSearchCandidatesByName.value;
  });

  const showSearchCandidatesByEmail = useAppSelector((state) => {
    return state.showSearchCandidatesByEmail.value;
  });

  const loginRequiredDialogBox = useAppSelector(
    (state) => state.setLoginRequiredDialogBox.value,
  );

  const showAddRolesForm = useAppSelector(
    (state) => state.showAddRolesForm.value,
  );

  const panels = [
    {
      show: showAddLocation,
      element: <AddLocationForm />,
    },
    {
      show: showAddTitleForm,
      element: <AddTitleForm />,
    },
    // {
    //   show: showCreateCompanyForm,
    //   element: <CreateCompanyForm />,
    // },
    {
      show: showAddSkillsForm,
      element: <AddSkill />,
    },
    {
      show: showEditSkills.value,
      element: (
        <EditSkills
          fieldName={showEditSkills.fieldName!}
          setValue={showEditSkills.setValue}
          error={showEditSkills.error}
          jwtToken={showEditSkills.jwtToken}
          fieldValue={showEditSkills.fieldValue}
        />
      ),
    },
    {
      show: showAllCandidates,
      element: <AllCandidates />,
    },
    {
      show: showSearchCandidates,
      element: <SearchCandidatesByName />,
    },
    {
      show: showJobApplicants,
      element: <ViewApplicants jobId={Number(jobId)} />,
    },
    // {
    //   show: showJobCreateForm,
    //   element: <CreateJobForm className="dashboard-layout h-screen w-full" />,
    // },
    {
      show: showJobUpdateForm,
      element: (
        <UpdateJobForm
          id={Number(jobId)}
          className="dashboard-layout h-screen w-full"
        />
      ),
    },
    {
      show: showSearchCandidatesByName,
      element: <SearchCandidatesByName />,
    },
    {
      show: showSearchCandidatesByEmail,
      element: <SearchCandidatesByEmail />,
    },
    {
      show: showAddRolesForm,
      element: <AddRoles />,
    },
  ];

  const dispatch = useAppDispatch();
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
      {/* {showAddLocation && (
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

      {showSearchCandidates && (
        <div className="shadow-gray-500 border border-gray-700 dashboard-layout hidden sm:block sm:absolute top-[10%] right-[10%] rounded-lg shadow-lg px-10 hide-scrollbar justify-center z-20 h-[calc(100vh-20%)] w-full sm:w-[79%] bg-[#F5F5F5] overflow-y-auto">
          <div className="dashboard-layout w-full h-full">
            <SearchCandidatesCard />
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
      )} */}

      {panels.map(
        (panel, index) =>
          panel.show && <Wrapper key={index}>{panel.element}</Wrapper>,
      )}

      {showJobCreateForm && <CreateJobForm />}
      {showCreateCompanyForm && <CreateCompanyForm />}

      {/* <div
        className={`dashboard-layout absolute w-[100%] h-[100%] sm:hidden  border top-0 left-0 bg-black opacity-35 z-10 ${
          isSidebarOpen ? (showJobCreateForm ? "hidden" : "block") : "hidden"
        }`}
      ></div> */}
      <div
        className={"dashboard-layout bg-[#f1f2f4] flex h-full w-full gap-x-2"}
      >
        <div
          className={`dashboard-layout hidden sm:block basis-1/5 bg-[#f1f2f4] overflow-y-scroll hide-scrollbar px-3`}
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
          {/* {showEditSkills.value && (
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
          )} */}

          {panels.map(
            (panel, index) =>
              panel.show && (
                <WrapperMobile key={index}>{panel.element}</WrapperMobile>
              ),
          )}

          {children}
        </div>
      </div>
    </div>
  );
}

// const Wrapper = ({ children }: { children: React.ReactNode }) => (
//   <div className="shadow-gray-500 border border-gray-700 dashboard-layout hidden sm:block sm:absolute top-[10%] right-[10%] rounded-lg shadow-lg px-10 hide-scrollbar justify-center z-20 h-[calc(100vh-20%)] w-full sm:w-[79%] bg-[#F5F5F5] overflow-y-auto">
//     <div className="dashboard-layout w-full min-h-full">{children}</div>
//   </div>
// );

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="hidden sm:block absolute backdrop-blur-md left-1/2 top-1/2 z-20 h-[90vh] w-[90%] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg shadow-gray-400 hide-scrollbar">
    <div className="dashboard-layout w-full h-full">{children}</div>
  </div>
);

const WrapperMobile = ({ children }: { children: React.ReactNode }) => (
  <div className="dashboard-layout absolute sm:hidden px-5 hide-scrollbar flex justify-center z-40 h-screen w-full bg-white overflow-y-auto">
    <div className="dashboard-layout w-full min-h-full">{children}</div>
  </div>
);
