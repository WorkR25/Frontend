import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import BackButton from "@/components/BackButton";
import JobDetailsCard from "@/components/jobDetails/JobDetailsCard";
import JobDescription from "@/components/jobDetails/JobDescription";
import JobSpecification from "@/components/jobDetails/JobSpecification";

export default async function Page({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
    const {jobId} = await params;
    console.log(jobId);
  return (
    <div className="text-black bg-white h-screen flex flex-col p-2">
      <div className="flex items-center ">
        <div className="basis-[5%] ">
          <BackButton />
        </div>
        <DashboardTopbar className="basis-[95%]" pageName="Job Details" />
      </div>
      <JobDetailsCard />
      <div className="flex flex-1 overflow-hidden">
        <div className="basis-35/50 overflow-y-auto p-4 min-h-0">
          <JobDescription />
        </div>
        <div className="basis-15/50 overflow-y-auto p-4 min-h-0">
          <JobSpecification />
        </div>
      </div>
    </div>
  );
}





