import { jobServiceApi } from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";

export type ApplicantListType = {
  candidate_id: number;
  job_id: number;
  fullName: string;
  email: string;
  phoneNo: string;
  id: number;
  profile: {
    bio: string | null;
    yearsOfExperience: number | null;
    isFresher: boolean | null;
    currentCtc: number | null;
    resumeUrl: string | null;
    linkedinUrl: string | null;
    currentLocationId: number | null;
    currentCompanyId: number | null;
    currentLocation: string | null;
  };
  skills: string[]; 
  roles: {
    name: string;
    UserRole: {
      userId: number;
      roleId: number;
    };
  }[];
};


const useGetJobApplicants = (authJwtToken: string | null, jobId: number) => {
  return useQuery({
    queryKey: ["applications", jobId],
    queryFn: () => {
      return getJobApplicants(authJwtToken, jobId);
    },
    enabled: !!authJwtToken,
    refetchInterval: 30*60*1000 // 30 mins 
  });
};

const getJobApplicants = async (authJwtToken: string | null, jobId: number) => {
  try {
    if(!jobId){
      return [];
    }
    const response = await jobServiceApi.get("/applications/job-id/"+ jobId, {
      headers: {
        Authorization: authJwtToken,
      },
    });
    
    return response.data?.data as ApplicantListType[];
  } catch (error) {
    throw error;
  }
};

export default useGetJobApplicants ;