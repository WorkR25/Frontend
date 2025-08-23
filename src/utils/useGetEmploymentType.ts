import { jobServiceApi } from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";

const useGetEmploymentType = (authJwtToken: string | null) => {
  return useQuery({
    queryKey: ["employmentType"],
    queryFn: () => {
      return getEmploymentType(authJwtToken);
    },
    enabled: !!authJwtToken,
    refetchOnWindowFocus: false, 
  });
};

const getEmploymentType = async (authJwtToken: string | null) => {
  try {
    const response = await jobServiceApi.get("/employment-types", {
      headers: {
        Authorization: authJwtToken,
      },
    });
    
    return response.data?.data;
  } catch (error) {
    throw error;
  }
};

export default useGetEmploymentType ;