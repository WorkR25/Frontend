import { jobServiceApi } from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";

const useGetUserApplications = (authJwtToken: string | null) => {
    return useQuery({
        queryKey: ["userApplications", authJwtToken ?? ''],
        queryFn: ()=>{
            return getUserApplication(authJwtToken);
        },
        enabled: !!authJwtToken,
        refetchOnWindowFocus: false, 
    
})
}

const getUserApplication = async (authJwtToken: string | null)=>{
    const response = await jobServiceApi.get('/applications/user', {
        headers: {
            Authorization: authJwtToken,
        },
})
    return response.data.data;
}

export default useGetUserApplications ;