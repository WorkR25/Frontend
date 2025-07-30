import { Bookmark, MoreHorizontal } from "lucide-react";
import Image from "next/image";

export default function JobDetailsCard() {
  return (
    <div className="bg-gradient-to-r from-[#0052CC] to-[#0073E6] text-white p-4 rounded-xl flex items-center justify-between shadow-md w-full ">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-md overflow-hidden bg-white p-1">
          <Image
            src="/google-icon-logo-svgrepo-com.svg"
            alt="Company Logo"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>

        <div className="space-y-1">
          <div className="text-sm text-white/80">
            3 days ago · 294 applicants
          </div>
          <div className="font-semibold text-lg flex items-center gap-2">
            Project Manager
            <span className="text-xs bg-yellow-400 text-blue-800 px-2 py-0.5 rounded-full">
              Closed Hiring
            </span>
          </div>
          <div className="text-sm text-white/90">
            Advantic Inc. · California, United States
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="bg-white/20 hover:bg-white/30 p-2 rounded-md">
          <Bookmark size={16} />
        </button>
        <button className="bg-white/20 hover:bg-white/30 p-2 rounded-md">
          <MoreHorizontal size={16} />
        </button>
        <button className="hover:cursor-not-allowed ml-3 bg-white text-gray-300 px-4 py-1.5 rounded-md text-sm opacity-80 cursor-not-allowed">
          Apply Now
        </button>
      </div>
    </div>
  );
}