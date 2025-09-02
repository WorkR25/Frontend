import OptionButton from "@/components/OptionButton";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import JobList from "@/components/dashboard/JobList";
import FilterButton from "@/components/dashboard/FilterButton";
import SortButton from "@/components/dashboard/SortButton";
import JobSearchBanner from "@/components/dashboard/JobSearchBanner";
import PaginationFooter from "@/components/dashboard/PaginationFooter";

export default function Page() {
  return (
    <div className="jobs-page text-black p-2 bg-[#FFFF] h-full pb-0 ">
      <DashboardTopbar pageName="Jobs" />
      <div className="jobs-page overflow-y-scroll h-[calc(100vh-117px))]">
        <div className="jobs-page px-2 relative flex flex-col min-h-full items-end h-full">
          <div className="jobs-page hidden py-2 bg-white sticky top-0">
            <JobSearchBanner />
          </div>
          <div className="jobs-page flex p-2 items-center justify-between">
            {/* <div className="jobs-page font-semibold text-lg">Jobs for you</div> */}
            {/* <div className="jobs-page flex items-center justify-center gap-x-2"> */}

            <div className="jobs-page hidden items-center justify-center gap-x-2">
              <SortButton />
              <FilterButton />
            </div>
          </div>
          {/* <div className="jobs-page space-x-3 mt-3 mr-3 overflow-x-scroll flex hide-scrollbar"> */}
          <div className="jobs-page space-x-3 mt-3 mr-3 overflow-x-scroll hidden hide-scrollbar">
            <OptionButton name={"For you"} isActive={false} />
            <OptionButton name={"Trending jobs"} isActive={false} />
            <OptionButton name={"New this week"} isActive={false} />
            <OptionButton name={"Urgently hiring"} isActive={false} />
          </div>
          <JobList />
          {/* <div className="w-full h-6 border sticky bottom-0 bg-white">Footer</div> */}
        </div>
      </div>
        <PaginationFooter />
    </div>
  );
}
