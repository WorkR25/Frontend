"use client";
import { JobCardParams } from "@/types/JobCard";
import { cn } from "@/utils/cn";
import { timeAgo } from "@/utils/getTime";
import { BadgeDollarSign, Bookmark, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function JobCard({
  id,
  img,
  title,
  company,
  employmentType,
  city,
  country,
  minPay,
  maxPay,
  className="sm:w-[45%]",
  created_at,
}: JobCardParams) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "w-full rounded-xl border border-gray-200 p-4 shadow-sm bg-white space-y-3",
        " hover:cursor-pointer hover:shadow-xl",
        className
      )}
      onClick={() => {
        router.push("/dashboard/jobs/" + id);
      }}
    >
      <div className="flex items-center justify-between text-sm">
        <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs font-medium">
          Suit You Best!
        </span>
        <span className="text-gray-400 text-xs">{created_at? timeAgo(String(created_at)): "3 days ago"}</span>
      </div>

      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <Image
            src={img ? img : "/google-icon-logo-svgrepo-com.svg"}
            alt="photo"
            width={40}
            height={40}
            objectFit="cover"
            priority
          />
        </div>
        <div>
          <div className="font-semibold text-sm">{title}</div>
          <div className="text-xs text-gray-500">{company}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-gray-600">
        <div className="flex items-center space-x-1 bg-[#EAEAEA] px-2 py-1 rounded-md">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-black">{city + ", " + country}</span>
        </div>
        <div className="flex items-center space-x-1 bg-[#EAEAEA] px-2 py-1 rounded-md">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-black">{employmentType}</span>
        </div>
        <div className="flex items-center space-x-1 bg-[#EAEAEA] px-2 py-1 rounded-md">
          <BadgeDollarSign className="w-3.5 h-3.5" />
          <span className="text-black">{"$" + minPay + " -$" + maxPay}</span>
        </div>
        <div className="bg-gray-100 px-2 py-1 rounded-md text-xs">+2</div>
      </div>

      { (
        <div className="flex items-center justify-between">
          <button className=" bg-blue-600 hover:bg-blue-700 basis-9/10 w-full text-white text-sm font-medium px-6 py-2 rounded-md">
            Apply
          </button>
          <Bookmark className="w-5 h-5 basis-1/10 text-gray-400" />
        </div>
      )}
    </div>
  );
}
