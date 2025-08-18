import OptionButton from "@/components/OptionButton";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import JobList from "@/components/dashboard/JobList";
import FilterButton from "@/components/dashboard/FilterButton";
import SortButton from "@/components/dashboard/SortButton";
import JobSearchBanner from "@/components/dashboard/JobSearchBanner";

export default function Page() {
  return (
    <div className="job-page text-black p-2 bg-[#FFFF] h-full pb-0 ">
      <DashboardTopbar pageName="Jobs" />
      <div className="job-page overflow-y-scroll h-[calc(100vh-74px))]">
        <div className="job-page px-2 ">
          <div className="job-page hidden py-2 bg-white sticky top-0">
            <JobSearchBanner />
          </div>
          <div className="job-page flex p-2 items-center justify-between">
            <div className="job-page font-semibold text-lg">Jobs for you</div>
            <div className="job-page flex items-center justify-center gap-x-2">
              <SortButton />
              <FilterButton />
            </div>
          </div>
          <div className="job-page space-x-3 mt-3 mr-3 overflow-x-scroll flex hide-scrollbar">
            <OptionButton name={"For you"} isActive={false} />
            <OptionButton name={"Trending jobs"} isActive={false} />
            <OptionButton name={"New this week"} isActive={false} />
            <OptionButton name={"Urgently hiring"} isActive={false} />
          </div>
          <JobList />
        </div>
      </div>
    </div>
  );
}



