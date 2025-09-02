import { jobServiceApi } from "@/lib/axios.config"
import { useQuery } from "@tanstack/react-query"

const useGetCompanySize = (authJwtToken: string | null) => {
    return useQuery({
        queryKey: ["companySize"],
        queryFn: async () => {
            return getCompanySize(authJwtToken)
        },
    })
}
type GetCompanySizeResponse ={
  id: number;
  createdAt: string; 
  created_at: string;
  updatedAt: string; 
  updated_at: string;
  deleted_at: string | null;
  max_employees: number;
  min_employees: number;
}


const getCompanySize = async (authJwtToken: string | null) => {
    try {
        const response =await jobServiceApi.get('/company-sizes', {
        headers: {
            Authorization: `${authJwtToken}`
        }
    })
    return response.data.data as GetCompanySizeResponse[] ;
    } catch (error) {
        throw error;
    }
}

export default useGetCompanySize;