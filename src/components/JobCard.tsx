import { JobCardParams } from "@/types/JobCard";
import { BadgeDollarSign, Bookmark, Clock, MapPin } from "lucide-react";
import Image from "next/image";

export default function JobCard({
  title,
  company,
  employmentType,
  city,
  country,
  minPay,
  maxPay,
}: JobCardParams) {
  return (
    <div className="w-84 rounded-xl border border-gray-200 p-4 shadow-sm bg-white space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs font-medium">
          Suit You Best!
        </span>
        <span className="text-gray-400 text-xs">3d ago</span>
      </div>

      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <Image
              src="/google-icon-logo-svgrepo-com.svg"
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

      <div className="flex items-center justify-between">
        <button className="bg-blue-600 hover:bg-blue-700 w-[250px] text-white text-sm font-medium px-6 py-2 rounded-md">
          Apply
        </button>
        <Bookmark className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
}
