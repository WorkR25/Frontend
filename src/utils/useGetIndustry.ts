import { jobServiceApi } from "@/lib/axios.config"
import { useQuery } from "@tanstack/react-query"

const useGetIndustry = (jwtToken: string | null, name: string) => {
    return useQuery({
        queryKey: ['industries', name],
        queryFn: ()=> {
            return getIndustry({jwtToken, name})
        },
        enabled: !!jwtToken && !!name,
        refetchOnWindowFocus: false, 
    })
}

const getIndustry = async ({jwtToken, name}: {jwtToken: string | null, name: string}) => {
    try {
        if(!name){
            return [] ;
        }
        const response = await jobServiceApi.get('/industries?name=' + name, {
        headers: {
            Authorization: `${jwtToken}`
        }
    } )
    return response.data.data ;
    } catch (error) {
        throw error ;
    }
}

export default useGetIndustry ;