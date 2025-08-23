import { setJobDetails } from "@/features/jobDetails/jobDetails";
import { jobServiceApi } from "@/lib/axios.config";
import { JobDetails } from "@/types/JobDetailsType";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";


const useGetJobDetails = (authJwtToken: string | null, jobId: string) => {
    const dispatch = useDispatch()
    return useQuery<JobDetails | null>({
        queryKey: ["jobDetails", jobId],
        queryFn: () => getJobDetails(authJwtToken, jobId, dispatch),
        enabled: !!authJwtToken,
    });
};

const getJobDetails = async (authJwtToken: string | null, jobId: string, dispatch: Dispatch<UnknownAction>) => {
  if (!authJwtToken) {
    return null;
  }

  try {
    const response = await jobServiceApi.get(`/job/${jobId}`, {
      headers: {
        Authorization: `${authJwtToken}`,
      },
    });

    dispatch(setJobDetails(response.data.data));
    return response.data.data ? (response.data.data as JobDetails) : null;
  } catch (error) {
    throw error;
  }
};

export default useGetJobDetails;
