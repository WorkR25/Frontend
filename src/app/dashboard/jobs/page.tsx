import { ArrowUpDown } from "lucide-react";
import { SlidersHorizontal } from "lucide-react";
import OptionButton from "@/components/OptionButton";
import { Search, MapPin } from "lucide-react";
import JobCard from "@/components/JobCard";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";

export default function Page() {
  return (
    <div className="text-black p-2 bg-[#FFFF] h-full pb-0 ">
      <DashboardTopbar pageName="Jobs" />
      <div className=" overflow-y-scroll h-[calc(100vh-74px))]">
        <div className=" px-2 ">
          <div className="py-2 bg-white sticky top-0">
            <JobSearchBanner />
          </div>
          <div className="flex p-2 items-center justify-between">
            <div className="font-semibold text-lg">Jobs for you</div>
            <div className="flex items-center justify-center gap-x-2">
              <SortButton />
              <FilterButton />
            </div>
          </div>
          <div className=" space-x-3 mt-3 mr-3 overflow-x-scroll flex hide-scrollbar">
            <OptionButton name={"For you"} isActive={false} />
            <OptionButton name={"Trending jobs"} isActive={false} />
            <OptionButton name={"New this week"} isActive={false} />
            <OptionButton name={"Urgently hiring"} isActive={false} />
          </div>
          <div className="flex flex-wrap items-center justify-center-safe my-2 mx-auto gap-2 gap-y-3.5">
            <JobCard
              title="SWE"
              company="Google"
              employmentType="Full-time"
              city="kolkata"
              country="India"
              minPay="100,000"
              maxPay="200,000"
              className="sm:w-[30%]"
            />
            <JobCard
              title="SWE"
              company="Google"
              employmentType="Full-time"
              city="kolkata"
              country="India"
              minPay="100,000"
              maxPay="200,000"
              className="sm:w-[30%]"
            />
            <JobCard
              title="SWE"
              company="Google"
              employmentType="Full-time"
              city="kolkata"
              country="India"
              minPay="100,000"
              maxPay="200,000"
              className="sm:w-[30%]"
            />
            <JobCard
              title="SWE"
              company="Google"
              employmentType="Full-time"
              city="kolkata"
              country="India"
              minPay="100,000"
              maxPay="200,000"
              className="sm:w-[30%]"
            />
            <JobCard
              title="SWE"
              company="Google"
              employmentType="Full-time"
              city="kolkata"
              country="India"
              minPay="100,000"
              maxPay="200,000"
              className="sm:w-[30%]"
            />
            <JobCard
              title="SWE"
              company="Google"
              employmentType="Full-time"
              city="kolkata"
              country="India"
              minPay="100,000"
              maxPay="200,000"
              className="sm:w-[30%]"
            />
            <JobCard
              title="SWE"
              company="Google"
              employmentType="Full-time"
              city="kolkata"
              country="India"
              minPay="100,000"
              maxPay="200,000"
              className="sm:w-[30%]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function JobSearchBanner() {
  return (
    <div className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 p-3 sm:p-8 text-white ">
      <h2 className="text-xl sm:text-2xl font-semibold">
        Explore Your Career Opportunities Here
      </h2>
      <p className="text-sm sm:text-base mt-2 mb-3 sm:mb-6 text-white/80">
        Apply to jobs that match your skills and aspirations, and embark on a
        rewarding career journey.
      </p>

      <div className="flex flex-col sm:flex-row items-stretch bg-white rounded-lg overflow-hidden shadow-md px-2 py-1 gap-2 sm:gap-0">
        <div className="flex items-center flex-1 px-3">
          <Search className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search your job title or keyword..."
            className="w-full outline-none px-2 py-2 text-sm text-gray-800"
          />
        </div>

        <div className="flex items-center flex-1 px-3 border-t sm:border-t-0 sm:border-l border-gray-200">
          <MapPin className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Set your country or timezone..."
            className="w-full outline-none px-2 py-2 text-sm text-gray-800"
          />
        </div>

        <button className="bg-blue-600 hidden sm:inline hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-lg whitespace-nowrap">
          Find Job
        </button>
      </div>
      <button className="sm:hidden w-full mt-2 bg-white text-blue-700 text-sm px-6 py-2 rounded-lg whitespace-nowrap">
        Find Job
      </button>
    </div>
  );
}

function SortButton() {
  return (
    <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-1.5 rounded-md text-sm hover:bg-gray-100 transition">
      <ArrowUpDown className="w-4 h-4 " />
      <span className="hidden sm:inline ">Sort By</span>
    </button>
  );
}

function FilterButton() {
  return (
    <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-1.5 rounded-md text-sm hover:bg-gray-100 transition">
      <SlidersHorizontal className="w-4 h-4" />
      <div className="hidden sm:inline ">Filter</div>
    </button>
  );
}
