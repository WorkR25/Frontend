"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Briefcase,
  Building2,
  ChartPie,
  ChevronDown,
  Folder,
  Globe,
  LocateFixed,
  PersonStanding,
  Search,
  SignpostBig,
  ToolCase,
} from "lucide-react";
import UserProfileSidebar from "../UserProfileSidebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store.config";
import { mainMenuCollapsedToogle } from "@/features/mainMenuCollapsed/mainMenuCollapsed";
import { otherMenuCollapsedToogle } from "@/features/otherMenuCollapsed/otherMenuCollapsedSlice";
import { isSidebarOpenToogle } from "@/features/isSidebarOpen/isSidebarOpenSlice";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import useGetUser from "@/utils/useGetUser";
import useGetUserRoles from "@/utils/useGetUserRoles";
import {
  onClickAddCity,
  onClickAddSKill,
  onClickAddTitle,
  onClickAllCandidates,
  onClickAllJobs,
  onClickCreateCompany,
  onClickCreateJob,
  onClickExploreJob,
  onClickOverview,
} from "./dashboard.utils";
// import { toogleShowJobCreateForm } from "@/features/showJobCreateForm/showJobCreateForm";
const mainMenuTabId: { [key: string]: number } = {
  jobs: 1,
  "all-jobs": 2,
};

export default function DashboardSidebar() {
  const router = useRouter();
  const jwtToken = useSelector((state: RootState) => state.authJwtToken.value);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  

  const [mainMenuActiveTab, setMainMenuActiveTab] = useState<number | null>(
    mainMenuTabId[pathname.split("/")[2]] ?? 0
  );
  const [role, setRole] = useState("user");
  const [otherMenuActiveTab, setOtherMenuActiveTab] = useState<number | null>(
    null
  );

  const mainMenuCollapsed = useSelector(
    (state: RootState) => state.mainMenuCollapsed.value
  );
  const otherMenuCollapsed = useSelector(
    (state: RootState) => state.otherMenuCollapsed.value
  );
  const showJobCreateForm = useSelector(
    (state: RootState) => state.showJobCreateForm.value
  );

  const { data: userData, isSuccess } = useGetUser(jwtToken);
  const { data: userRoles } = useGetUserRoles(jwtToken, userData?.id);

  useEffect(() => {
    if (userRoles?.includes("admin")) {
      setRole("admin");
    }
  }, [userRoles, pathname]);

  useEffect(() => {
    const jwtToken = localStorage.getItem("AuthJwtToken");
    if (jwtToken) {
      dispatch(setAuthJwtToken(jwtToken));
    }
  }, [dispatch]);

  useEffect(() => {
    const routeName = pathname.split("/")[2];

    if (routeName) {
      setMainMenuActiveTab(mainMenuTabId[routeName]);
    } else {
      setMainMenuActiveTab(0);
    }
  }, [pathname, showJobCreateForm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        dispatch(isSidebarOpenToogle(false));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  const mainMenuTabs = [
    {
      name: "Overview",
      icon: <ChartPie className="w-5 h-5 mr-2" />,
      link: "/",
      auth: ["admin", "user"],
      onClickFn: onClickOverview,
    },
    {
      name: "Explore Jobs",
      icon: <Globe className="w-5 h-5 mr-2" />,
      link: "/jobs",
      auth: ["admin", "user"],
      onClickFn: onClickExploreJob,
    },
    {
      name: "All jobs",
      icon: <Folder className="w-5 h-5 mr-2" />,
      link: "/all-jobs",
      auth: ["admin"],
      onClickFn: onClickAllJobs,
    },
  ];

  const creationTabs = [
    {
      name: "Create Job",
      icon: <Briefcase className="w-5 h-5 mr-2" />,
      link: null,
      auth: ["admin"],
      onClickFn: onClickCreateJob,
    },
    {
      name: "Create Company",
      icon: <Building2 className="w-5 h-5 mr-2" />,
      link: null,
      auth: ["admin"],
      onClickFn: onClickCreateCompany,
    },
    {
      name: "Add Skill",
      icon: <ToolCase className="w-5 h-5 mr-2" />,
      link: null,
      auth: ["admin"],
      onClickFn: onClickAddSKill,
    },
    {
      name: "Add Location",
      icon: <LocateFixed className="w-5 h-5 mr-2" />,
      link: null,
      auth: ["admin"],
      onClickFn: onClickAddCity,
    },
    {
      name: "Add Title",
      icon: <SignpostBig className="w-5 h-5 mr-2" />,
      link: null,
      auth: ["admin"],
      onClickFn: onClickAddTitle,
    },
    {
      name: "All Candidates",
      icon: <PersonStanding className="w-5 h-5" />,
      link: null,
      auth: ["admin"],
      onClickFn: onClickAllCandidates,
    },
  ];

  const otherMenuTabs = [
    { name: "Blog and article", icon: "", link: "/blog" },
    { name: "Help Center", icon: "", link: "/help-center" },
  ];

  return (
    <div className="flex flex-col h-full hide-scrollbar " ref={sidebarRef}>
      {/* logo and quich search */}
      <div className="h-fit w-full ">
        <div className="flex items-center justify-between py-4  ">
          <div>
            <Image
              src="/WorkR-Full-Logo2.png"
              alt="photo"
              width={80}
              height={80}
              objectFit="cover"
              priority
            />
          </div>
          <div
            className="hover:cursor-pointer"
            onClick={() => {
              dispatch(isSidebarOpenToogle(false));
            }}
          >
            <Image
              src="/Close Sidebar Icon.svg"
              alt="photo"
              width={15}
              height={15}
              objectFit="cover"
              priority
            />
          </div>
        </div>
        <div className="">
          <div className="flex items-center w-full max-w-xs p-2 mt-2 border border-gray-300 rounded-md bg-white shadow-sm">
            <Search className="w-5 h-5 text-gray-400" />
            <div className="relative w-fit">
              <p className="text-[10px] text-red-500 absolute right-0 -top-1">
                Coming Soon
              </p>
              <input
                disabled
                type="text"
                placeholder="Quick search..."
                className="ml-2 w-full outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* menus */}
      <div className="flex-1 space-y-2 overflow-y-scroll hide-scrollbar">
        
        {/* main menu */}
        <aside className="w-full py-4 text-gray-800 space-y-2">
          <div className="text-xs text-gray-500 tracking-wide uppercase flex items-center justify-between z-20 bg-[#F5F5F5]">
            Main
            <ChevronDown
              className={`hover:cursor-pointer duration-300 ${
                mainMenuCollapsed ? "transform rotate-180" : ""
              }`}
              onClick={() => {
                dispatch(mainMenuCollapsedToogle());
              }}
            />
          </div>
          <div
            className={`transition-all duration-500 ease-in-out -z-10 ${
              mainMenuCollapsed ? "hidden" : ""
            }`}
          >
            <div className="flex flex-col">
              {mainMenuTabs.map((tab, index) =>
                tab.auth?.includes(role) ? (
                  <button
                    key={index}
                    onClick={() => {
                      setMainMenuActiveTab(index);
                      dispatch(isSidebarOpenToogle(false));
                      tab.onClickFn(dispatch, router, tab.link, isSuccess);
                    }}
                    className={`text-sm sm:text-lg py-1.5 px-4 flex items-center gap-4 -mb-px font-medium transition-all duration-300  rounded-md hover:cursor-pointer ${
                      mainMenuActiveTab === index
                        ? "border-blue-500 text-[#D8FFFF] bg-[#0470B8]"
                        : "border-transparent text-gray-500 hover:text-blue-500"
                    }`}
                  >
                    {tab.icon}
                    {tab.name}
                  </button>
                ) : (
                  <div key={index}></div>
                )
              )}
            </div>
          </div>
        </aside>

        {/* creation menu */}
        <div
          className={`mb-[40%] ${userRoles?.includes("admin") ? "" : "hidden"}`}
        >
          <div className="text-xs text-gray-500 tracking-wide uppercase flex items-center justify-between z-20 bg-[#F5F5F5]">
            Creation
            <ChevronDown
              className={`hover:cursor-pointer duration-300 ${
                otherMenuCollapsed ? "transform rotate-180" : ""
              }`}
              onClick={() => {
                dispatch(otherMenuCollapsedToogle());
              }}
            />
          </div>
          <div
            className={`transition-all duration-500 ease-in-out -z-10 ${
              otherMenuCollapsed ? "hidden" : ""
            }`}
          >
            <div className="flex flex-col">
              {creationTabs.map((tab, index) =>
                tab.auth?.includes(role) ? (
                  <button
                    key={index}
                    onClick={() => {
                      // setOtherMenuActiveTab(index);
                      tab.onClickFn(dispatch, router, tab.link, isSuccess);
                    }}
                    className={`text-sm sm:text-lg py-1.5 px-4 flex items-center gap-4 -mb-px font-medium transition-all duration-300 border-2 rounded-md hover:cursor-pointer border-transparent text-gray-500 hover:text-blue-500`}
                  >
                    {tab.icon}
                    {tab.name}
                  </button>
                ) : (
                  <div key={index}></div>
                )
              )}
            </div>
          </div>
        </div>

        {/* other menu */}
        <div className="mb-[40%]">
          <div className="text-xs text-gray-500 tracking-wide uppercase flex items-center justify-between z-20 bg-[#F5F5F5]">
            Others
            <ChevronDown
              className={`hover:cursor-pointer duration-300 ${
                otherMenuCollapsed ? "transform rotate-180" : ""
              }`}
              onClick={() => {
                dispatch(otherMenuCollapsedToogle());
              }}
            />
          </div>
          <div
            className={`transition-all duration-500 ease-in-out -z-10 ${
              otherMenuCollapsed ? "hidden" : ""
            }`}
          >
            <div className="flex flex-col">
              {otherMenuTabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setOtherMenuActiveTab(index);
                    router.push(`${pathname}${tab.link}`);
                  }}
                  className={`text-sm sm:text-lg py-1.5 px-4 flex items-center gap-4 -mb-px font-medium transition-all duration-300 border-2 rounded-md pointer-events-none ${
                    otherMenuActiveTab === index
                      ? "border-blue-500 text-[#D8FFFF] bg-[#0470B8]"
                      : "border-transparent text-gray-500 hover:text-blue-500"
                  }`}
                >
                  {tab.icon}
                  <div className="relative">
                    <p>{tab.name}</p>
                    <p className="text-[0.61rem] text-red-500 absolute -right-[4.2rem] top-0">
                      Coming Soon
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* profile button */}
      <div className="h-fit w-full pb-5">
        <UserProfileSidebar />
      </div>
    </div>
  );

  // return (
  //   <div className="hide-scrollbar ">
  //     <div className="flex items-center justify-between py-4  ">
  //       <div>
  //         <Image
  //           src="/WorkR-Full-Logo2.png"
  //           alt="photo"
  //           width={80}
  //           height={80}
  //           objectFit="cover"
  //           priority
  //         />
  //       </div>
  //       <div
  //         className="hover:cursor-pointer"
  //         onClick={() => {
  //           dispatch(isSidebarOpenToogle(false));
  //         }}
  //       >
  //         <Image
  //           src="/Close Sidebar Icon.svg"
  //           alt="photo"
  //           width={15}
  //           height={15}
  //           objectFit="cover"
  //           priority
  //         />
  //       </div>
  //     </div>

  //     <div className="">
  //       <div className="flex items-center w-full max-w-xs p-2 mt-2 border border-gray-300 rounded-md bg-white shadow-sm">
  //         <Search className="w-5 h-5 text-gray-400" />
  //         <div className="relative w-fit">
  //           <p className="text-[10px] text-red-500 absolute right-0 -top-1">
  //             Coming Soon
  //           </p>
  //           <input
  //             disabled
  //             type="text"
  //             placeholder="Quick search..."
  //             className="ml-2 w-full outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
  //           />
  //         </div>
  //       </div>
  //     </div>

  //     <aside className="w-full py-4 text-gray-800 space-y-2">
  //       <div className="text-xs text-gray-500 tracking-wide uppercase flex items-center justify-between z-20 bg-[#F5F5F5]">
  //         Main
  //         <ChevronDown
  //           className={`hover:cursor-pointer duration-300 ${
  //             mainMenuCollapsed ? "transform rotate-180" : ""
  //           }`}
  //           onClick={() => {
  //             dispatch(mainMenuCollapsedToogle());
  //           }}
  //         />
  //       </div>
  //       <div
  //         className={`transition-all duration-500 ease-in-out -z-10 ${
  //           mainMenuCollapsed ? "hidden" : ""
  //         }`}
  //       >
  //         <div className="flex flex-col">
  //           {mainMenuTabs.map((tab, index) =>
  //             tab.auth?.includes(role) ? (
  //               <button
  //                 key={index}
  //                 onClick={() => {
  //                   setMainMenuActiveTab(index);
  //                   dispatch(isSidebarOpenToogle(false));
  //                   tab.onClickFn(dispatch, router, tab.link, isSuccess);
  //                 }}
  //                 className={`text-sm sm:text-lg py-1.5 px-4 flex items-center gap-4 -mb-px font-medium transition-all duration-300  rounded-md hover:cursor-pointer ${
  //                   mainMenuActiveTab === index
  //                     ? "border-blue-500 text-[#D8FFFF] bg-[#0470B8]"
  //                     : "border-transparent text-gray-500 hover:text-blue-500"
  //                 }`}
  //               >
  //                 {tab.icon}
  //                 {tab.name}
  //               </button>
  //             ) : (
  //               <div key={index}></div>
  //             )
  //           )}
  //         </div>
  //       </div>
  //     </aside>

  //     <div
  //       className={`mb-[40%] ${userRoles?.includes("admin") ? "" : "hidden"}`}
  //     >
  //       <div className="text-xs text-gray-500 tracking-wide uppercase flex items-center justify-between z-20 bg-[#F5F5F5]">
  //         Creation
  //         <ChevronDown
  //           className={`hover:cursor-pointer duration-300 ${
  //             otherMenuCollapsed ? "transform rotate-180" : ""
  //           }`}
  //           onClick={() => {
  //             dispatch(otherMenuCollapsedToogle());
  //           }}
  //         />
  //       </div>
  //       <div
  //         className={`transition-all duration-500 ease-in-out -z-10 ${
  //           otherMenuCollapsed ? "hidden" : ""
  //         }`}
  //       >
  //         <div className="flex flex-col">
  //           {creationTabs.map((tab, index) =>
  //             tab.auth?.includes(role) ? (
  //               <button
  //                 key={index}
  //                 onClick={() => {
  //                   // setOtherMenuActiveTab(index);
  //                   tab.onClickFn(dispatch, router, tab.link, isSuccess);
  //                 }}
  //                 className={`text-sm sm:text-lg py-1.5 px-4 flex items-center gap-4 -mb-px font-medium transition-all duration-300 border-2 rounded-md hover:cursor-pointer border-transparent text-gray-500 hover:text-blue-500`}
  //               >
  //                 {tab.icon}
  //                 {tab.name}
  //               </button>
  //             ) : (
  //               <div key={index}></div>
  //             )
  //           )}
  //         </div>
  //       </div>
  //     </div>

  //     <div className="mb-[40%]">
  //       <div className="text-xs text-gray-500 tracking-wide uppercase flex items-center justify-between z-20 bg-[#F5F5F5]">
  //         Others
  //         <ChevronDown
  //           className={`hover:cursor-pointer duration-300 ${
  //             otherMenuCollapsed ? "transform rotate-180" : ""
  //           }`}
  //           onClick={() => {
  //             dispatch(otherMenuCollapsedToogle());
  //           }}
  //         />
  //       </div>
  //       <div
  //         className={`transition-all duration-500 ease-in-out -z-10 ${
  //           otherMenuCollapsed ? "hidden" : ""
  //         }`}
  //       >
  //         <div className="flex flex-col">
  //           {otherMenuTabs.map((tab, index) => (
  //             <button
  //               key={index}
  //               onClick={() => {
  //                 setOtherMenuActiveTab(index);
  //                 router.push(`${pathname}${tab.link}`);
  //               }}
  //               className={`text-sm sm:text-lg py-1.5 px-4 flex items-center gap-4 -mb-px font-medium transition-all duration-300 border-2 rounded-md pointer-events-none ${
  //                 otherMenuActiveTab === index
  //                   ? "border-blue-500 text-[#D8FFFF] bg-[#0470B8]"
  //                   : "border-transparent text-gray-500 hover:text-blue-500"
  //               }`}
  //             >
  //               {tab.icon}
  //               <div className="relative">
  //                 <p>{tab.name}</p>
  //                 <p className="text-[0.61rem] text-red-500 absolute -right-[4.2rem] top-0">
  //                   Coming Soon
  //                 </p>
  //               </div>
  //             </button>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //     <UserProfileSidebar />
  //   </div>
  // );
}
