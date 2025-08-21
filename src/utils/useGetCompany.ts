import { jobServiceApi } from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";

const useGetCompany = (authJwtToken: string | null, companyName: string | null) => {
  return useQuery({
    queryKey: ["company", companyName],
    queryFn: () => {
      return getCompany(authJwtToken, companyName);
    },
    enabled: !!authJwtToken,
  });
};

const getCompany = async (authJwtToken: string | null, companyName: string | null) => {
  try {
    if(!companyName){
      return [];
    }
    const response = await jobServiceApi.get("/companies?name="+ companyName, {
      headers: {
        Authorization: authJwtToken,
      },
    });
    console.log(response.data.data);
    
    return response.data?.data;
  } catch (error) {
    throw error;
  }
};

export default useGetCompany ;