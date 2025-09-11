"use client";

import TipsCard from "@/components/TipsCard";
import { RootState } from "@/lib/store.config";
import { getCompletionPercentage } from "@/utils/getCompletionPercentage";
import useGetUser from "@/utils/useGetUser";
import { Crown, Ellipsis, Pencil } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function DashboardRightside() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null ;
  
  return (
    <div className="sm:basis-15/50 relative sm:px-2 pb-2 mt-1 sm:overflow-y-scroll h-fit sm:h-[calc(100vh-84px)]">
      <ProfileCompletion />
      <Engagement />
      <TipsCard/>
    </div>
  );
}

function ProfileCompletion() {
  const jwtToken = useSelector((state: RootState)=> state.authJwtToken.value);
  const { data: userData } = useGetUser(jwtToken) ;
  return (
    <div>
      <div className="border border-[#F0F0F0] rounded-lg px-3">
        <div className=" flex items-center justify-between py-3">
          <div className="text-base ">Profile Completion</div>
          <div>
            <Ellipsis className="w-4 h-4" />
          </div>
        </div>
        <div className="font-bold text-3xl pb-2">{userData ? getCompletionPercentage(userData) + '%' : "0%"}</div>
        <div className="text-sm text-[#929292]">
          Its super great and no need of improvement
        </div>
        <div className=" rounded-xl p-2 mt-2 bg-[#E7F2F8]">
          <div className="text-sm text-[#28668B]">Our Suggestions :</div>
          <HorizontalScrollWithDots />
        </div>
        <button className="w-full my-2 flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors hover:cursor-pointer">
          <Pencil size={16} strokeWidth={2} />
          <span className="text-[#D8FFFF] ">
            Edit Profile
          </span>
        </button>
      </div>
    </div>
  );
}

function Engagement() {
  return (
    <div className="border border-[#F0F0F0] rounded-lg p-3 my-2">
      <div className="text-base py-2">Your Engagement</div>
      <div className="text-3xl font-semibold">29</div>
      <div className="text-[#929292] text-xs">Recuiter viewed your profile</div>
      <div className="h-[80px]">Chart</div>
      <button className="flex w-full items-center justify-center gap-2 p-2 rounded-md bg-[#E9F3F9] text-[#2E6B8A] font-medium text-sm hover:cursor-pointer">
        <Crown className="w-4 h-4 stroke-[2.5]" />
        <div>Subscribe to unlock engagement</div>
      </button>
    </div>
  );
}

function HorizontalScrollWithDots() {
  const items = [{ content: "Eat 5 star" }, { content: "Do nothing" }];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const index = Math.round(el.scrollLeft / el.clientWidth);
      setActiveIndex(index);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar"
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="min-w-full flex items-center snap-center h-16 text-xs text-[#172026]"
          >
            {item.content}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-1 mt-1">
        {items.map((_, i) => (
          <div
            key={i}
            className={`w-1 h-1 rounded-full ${
              i === activeIndex ? "bg-black" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
