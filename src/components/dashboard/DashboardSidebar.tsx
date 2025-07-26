"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Bookmark,
  ChartPie,
  ChevronDown,
  Folder,
  Globe,
  MessageCircle,
  Search,
} from "lucide-react";
import UserProfileSidebar from "../UserProfileSidebar";

export default function DashboardSidebar({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mainMenuCollapsed, setMainMenuCollapsed] = useState(false);
  const [otherMenuCollapsed, setOtherMenuCollapsed] = useState(false);
  const [mainMenuActiveTab, setMainMenuActiveTab] = useState<number | null>(0);
  const [otherMenuActiveTab, setOtherMenuActiveTab] = useState<number | null>(
    null
  );

  const mainMenuTabs = [
    {
      name: "Overview",
      icon: <ChartPie className="w-5 h-5 mr-2" />,
      link: "/",
    },
    {
      name: "Explore Jobs",
      icon: <Globe className="w-5 h-5 mr-2" />,
      link: "/jobs",
    },
    {
      name: "Inbox",
      icon: <MessageCircle className="w-5 h-5 mr-2" />,
      link: "/inbox",
    },
    {
      name: "My Applications",
      icon: <Folder className="w-5 h-5 mr-2" />,
      link: "/applications",
    },
    {
      name: "Saved Jobs",
      icon: <Bookmark className="w-5 h-5 mr-2" />,
      link: "/saved-jobs",
    },
  ];

  const otherMenuTabs = [
    { name: "Blog and article", icon: "", link: "/blog" },
    { name: "Help Center", icon: "", link: "/help-center" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between py-4  ">
        <div>
          <Image
            src="/WorkR-Logo.svg"
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
            setIsSidebarOpen((prev) => {
              return !prev;
            });
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
      <div className="flex items-center w-full max-w-xs p-2 mt-2 border border-gray-300 rounded-md bg-white shadow-sm">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Quick search..."
          className="ml-2 w-full outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent"
        />
      </div>

      <aside className="w-full py-4 text-gray-800 space-y-2">
        <div className="text-xs text-gray-500 tracking-wide uppercase flex items-center justify-between z-20 bg-[#F5F5F5]">
          Main
          <ChevronDown
            className={`hover:cursor-pointer duration-300 ${
              mainMenuCollapsed ? "transform rotate-180" : ""
            }`}
            onClick={() => {
              setMainMenuCollapsed((prev) => {
                return !prev;
              });
            }}
          />
        </div>
        <div
          className={`transition-all duration-500 ease-in-out -z-10 ${
            mainMenuCollapsed ? "hidden" : ""
          }`}
        >
          <div className="flex flex-col">
            {mainMenuTabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => {
                  setMainMenuActiveTab(index);
                  router.push(`${pathname}${tab.link}`);
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
            ))}
          </div>
        </div>
      </aside>

      <div className="mb-[40%]">
        <div className="text-xs text-gray-500 tracking-wide uppercase flex items-center justify-between z-20 bg-[#F5F5F5]">
          Others
          <ChevronDown
            className={`hover:cursor-pointer duration-300 ${
              otherMenuCollapsed ? "transform rotate-180" : ""
            }`}
            onClick={() => {
              setOtherMenuCollapsed((prev) => {
                return !prev;
              });
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
                className={`py-1.5 px-4 flex items-center gap-4 -mb-px font-medium transition-all duration-300 border-2 rounded-md hover:cursor-pointer ${
                  otherMenuActiveTab === index
                    ? "border-blue-500 text-[#D8FFFF] bg-[#0470B8]"
                    : "border-transparent text-gray-500 hover:text-blue-500"
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <UserProfileSidebar />
    </div>
  );
}
