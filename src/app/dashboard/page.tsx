"use client";

import DashboardRightside from "@/components/dashboard/DashboardRightside";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import DeadlineCard from "@/components/dashboard/DeadlineCard";
import InterviewInvitationCard from "@/components/dashboard/InterviewInvitationCard";
import JobCard from "@/components/JobCard";
import OptionButton from "@/components/OptionButton";
import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { RootState } from "@/lib/store.config";
import useGetUser from "@/utils/useGetUser";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Page() {
  const jwtToken = useSelector((state: RootState) => {
    return state.authJwtToken.value;
  });
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("AuthJwtToken");
    if (token) {
      dispatch(setAuthJwtToken(token));
    } 
  }, [dispatch]);

  const {
    
  } = useGetUser(jwtToken);

  

  return (
    <div className="text-black p-2 bg-[#FFFF] h-full pb-0 ">
      <DashboardTopbar pageName="Overview" />
      <div className="flex m-4 h-full">
        <div className="sm:basis-35/50 h-[calc(100vh-84px)] overflow-y-scroll  ">
          <ApplicationSummary />
          <div className="sm:hidden h-fit mt-4">
            <DashboardRightside />
          </div>
          <JobRecommendation />
        </div>
        <div className="hidden sm:block">
          <DashboardRightside />
        </div>
      </div>
    </div>
  );
}

function JobRecommendation() {
  return (
    <div className="px-3 w-full border border-[#F0F0F0] rounded-lg my-3 pb-3">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="font-semibold text-xl">Job Recommendation</div>
        <div className="text-[#28668B]">See All</div>
      </div>
      <div className=" space-x-3 mt-3 overflow-x-scroll flex hide-scrollbar">
        <OptionButton name="For you" isActive={true} />
        <OptionButton name="Trending" isActive={false} />
        <OptionButton name="New This Week" isActive={false} />
        <OptionButton name="Nearby Opportunities" isActive={false} />
        <OptionButton name="Urgently Hiring" isActive={false} />
        <OptionButton name="Urgently Hiring" isActive={false} />
        <OptionButton name="Urgently Hiring" isActive={false} />
      </div>
      <div className="flex gap-2 flex-wrap items-center justify-evenly mt-3">
        <JobCard
          id={1}
          title="SWE"
          company="Google"
          employmentType="Full-time"
          city="kolkata"
          country="India"
          minPay="100,000"
          maxPay="200,000"
          applyLink="www.google.com"
        />
        <JobCard
          id={2}
          title="Full Stack"
          company="Amazon"
          employmentType="Part-time"
          city="Pune"
          country="India"
          minPay="10,000"
          maxPay="20,000"
          applyLink="www.google.com"
        />
      </div>
    </div>
  );
}

function ApplicationSummary() {
  return (
    <div className=" ">
      <div className=" border border-[#F0F0F0] rounded-lg p-4">
        <div className="text-xl font-semibold">Applications</div>
        <div className="flex items-baseline gap-2">
          <div className="text-xl font-semibold">Summary</div>
          <div>Month</div>
        </div>
        <div className=" space-x-3 mt-3 overflow-x-scroll flex hide-scrollbar  ">
          <OptionButton name="Application" isActive={true} />
          <OptionButton name="Interview" isActive={false} />
          <OptionButton name="Screening" isActive={false} />
          <OptionButton name="Assesment" isActive={false} />
          <OptionButton name="Offering" isActive={false} />
          <OptionButton name="Acceptance" isActive={false} />
        </div>

        <div className="text-4xl mt-4 font-semibold">999</div>
        <div className="space-x-2 mt-1">
          <span className="text-[#53A889]">+12</span>
          <span className="text-[#868686]">
            Applications has been sent to the recruiter today, great work, hope
            the best for you!
          </span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center sm:justify-start items-center mt-2 gap-x-2  gap-y-1">
        <DeadlineCard />
        <InterviewInvitationCard />
      </div>
      <div></div>
    </div>
  );
}
