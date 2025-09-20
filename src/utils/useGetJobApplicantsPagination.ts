import { jobServiceApi } from "@/lib/axios.config"
import { useQuery } from "@tanstack/react-query"

const useGetJobApplicantsPagination = ({jwtToken, jobId, limit, page }:{jwtToken: string | null, jobId: number, page: number, limit: number}) => {
    return useQuery({
        queryKey: [jwtToken ?? "", `${jobId}`, `${limit}`, `${page}`],
        queryFn: ()=>{
            return getJobApplicantsPagination({jwtToken, jobId, limit, page})
        },
        enabled: !!jwtToken,
    })
}

const getJobApplicantsPagination = async ({jwtToken, jobId, limit, page }:{jwtToken: string | null, jobId: number, page: number, limit: number}) => {
    try {
        const response = await jobServiceApi.get(`/applications/pages/job-id?jobId=${jobId}&page=${page}&limit=${limit}`,{
        headers: {
            Authorization: `${jwtToken}`
        }   
    });
    
    return response.data.data ;
    } catch (error) {
        throw error ;
    }
}

export default useGetJobApplicantsPagination ;