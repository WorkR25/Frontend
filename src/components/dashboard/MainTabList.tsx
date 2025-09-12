"use client";
import { isSidebarOpenToogle } from "@/features/isSidebarOpen/isSidebarOpenSlice";
import { mainMenuCollapsedToogle } from "@/features/mainMenuCollapsed/mainMenuCollapsed";
import { ChartPie, ChevronDown, Folder, Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  onClickAllJobs,
  onClickExploreJob,
  onClickOverview,
} from "./dashboard.utils";
import { useEffect, useState } from "react";
import { RootState } from "@/lib/store.config";
import useGetUser from "@/utils/useGetUser";
import useGetUserRoles from "@/utils/useGetUserRoles";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";

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

const mainMenuTabId: { [key: string]: number } = {
  "jobs": 1,
  "all-jobs": 2,
};

export default function MainTabList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const jwtToken = useSelector((state: RootState) => state.authJwtToken.value);

  const mainMenuCollapsed = useSelector(
    (state: RootState) => state.mainMenuCollapsed.value
  );
  const [mainMenuActiveTab, setMainMenuActiveTab] = useState<number | null>(
    mainMenuTabId[pathname.split("/")[2]] ?? 0
  );
  const [role, setRole] = useState("user");

  const { data: userData } = useGetUser(jwtToken);
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

  return (
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
                  tab.onClickFn(dispatch, router, tab.link, true);
                }}
                className={`py-1.5 px-4 flex items-center gap-4 -mb-px font-medium transition-all duration-300  rounded-md hover:cursor-pointer ${
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
  );
}
