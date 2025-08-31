import { jobServiceApi } from "@/lib/axios.config";
import { Job } from "@/types/GetJobType";
import { useQuery } from "@tanstack/react-query";

const useGetJobs = (authJwtToken: string | null) => {
  return useQuery<Job[]>({
    queryKey: ["jobList"],
    queryFn: () => {
      return getJobs(authJwtToken);
    },
    enabled: !!authJwtToken,
    refetchInterval: 30*60*1000 // 30 mins 

  });
};

const getJobs = async (authJwtToken: string | null) => {
  try {
    const response = await jobServiceApi.get("/jobs", {
      headers: {
        
        Authorization: authJwtToken,
      },
    });
    return response.data.data as Job[];
  } catch (error) {
    throw error;
  }
};

export default useGetJobs ;