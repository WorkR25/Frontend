import { userServiceApi } from "@/lib/axios.config"
import { useMutation } from "@tanstack/react-query"

const useDeleteUserSkill =()=>{
    return useMutation({
        mutationFn: async({authJwtToken, skillId}: {authJwtToken: string | null, skillId: number})=>{
            const response = await userServiceApi.delete("/user-skills/"+ skillId, {
                headers: {
                    Authorization: `${authJwtToken}`
                }
            })
            return response.data ;
        }
    })
}

export default useDeleteUserSkill ;