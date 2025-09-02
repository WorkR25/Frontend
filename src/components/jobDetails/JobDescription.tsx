'use client';

import { RootState } from "@/lib/store.config";
import { useSelector } from "react-redux";
import MarkdownHTML from "./MarkdownRender";

export default function JobDescription() {
  const jobDetails = useSelector((state: RootState)=> {return state.jobDetails.value})
  return (
    <div>
      <div className="text-lg font-semibold my-3">Job Description</div>
      <div className="text-gray-400">
        <MarkdownHTML content={jobDetails?.description ?? "null"}/>
      </div>
    </div>
  );
}