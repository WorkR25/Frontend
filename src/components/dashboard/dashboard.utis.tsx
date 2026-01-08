import {
  Briefcase,
  Building2,
  ToolCase,
  LocateFixed,
  SignpostBig,
  PersonStanding,
  Folder,
  Globe,
  ChartPie,
} from "lucide-react";

import {
  onClickCreateJob,
  onClickCreateCompany,
  onClickAddSKill,
  onClickAddCity,
  onClickAddTitle,
  onClickAllCandidates,
  onClickSearchCandidatesByName,
  onClickSearchCandidatesByEmail,
  onClickCreateRoles,
  onClickAllJobs,
  onClickExploreJob,
  onClickOverview,
} from "./dashboard.utils";

export const dashboardSidebarTabs = {
  createJobTab: {
    name: "Create Job",
    icon: <Briefcase className="w-5 h-5 mr-2" />,
    link: null,
    onClickFn: onClickCreateJob,
  },

  createCompanyTab: {
    name: "Create Company",
    icon: <Building2 className="w-5 h-5 mr-2" />,
    link: null,
    onClickFn: onClickCreateCompany,
  },

  addSkillTab: {
    name: "Add Skill",
    icon: <ToolCase className="w-5 h-5 mr-2" />,
    link: null,
    onClickFn: onClickAddSKill,
  },

  addLocationTab: {
    name: "Add Location",
    icon: <LocateFixed className="w-5 h-5 mr-2" />,
    link: null,
    onClickFn: onClickAddCity,
  },

  addTitleTab: {
    name: "Add Title",
    icon: <SignpostBig className="w-5 h-5 mr-2" />,
    link: null,
    onClickFn: onClickAddTitle,
  },

  allCandidatesTab: {
    name: "All Candidates",
    icon: <PersonStanding className="w-5 h-5 mr-2" />,
    link: null,
    onClickFn: onClickAllCandidates,
  },

  searchCandidatesByNameTab: {
    name: "Search by Name",
    icon: <PersonStanding className="w-5 h-5 mr-2" />,
    link: null,
    onClickFn: onClickSearchCandidatesByName,
  },

  searchCandidatesByEmailTab: {
    name: "Search by Email",
    icon: <PersonStanding className="w-5 h-5 mr-2" />,
    link: null,
    onClickFn: onClickSearchCandidatesByEmail,
  },
  createRolesTab: {
    name: "Create Roles",
    icon: <ToolCase className="w-5 h-5 mr-2" />,
    link: null,
    onClickFn: onClickCreateRoles,
  },

  overviewTab: {
    name: "Overview",
    icon: <ChartPie className="w-5 h-5 mr-2" />,
    link: "/",
    auth: ["admin", "user"],
    onClickFn: onClickOverview,
  },

  exploreJobsTab: {
    name: "Explore Jobs",
    icon: <Globe className="w-5 h-5 mr-2" />,
    link: "/jobs",
    auth: ["admin", "user"],
    onClickFn: onClickExploreJob,
  },
  
  allJobsTab: {
    name: "All jobs",
    icon: <Folder className="w-5 h-5 mr-2" />,
    link: "/all-jobs",
    auth: ["admin"],
    onClickFn: onClickAllJobs,
  },
};

// const creationTabs = [
//     {
//       name: "Create Job",
//       icon: <Briefcase className="w-5 h-5 mr-2" />,
//       link: null,
//       auth: ["user"],
//       onClickFn: onClickCreateJob,
//     },
//     {
//       name: "Create Company",
//       icon: <Building2 className="w-5 h-5 mr-2" />,
//       link: null,
//       auth: ["admin"],
//       onClickFn: onClickCreateCompany,
//     },
//     {
//       name: "Add Skill",
//       icon: <ToolCase className="w-5 h-5 mr-2" />,
//       link: null,
//       auth: ["admin"],
//       onClickFn: onClickAddSKill,
//     },
//     {
//       name: "Add Location",
//       icon: <LocateFixed className="w-5 h-5 mr-2" />,
//       link: null,
//       auth: ["admin"],
//       onClickFn: onClickAddCity,
//     },
//     {
//       name: "Add Title",
//       icon: <SignpostBig className="w-5 h-5 mr-2" />,
//       link: null,
//       auth: ["admin"],
//       onClickFn: onClickAddTitle,
//     },
//     {
//       name: "All Candidates",
//       icon: <PersonStanding className="w-5 h-5" />,
//       link: null,
//       auth: ["admin"],
//       onClickFn: onClickAllCandidates,
//     },
//     {
//       name: "Search by name",
//       icon: <PersonStanding className="w-5 h-5" />,
//       link: null,
//       auth: ["admin"],
//       onClickFn: onClickSearchCandidatesByName,
//     },
//     {
//       name: "Search by email",
//       icon: <PersonStanding className="w-5 h-5" />,
//       link: null,
//       auth: ["admin"],
//       onClickFn: onClickSearchCandidatesByEmail,
//     },
//   ];
