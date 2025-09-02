import { OptionType } from "@/components/createJob/CreateJobForm";
import { jobServiceApi } from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";

const useGetCompanyById = (authJwtToken: string | null, companyId: number | null | undefined) => {
    
  return useQuery({
    queryKey: ["company", companyId ?? ""],
    queryFn: () => {
        if(!companyId){
        return 
    }
      return getCompany(authJwtToken, companyId);
    },
    enabled: !!authJwtToken,
    refetchOnWindowFocus: false, 
  });
};

const getCompany = async (authJwtToken: string | null, companyId: number ) => {
  try {
    if(!companyId){
      return "" ;
    }
    const response = await jobServiceApi.get("/companies/"+ companyId, {
      headers: {
        Authorization: authJwtToken,
      },
    });
    return response.data?.data as OptionType ;
  } catch (error) {
    throw error;
  }
};

export default useGetCompanyById ;