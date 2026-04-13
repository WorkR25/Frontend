import { userServiceApi } from "@/lib/axios.config"
import { ApiResponse } from "@/types/ApiResponse"
import { GetUserResponseType } from "@/types/GetUserResponseType"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const useDeleteUserSkill =()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async({authJwtToken, skillId}: {authJwtToken: string | null, skillId: number})=>{
          return await deleteUserSkill(authJwtToken, skillId);
        },
        onSuccess: (_, variables)=>{
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

const deleteUserSkill=async(authJwtToken: string | null, skillId: number):Promise<ApiResponse<object>>=>{
      const response = await userServiceApi.delete("/user-skills/"+ skillId, {
                headers: {
                    Authorization: `${authJwtToken}`
                }
            })
      return response.data ;
}

export default useDeleteUserSkill ;