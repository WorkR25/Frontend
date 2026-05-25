import { userServiceApi } from "@/lib/axios.config"
import { GetUserResponseType } from "@/types/GetUserResponseType"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

const useDeleteUserSkill =()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async({authJwtToken, skillId}: {authJwtToken: string | null, skillId: number})=>{
            const response = await userServiceApi.delete("/user-skills/"+ skillId, {
                headers: {
                    Authorization: `${authJwtToken}`
                }
            })
            return response.data ;
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Error removing skill");
            } else {
                toast.error("Error removing skill");
            }
        },
        onSuccess: (_, variables)=>{
            toast.success("Skill removed");
                queryClient.setQueryData<GetUserResponseType>(["userDetails", variables.authJwtToken], (prev)=> {
                    if(prev){                    
                        return {
                            ...prev ,
                            skills : [...prev.skills.filter((skill)=> skill.id !== variables.skillId)]
                        }
                    }
                } )
                queryClient.invalidateQueries({ queryKey: ["userDetails", variables.authJwtToken] });
                queryClient.refetchQueries({ queryKey: ["userDetails", variables.authJwtToken] });
    
            }
    })
}

export default useDeleteUserSkill ;