import { jobServiceApi } from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";

const useGetExperienceLevel = (authJwtToken: string | null) => {
  return useQuery({
    queryKey: ["experienceLevel"],
    queryFn: () => {
      return getExperienceLevel(authJwtToken);
    },
    enabled: !!authJwtToken,
  });
};

const getExperienceLevel = async (authJwtToken: string | null) => {
  try {
    const response = await jobServiceApi.get("/experience-level", {
      headers: {
        Authorization: authJwtToken,
      },
    });
    
    return response.data?.data;
  } catch (error) {
    throw error;
  }
};

export default useGetExperienceLevel ;