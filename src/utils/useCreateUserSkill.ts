import { userServiceApi } from "@/lib/axios.config"
import { useMutation } from "@tanstack/react-query"

const useCreateUserSkill =()=>{
    return useMutation({
        mutationFn: async({authJwtToken, skillIds}: {authJwtToken: string | null, skillIds: number[]})=>{
            const response = await userServiceApi.post("/user-skills/", {skillIds}, {
                headers: {
                    Authorization: `${authJwtToken}`
                }
            })
            return response.data ;
        }
    })
}

export default useCreateUserSkill ;