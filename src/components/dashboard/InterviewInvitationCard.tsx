import { Check, MoreHorizontal, X } from "lucide-react";

export default function InterviewInvitationCard () {
  return (
    <div className="w-full sm:w-[55%] rounded-xl bg-[#0075C4] p-4 text-white space-y-4 shadow-md h-[220px]">
      <div className="flex items-center justify-between">
        <div className="relative w-fit">
          <p className="text-[10px] text-yellow-300 absolute -right-[4.3rem] -top-1">Coming Soon</p>
          <h2 className="font-semibold text-base">You’ve got an invitation!</h2>
        </div>
        <MoreHorizontal className="w-5 h-5 text-white" />
      </div>

      <p className="text-sm text-white/80">
        Congratulations! You’ve got an HR Interview Invitation from&nbsp;
        <span className="text-white font-medium">Google Ltd.</span>, accept the
        invitation and prepare yourself!
      </p>

      <div className="bg-[#2292DC] rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <span className="text-xl font-bold text-[#4285F4]">G</span>
          </div>
          <div>
            <div className="text-white font-medium text-sm">
              Wednesday, January 29, 2024
            </div>
            <div className="text-xs text-white/80">13:00 AM – 14:00 AM</div>
          </div>
        </div>

        <div className="flex space-x-2">
          <button className="bg-red-500 p-1.5 rounded-full hover:bg-red-600 transition pointer-events-none">
            <X className="w-4 h-4 text-white" />
          </button>
          <button className="bg-green-500 p-1.5 rounded-full hover:bg-green-600 transition pointer-events-none">
            <Check className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
