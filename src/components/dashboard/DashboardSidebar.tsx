// "use client";

// import { JSX, useEffect, useRef, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import Image from "next/image";
// import { ChevronDown, Search } from "lucide-react";
// import UserProfileSidebar from "../UserProfileSidebar";
// import { mainMenuCollapsedToogle } from "@/features/mainMenuCollapsed/mainMenuCollapsed";
// import { otherMenuCollapsedToogle } from "@/features/otherMenuCollapsed/otherMenuCollapsedSlice";
// import { isSidebarOpenToogle } from "@/features/isSidebarOpen/isSidebarOpenSlice";
// import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
// import useGetUser from "@/utils/useGetUser";
// import useGetUserRoles from "@/utils/useGetUserRoles";

// import { dashboardSidebarTabs } from "./dashboard.utis";
// import { OnClickFnType } from "./dashboard.utils";
// import { useAppDispatch, useAppSelector } from "@/lib/hooks";
// // import { toogleShowJobCreateForm } from "@/features/showJobCreateForm/showJobCreateForm";
// const mainMenuTabId: { [key: string]: number } = {
//   jobs: 1,
//   "all-jobs": 2,
// };

// export default function DashboardSidebar() {
//   const router = useRouter();
//   const jwtToken = useAppSelector((state) => state.authJwtToken.value);
//   const dispatch = useAppDispatch();
//   const pathname = usePathname();
//   const sidebarRef = useRef<HTMLDivElement>(null);

//   const [mainMenuActiveTab, setMainMenuActiveTab] = useState<number | null>(
//     mainMenuTabId[pathname.split("/")[2]] ?? 0,
//   );
//   const [role, setRole] = useState("user");
//   const [otherMenuActiveTab, setOtherMenuActiveTab] = useState<number | null>(
//     null,
//   );

//   const mainMenuCollapsed = useAppSelector(
//     (state) => state.mainMenuCollapsed.value,
//   );
//   const otherMenuCollapsed = useAppSelector(
//     (state) => state.otherMenuCollapsed.value,
//   );
//   const showJobCreateForm = useAppSelector(
//     (state) => state.showJobCreateForm.value,
//   );

//   const { data: userData, isSuccess } = useGetUser(jwtToken);
//   const { data: userRoles } = useGetUserRoles(jwtToken, userData?.id);

//   const roleMap: { [key: string]: string } = {
//     admin: "admin",
//     recruiter: "recruiter",
//     jobseeker: "jobseeker",
//     operations_admin: "operations_admin",
//   };

//   useEffect(() => {
//     const tempRole = Object.keys(roleMap).find((r) => userRoles?.includes(r));

//     if (tempRole == undefined) {
//       setRole("jobseeker");
//       return;
//     }

//     setRole(roleMap[tempRole] || "jobseeker");
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [userRoles, pathname]);

//   useEffect(() => {
//     const jwtToken = localStorage.getItem("AuthJwtToken");
//     if (jwtToken) {
//       dispatch(setAuthJwtToken(jwtToken));
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     const routeName = pathname.split("/")[2];

//     if (routeName) {
//       setMainMenuActiveTab(mainMenuTabId[routeName]);
//     } else {
//       setMainMenuActiveTab(0);
//     }
//   }, [pathname, showJobCreateForm]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         sidebarRef.current &&
//         !sidebarRef.current.contains(event.target as Node)
//       ) {
//         dispatch(isSidebarOpenToogle(false));
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [dispatch]);

//   // const mainMenuTabs = [
//   //   {
//   //     name: "Overview",
//   //     icon: <ChartPie className="w-5 h-5 mr-2" />,
//   //     link: "/",
//   //     auth: ["admin", "user"],
//   //     onClickFn: onClickOverview,
//   //   },
//   //   {
//   //     name: "Explore Jobs",
//   //     icon: <Globe className="w-5 h-5 mr-2" />,
//   //     link: "/jobs",
//   //     auth: ["admin", "user"],
//   //     onClickFn: onClickExploreJob,
//   //   },
//   //   {
//   //     name: "All jobs",
//   //     icon: <Folder className="w-5 h-5 mr-2" />,
//   //     link: "/all-jobs",
//   //     auth: ["admin"],
//   //     onClickFn: onClickAllJobs,
//   //   },
//   // ];

//   const newMainMenuTabs: {
//     [key: string]: {
//       name: string;
//       icon: JSX.Element;
//       link: string | null;
//       onClickFn: OnClickFnType;
//     }[];
//   } = {
//     jobseeker: [
//       dashboardSidebarTabs.overviewTab,
//       dashboardSidebarTabs.exploreJobsTab,
//     ],
//     admin: [
//       dashboardSidebarTabs.overviewTab,
//       dashboardSidebarTabs.exploreJobsTab,
//       dashboardSidebarTabs.allJobsTab,
//     ],
//     operations_admin: [
//       dashboardSidebarTabs.overviewTab,
//       dashboardSidebarTabs.exploreJobsTab,
//       dashboardSidebarTabs.allJobsTab,
//     ],
//   };

//   const newCreationTabs: {
//     [key: string]: {
//       name: string;
//       icon: JSX.Element;
//       link: string | null;
//       onClickFn: OnClickFnType;
//     }[];
//   } = {
//     jobseeker: [],

//     admin: [
//       dashboardSidebarTabs.createJobTab,
//       dashboardSidebarTabs.createCompanyTab,
//       dashboardSidebarTabs.addSkillTab,
//       dashboardSidebarTabs.addLocationTab,
//       dashboardSidebarTabs.addTitleTab,
//       dashboardSidebarTabs.allCandidatesTab,
//       dashboardSidebarTabs.searchCandidatesByNameTab,
//       dashboardSidebarTabs.searchCandidatesByEmailTab,
//       dashboardSidebarTabs.createRolesTab,
//     ],

//     operations_admin: [
//       dashboardSidebarTabs.createJobTab,
//       dashboardSidebarTabs.createCompanyTab,
//       dashboardSidebarTabs.addSkillTab,
//       dashboardSidebarTabs.addLocationTab,
//       dashboardSidebarTabs.addTitleTab,
//     ],
//   };
//   // const creationTabs = [
//   //   {
//   //     name: "Create Job",
//   //     icon: <Briefcase className="w-5 h-5 mr-2" />,
//   //     link: null,
//   //     auth: ["user"],
//   //     onClickFn: onClickCreateJob,
//   //   },
//   //   {
//   //     name: "Create Company",
//   //     icon: <Building2 className="w-5 h-5 mr-2" />,
//   //     link: null,
//   //     auth: ["admin"],
//   //     onClickFn: onClickCreateCompany,
//   //   },
//   //   {
//   //     name: "Add Skill",
//   //     icon: <ToolCase className="w-5 h-5 mr-2" />,
//   //     link: null,
//   //     auth: ["admin"],
//   //     onClickFn: onClickAddSKill,
//   //   },
//   //   {
//   //     name: "Add Location",
//   //     icon: <LocateFixed className="w-5 h-5 mr-2" />,
//   //     link: null,
//   //     auth: ["admin"],
//   //     onClickFn: onClickAddCity,
//   //   },
//   //   {
//   //     name: "Add Title",
//   //     icon: <SignpostBig className="w-5 h-5 mr-2" />,
//   //     link: null,
//   //     auth: ["admin"],
//   //     onClickFn: onClickAddTitle,
//   //   },
//   //   {
//   //     name: "All Candidates",
//   //     icon: <PersonStanding className="w-5 h-5" />,
//   //     link: null,
//   //     auth: ["admin"],
//   //     onClickFn: onClickAllCandidates,
//   //   },
//   //   {
//   //     name: "Search by name",
//   //     icon: <PersonStanding className="w-5 h-5" />,
//   //     link: null,
//   //     auth: ["admin"],
//   //     onClickFn: onClickSearchCandidatesByName,
//   //   },
//   //   {
//   //     name: "Search by email",
//   //     icon: <PersonStanding className="w-5 h-5" />,
//   //     link: null,
//   //     auth: ["admin"],
//   //     onClickFn: onClickSearchCandidatesByEmail,
//   //   },
//   // ];

//   const otherMenuTabs = [
//     { name: "Blog and article", icon: "", link: "/blog" },
//     { name: "Help Center", icon: "", link: "/help-center" },
//   ];

//   return (
//     <div className="flex flex-col h-full hide-scrollbar " ref={sidebarRef}>
//       {/* logo and quich search */}
//       <div className="h-fit w-full ">
//         <div className="flex items-center justify-between py-4  ">
//           <div>
//             <Image
//               src="/WorkR-Full-Logo2.png"
//               alt="photo"
//               width={80}
//               height={80}
//               objectFit="cover"
//               priority
//             />
//           </div>
//           <div
//             className="hover:cursor-pointer"
//             onClick={() => {
//               dispatch(isSidebarOpenToogle(false));
//             }}
//           >
//             <Image
//               src="/Close Sidebar Icon.svg"
//               alt="photo"
//               width={15}
//               height={15}
//               objectFit="cover"
//               priority
//             />
//           </div>
//         </div>
//         <div className="">
//           <div className="flex items-center w-full max-w-xs p-2 mt-2 border border-gray-300 rounded-md bg-white shadow-sm">
//             <Search className="w-5 h-5 text-gray-400" />
//             <div className="relative w-fit">
//               <p className="text-[10px] text-red-500 absolute right-0 -top-1">
//                 Coming Soon
//               </p>
//               <input
//                 disabled
//                 type="text"
//                 placeholder="Quick search..."
//                 className="ml-2 w-full outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* menus */}
//       <div className="flex-1 space-y-2 overflow-y-scroll hide-scrollbar">
//         {/* main menu */}
//         <aside className="w-full py-4 text-gray-800 space-y-2">
//           <div className="text-xs text-gray-500 tracking-wide uppercase flex items-center justify-between z-20 bg-[#F5F5F5]">
//             Main
//             <ChevronDown
//               className={`hover:cursor-pointer duration-300 ${
//                 mainMenuCollapsed ? "transform rotate-180" : ""
//               }`}
//               onClick={() => {
//                 dispatch(mainMenuCollapsedToogle());
//               }}
//             />
//           </div>
//           <div
//             className={`transition-all duration-500 ease-in-out -z-10 ${
//               mainMenuCollapsed ? "hidden" : ""
//             }`}
//           >
//             <div className="flex flex-col">
//               {newMainMenuTabs[role]?.map((tab, index) => (
//                 <button
//                   key={index}
//                   onClick={() => {
//                     setMainMenuActiveTab(index);
//                     dispatch(isSidebarOpenToogle(false));
//                     tab.onClickFn(dispatch, router, tab.link, isSuccess);
//                   }}
//                   className={`text-sm sm:text-lg py-2 sm:py-1.5 px-4 flex items-center gap-4 -mb-px font-medium transition-all duration-300  rounded-md hover:cursor-pointer ${
//                     mainMenuActiveTab === index
//                       ? "border-blue-500 text-[#D8FFFF] bg-[#0470B8]"
//                       : "border-transparent text-gray-500 hover:text-blue-500"
//                   }`}
//                 >
//                   {tab.icon}
//                   {tab.name}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </aside>

//         {/* creation menu */}
//         <div
//           className={`mb-[40%] ${newCreationTabs[role]?.length > 0 ? "" : "hidden"}`}
//         >
//           <div className="text-xs text-gray-500 tracking-wide uppercase flex items-center justify-between z-20 bg-[#F5F5F5]">
//             Creation
//             <ChevronDown
//               className={`hover:cursor-pointer duration-300 ${
//                 otherMenuCollapsed ? "transform rotate-180" : ""
//               }`}
//               onClick={() => {
//                 dispatch(otherMenuCollapsedToogle());
//               }}
//             />
//           </div>
//           <div
//             className={`transition-all duration-500 ease-in-out -z-10 ${
//               otherMenuCollapsed ? "hidden" : ""
//             }`}
//           >
//             <div className="flex flex-col">
//               {newCreationTabs[role]?.map((tab, index) => (
//                 <button
//                   key={index}
//                   onClick={() => {
//                     // setOtherMenuActiveTab(index);
//                     tab.onClickFn(dispatch, router, tab.link, isSuccess);
//                   }}
//                   className={`text-sm sm:text-lg py-2 sm:py-1.5 px-4 flex items-center gap-4 -mb-px font-medium transition-all duration-300 border-2 rounded-md hover:cursor-pointer border-transparent text-gray-500 hover:text-blue-500`}
//                 >
//                   {tab.icon}
//                   {tab.name}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* other menu */}
//         <div className="mb-[40%]">
//           <div className="text-xs text-gray-500 tracking-wide uppercase flex items-center justify-between z-20 bg-[#F5F5F5]">
//             Others
//             <ChevronDown
//               className={`hover:cursor-pointer duration-300 ${
//                 otherMenuCollapsed ? "transform rotate-180" : ""
//               }`}
//               onClick={() => {
//                 dispatch(otherMenuCollapsedToogle());
//               }}
//             />
//           </div>
//           <div
//             className={`transition-all duration-500 ease-in-out -z-10 ${
//               otherMenuCollapsed ? "hidden" : ""
//             }`}
//           >
//             <div className="flex flex-col">
//               {otherMenuTabs.map((tab, index) => (
//                 <button
//                   key={index}
//                   onClick={() => {
//                     setOtherMenuActiveTab(index);
//                     router.push(`${pathname}${tab.link}`);
//                   }}
//                   className={`text-sm sm:text-lg py-1.5 px-4 flex items-center gap-4 -mb-px font-medium transition-all duration-300 border-2 rounded-md pointer-events-none ${
//                     otherMenuActiveTab === index
//                       ? "border-blue-500 text-[#D8FFFF] bg-[#0470B8]"
//                       : "border-transparent text-gray-500 hover:text-blue-500"
//                   }`}
//                 >
//                   {tab.icon}
//                   <div className="relative">
//                     <p>{tab.name}</p>
//                     <p className="text-[0.61rem] text-red-500 absolute -right-[4.2rem] top-0">
//                       Coming Soon
//                     </p>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* profile button */}
//       <div className="h-fit w-full pb-5">
//         <UserProfileSidebar />
//       </div>
//     </div>
//   );

//   // return (
//   //   <div className="hide-scrollbar ">
//   //     <div className="flex items-center justify-between py-4  ">
//   //       <div>
//   //         <Image
//   //           src="/WorkR-Full-Logo2.png"
//   //           alt="photo"
//   //           width={80}
//   //           height={80}
//   //           objectFit="cover"
//   //           priority
//   //         />
//   //       </div>
//   //       <div
//   //         className="hover:cursor-pointer"
//   //         onClick={() => {
//   //           dispatch(isSidebarOpenToogle(false));
//   //         }}
//   //       >
//   //         <Image
//   //           src="/Close Sidebar Icon.svg"
//   //           alt="photo"
//   //           width={15}
//   //           height={15}
//   //           objectFit="cover"
//   //           priority
//   //         />
//   //       </div>
//   //     </div>

//   //     <div className="">
//   //       <div className="flex items-center w-full max-w-xs p-2 mt-2 border border-gray-300 rounded-md bg-white shadow-sm">
//   //         <Search className="w-5 h-5 text-gray-400" />
//   //         <div className="relative w-fit">
//   //           <p className="text-[10px] text-red-500 absolute right-0 -top-1">
//   //             Coming Soon
//   //           </p>
//   //           <input
//   //             disabled
//   //             type="text"
//   //             placeholder="Quick search..."
//   //             className="ml-2 w-full outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
//   //           />
//   //         </div>
//   //       </div>
//   //     </div>

//   //     <aside className="w-full py-4 text-gray-800 space-y-2">
//   //       <div className="text-xs text-gray-500 tracking-wide uppercase flex items-center justify-between z-20 bg-[#F5F5F5]">
//   //         Main
//   //         <ChevronDown
//   //           className={`hover:cursor-pointer duration-300 ${
//   //             mainMenuCollapsed ? "transform rotate-180" : ""
//   //           }`}
//   //           onClick={() => {
//   //             dispatch(mainMenuCollapsedToogle());
//   //           }}
//   //         />
//   //       </div>
//   //       <div
//   //         className={`transition-all duration-500 ease-in-out -z-10 ${
//   //           mainMenuCollapsed ? "hidden" : ""
//   //         }`}
//   //       >
//   //         <div className="flex flex-col">
//   //           {mainMenuTabs.map((tab, index) =>
//   //             tab.auth?.includes(role) ? (
//   //               <button
//   //                 key={index}
//   //                 onClick={() => {
//   //                   setMainMenuActiveTab(index);
//   //                   dispatch(isSidebarOpenToogle(false));
//   //                   tab.onClickFn(dispatch, router, tab.link, isSuccess);
//   //                 }}
//   //                 className={`text-sm sm:text-lg py-1.5 px-4 flex items-center gap-4 -mb-px font-medium transition-all duration-300  rounded-md hover:cursor-pointer ${
//   //                   mainMenuActiveTab === index
//   //                     ? "border-blue-500 text-[#D8FFFF] bg-[#0470B8]"
//   //                     : "border-transparent text-gray-500 hover:text-blue-500"
//   //                 }`}
//   //               >
//   //                 {tab.icon}
//   //                 {tab.name}
//   //               </button>
//   //             ) : (
//   //               <div key={index}></div>
//   //             )
//   //           )}
//   //         </div>
//   //       </div>
//   //     </aside>

//   //     <div
//   //       className={`mb-[40%] ${userRoles?.includes("admin") ? "" : "hidden"}`}
//   //     >
//   //       <div className="text-xs text-gray-500 tracking-wide uppercase flex items-center justify-between z-20 bg-[#F5F5F5]">
//   //         Creation
//   //         <ChevronDown
//   //           className={`hover:cursor-pointer duration-300 ${
//   //             otherMenuCollapsed ? "transform rotate-180" : ""
//   //           }`}
//   //           onClick={() => {
//   //             dispatch(otherMenuCollapsedToogle());
//   //           }}
//   //         />
//   //       </div>
//   //       <div
//   //         className={`transition-all duration-500 ease-in-out -z-10 ${
//   //           otherMenuCollapsed ? "hidden" : ""
//   //         }`}
//   //       >
//   //         <div className="flex flex-col">
//   //           {creationTabs.map((tab, index) =>
//   //             tab.auth?.includes(role) ? (
//   //               <button
//   //                 key={index}
//   //                 onClick={() => {
//   //                   // setOtherMenuActiveTab(index);
//   //                   tab.onClickFn(dispatch, router, tab.link, isSuccess);
//   //                 }}
//   //                 className={`text-sm sm:text-lg py-1.5 px-4 flex items-center gap-4 -mb-px font-medium transition-all duration-300 border-2 rounded-md hover:cursor-pointer border-transparent text-gray-500 hover:text-blue-500`}
//   //               >
//   //                 {tab.icon}
//   //                 {tab.name}
//   //               </button>
//   //             ) : (
//   //               <div key={index}></div>
//   //             )
//   //           )}
//   //         </div>
//   //       </div>
//   //     </div>

//   //     <div className="mb-[40%]">
//   //       <div className="text-xs text-gray-500 tracking-wide uppercase flex items-center justify-between z-20 bg-[#F5F5F5]">
//   //         Others
//   //         <ChevronDown
//   //           className={`hover:cursor-pointer duration-300 ${
//   //             otherMenuCollapsed ? "transform rotate-180" : ""
//   //           }`}
//   //           onClick={() => {
//   //             dispatch(otherMenuCollapsedToogle());
//   //           }}
//   //         />
//   //       </div>
//   //       <div
//   //         className={`transition-all duration-500 ease-in-out -z-10 ${
//   //           otherMenuCollapsed ? "hidden" : ""
//   //         }`}
//   //       >
//   //         <div className="flex flex-col">
//   //           {otherMenuTabs.map((tab, index) => (
//   //             <button
//   //               key={index}
//   //               onClick={() => {
//   //                 setOtherMenuActiveTab(index);
//   //                 router.push(`${pathname}${tab.link}`);
//   //               }}
//   //               className={`text-sm sm:text-lg py-1.5 px-4 flex items-center gap-4 -mb-px font-medium transition-all duration-300 border-2 rounded-md pointer-events-none ${
//   //                 otherMenuActiveTab === index
//   //                   ? "border-blue-500 text-[#D8FFFF] bg-[#0470B8]"
//   //                   : "border-transparent text-gray-500 hover:text-blue-500"
//   //               }`}
//   //             >
//   //               {tab.icon}
//   //               <div className="relative">
//   //                 <p>{tab.name}</p>
//   //                 <p className="text-[0.61rem] text-red-500 absolute -right-[4.2rem] top-0">
//   //                   Coming Soon
//   //                 </p>
//   //               </div>
//   //             </button>
//   //           ))}
//   //         </div>
//   //       </div>
//   //     </div>
//   //     <UserProfileSidebar />
//   //   </div>
//   // );
// }

"use client";

import { JSX, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDown, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import UserProfileSidebar from "../UserProfileSidebar";
import { mainMenuCollapsedToogle } from "@/features/mainMenuCollapsed/mainMenuCollapsed";
import { isSidebarOpenToogle } from "@/features/isSidebarOpen/isSidebarOpenSlice";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import useGetUser from "@/utils/useGetUser";
import useGetUserRoles from "@/utils/useGetUserRoles";
import { dashboardSidebarTabs } from "./dashboard.utis";
import { OnClickFnType } from "./dashboard.utils";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { toggleSidebarCollapsed } from "@/features/sidebarCollapsed/sidebarCollapsedSlice";
import { cn } from "@/utils/cn";

const mainMenuTabId: { [key: string]: number } = {
  jobs: 1,
  "all-jobs": 2,
};

type SidebarTab = {
  name: string;
  icon: JSX.Element;
  link: string | null;
  onClickFn: OnClickFnType;
};

export default function DashboardSidebar({
  variant = "desktop",
}: {
  /** "desktop" = docked sidebar that can collapse to a rail; "mobile" = slide-in drawer. */
  variant?: "desktop" | "mobile";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const jwtToken = useAppSelector((state) => state.authJwtToken.value);
  const mainMenuCollapsed = useAppSelector(
    (state) => state.mainMenuCollapsed.value,
  );
  const showJobCreateForm = useAppSelector(
    (state) => state.showJobCreateForm.value,
  );
  const railSetting = useAppSelector((state) => state.sidebarCollapsed.value);
  // Only the docked desktop sidebar collapses; the mobile drawer is always full width.
  const collapsed = variant === "desktop" && railSetting;

  const [role, setRole] = useState("jobseeker");
  const [mainMenuActiveTab, setMainMenuActiveTab] = useState<number | null>(
    mainMenuTabId[pathname.split("/")[2]] ?? 0,
  );
  const [otherMenuActiveTab, setOtherMenuActiveTab] = useState<number | null>(
    null,
  );

  const [creationMenuCollapsed, setCreationMenuCollapsed] = useState(false);
  const [othersMenuCollapsed, setOthersMenuCollapsed] = useState(false);

  const { data: userData, isSuccess } = useGetUser(jwtToken);
  const { data: userRoles } = useGetUserRoles(jwtToken, userData?.id);

  const roleMap: { [key: string]: string } = {
    admin: "admin",
    recruiter: "recruiter",
    jobseeker: "jobseeker",
    operations_admin: "operations_admin",
  };

  useEffect(() => {
    const tempRole = Object.keys(roleMap).find((r) => userRoles?.includes(r));
    if (!tempRole) {
      setRole("jobseeker");
      return;
    }
    setRole(roleMap[tempRole] || "jobseeker");
  }, [userRoles, pathname]);

  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) {
      dispatch(setAuthJwtToken(token));
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
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        dispatch(isSidebarOpenToogle(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  const newMainMenuTabs: Record<string, SidebarTab[]> = useMemo(
    () => ({
      jobseeker: [
        dashboardSidebarTabs.overviewTab,
        dashboardSidebarTabs.exploreJobsTab,
      ],
      admin: [
        dashboardSidebarTabs.overviewTab,
        dashboardSidebarTabs.exploreJobsTab,
        dashboardSidebarTabs.allJobsTab,
      ],
      operations_admin: [
        dashboardSidebarTabs.overviewTab,
        dashboardSidebarTabs.exploreJobsTab,
        dashboardSidebarTabs.allJobsTab,
      ],
    }),
    [],
  );

  const newCreationTabs: Record<string, SidebarTab[]> = useMemo(
    () => ({
      jobseeker: [],
      admin: [
        dashboardSidebarTabs.createJobTab,
        dashboardSidebarTabs.createCompanyTab,
        dashboardSidebarTabs.addSkillTab,
        dashboardSidebarTabs.addLocationTab,
        dashboardSidebarTabs.addTitleTab,
        dashboardSidebarTabs.allCandidatesTab,
        dashboardSidebarTabs.searchCandidatesTab,
        dashboardSidebarTabs.createRolesTab,
      ],
      operations_admin: [
        dashboardSidebarTabs.createJobTab,
        dashboardSidebarTabs.createCompanyTab,
        dashboardSidebarTabs.addSkillTab,
        dashboardSidebarTabs.addLocationTab,
        dashboardSidebarTabs.addTitleTab,
      ],
    }),
    [],
  );

  const otherMenuTabs = [
    { name: "Blog and article", icon: "", link: "/blog" },
    { name: "Help Center", icon: "", link: "/help-center" },
  ];

  const tabClasses = (isActive: boolean) =>
    cn(
      "group flex w-full cursor-pointer items-center rounded-xl text-left font-medium transition-all duration-200",
      collapsed ? "h-11 justify-center px-0" : "gap-3 px-3 py-3 text-[15px] sm:text-[16px]",
      isActive
        ? "bg-[#142463] font-bold text-white shadow-[0_6px_16px_rgba(20,36,99,0.22)]"
        : "text-[#344054] hover:bg-[#EEF2FA] hover:text-[#1A3FAF]",
    );

  const sectionHeader = (label: string, isCollapsed: boolean, onToggle: () => void) =>
    collapsed ? (
      <div className="mx-2 h-px bg-[#EEF1F6]" role="separator" aria-label={label} />
    ) : (
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={!isCollapsed}
        className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5B6478] hover:text-[#0F172A]"
      >
        <span>{label}</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-300", isCollapsed && "-rotate-90")}
          aria-hidden="true"
        />
      </button>
    );

  const sectionBody = (isCollapsed: boolean, maxH: string, children: React.ReactNode) => (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300",
        !collapsed && isCollapsed ? "max-h-0 opacity-0" : `${maxH} opacity-100`,
      )}
    >
      <div className="space-y-1">{children}</div>
    </div>
  );

  const toggleLabel =
    variant === "mobile" ? "Close menu" : collapsed ? "Expand sidebar" : "Collapse sidebar";

  const toggleButton = (
    <button
      type="button"
      aria-label={toggleLabel}
      title={variant === "desktop" ? `${toggleLabel} (Ctrl/⌘ + B)` : toggleLabel}
      className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#E5EAF2] bg-white text-[#5B6478] shadow-[0_4px_12px_rgba(15,23,42,0.06)] transition-colors hover:bg-[#F4F6FA] hover:text-[#0F172A]"
      onClick={() =>
        variant === "mobile"
          ? dispatch(isSidebarOpenToogle(false))
          : dispatch(toggleSidebarCollapsed())
      }
    >
      {collapsed ? (
        <PanelLeftOpen className="h-[18px] w-[18px]" aria-hidden="true" />
      ) : (
        <PanelLeftClose className="h-[18px] w-[18px]" aria-hidden="true" />
      )}
    </button>
  );

  return (
    <div
      ref={sidebarRef}
      className={cn(
        "flex h-full flex-col overflow-hidden bg-white font-plus-jakarta",
        collapsed ? "px-0" : "px-2",
      )}
    >
      <div className="shrink-0 pt-4">
        {collapsed ? (
          <div className="flex flex-col items-center gap-3">
            <Image src="/WorkR-Logo2.png" alt="WorkR" width={36} height={36} priority className="h-9 w-9" />
            {/* Keep the full logo loaded so expanding doesn't flash */}
            <Image src="/WorkR-Full-Logo2.png" alt="" width={92} height={92} priority className="hidden" aria-hidden="true" />
            {toggleButton}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <Image src="/WorkR-Logo2.png" alt="" width={36} height={36} priority className="hidden" aria-hidden="true" />
            <Image
              src="/WorkR-Full-Logo2.png"
              alt="WorkR logo"
              width={92}
              height={92}
              priority
              className="h-auto w-auto"
            />
            {toggleButton}
          </div>
        )}

        <div className="mt-4">
          {collapsed ? (
            <div
              aria-disabled="true"
              aria-label="Quick search, coming soon"
              title="Quick search · coming soon"
              className="relative mx-auto flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-xl border border-[#E4E8F0] bg-[#F7F8FB] text-[#8A93A6]"
            >
              <Search className="h-[18px] w-[18px]" aria-hidden="true" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#7C5CE6]" aria-hidden="true" />
            </div>
          ) : (
            <div
              aria-disabled="true"
              title="Quick search is coming soon"
              className="flex h-11 w-full cursor-not-allowed items-center gap-2.5 rounded-xl border border-[#E4E8F0] bg-[#F7F8FB] px-3.5 text-[#8A93A6]"
            >
              <Search className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              <span className="flex-1 truncate text-sm font-medium">Quick search</span>
              <span className="shrink-0 rounded-full bg-[#F1EDFF] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#5B3CC4]">
                Soon
              </span>
            </div>
          )}
        </div>
      </div>

      <nav aria-label="Dashboard" className="hide-scrollbar mt-5 flex-1 overflow-y-auto pb-4">
        <section className="space-y-3">
          {sectionHeader("Main", mainMenuCollapsed, () => dispatch(mainMenuCollapsedToogle()))}
          {sectionBody(
            mainMenuCollapsed,
            "max-h-[500px]",
            newMainMenuTabs[role]?.map((tab, index) => {
              const isActive = mainMenuActiveTab === index;
              return (
                <button
                  key={index}
                  type="button"
                  title={collapsed ? tab.name : undefined}
                  aria-label={collapsed ? tab.name : undefined}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => {
                    setMainMenuActiveTab(index);
                    dispatch(isSidebarOpenToogle(false));
                    tab.onClickFn(dispatch, router, tab.link, isSuccess);
                  }}
                  className={tabClasses(isActive)}
                >
                  <span
                    className={cn(
                      "flex shrink-0 items-center justify-center",
                      isActive ? "text-white" : "text-[#344054] group-hover:text-[#1A3FAF]",
                    )}
                  >
                    {tab.icon}
                  </span>
                  {!collapsed && <span className="truncate">{tab.name}</span>}
                </button>
              );
            }),
          )}
        </section>

        {newCreationTabs[role]?.length > 0 && (
          <section className="mt-6 space-y-3">
            {sectionHeader("Creation", creationMenuCollapsed, () => setCreationMenuCollapsed((prev) => !prev))}
            {sectionBody(
              creationMenuCollapsed,
              "max-h-[900px]",
              newCreationTabs[role]?.map((tab, index) => (
                <button
                  key={index}
                  type="button"
                  title={collapsed ? tab.name : undefined}
                  aria-label={collapsed ? tab.name : undefined}
                  onClick={() => {
                    tab.onClickFn(dispatch, router, tab.link, isSuccess);
                    dispatch(isSidebarOpenToogle(false));
                  }}
                  className={tabClasses(false)}
                >
                  <span className="flex shrink-0 items-center justify-center text-[#344054] group-hover:text-[#1A3FAF]">
                    {tab.icon}
                  </span>
                  {!collapsed && <span className="truncate">{tab.name}</span>}
                </button>
              )),
            )}
          </section>
        )}

        {/* "Others" items have no icons and aren't live yet, so they're left out of the rail. */}
        {!collapsed && (
          <section className="mt-6 space-y-3">
            {sectionHeader("Others", othersMenuCollapsed, () => setOthersMenuCollapsed((prev) => !prev))}
            {sectionBody(
              othersMenuCollapsed,
              "max-h-[300px]",
              otherMenuTabs.map((tab, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setOtherMenuActiveTab(index);
                    router.push(`${pathname}${tab.link}`);
                  }}
                  className="flex w-full cursor-not-allowed items-center justify-between gap-3 rounded-xl px-3 py-3 text-left text-[15px] font-medium text-[#98A2B3] sm:text-[16px]"
                  disabled
                >
                  <span className="truncate">{tab.name}</span>
                  <span className="shrink-0 rounded-full bg-[#F1EDFF] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-[#5B3CC4]">
                    Soon
                  </span>
                </button>
              )),
            )}
          </section>
        )}
      </nav>

      <div className="shrink-0 pb-5 pt-3">
        <div
          className={cn(
            "rounded-2xl border border-[#E7ECF3] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.06)]",
            collapsed ? "mx-auto w-fit p-1" : "p-2",
          )}
        >
          <UserProfileSidebar compact={collapsed} />
        </div>
      </div>
    </div>
  );
}
