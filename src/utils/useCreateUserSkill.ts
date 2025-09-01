import { userServiceApi } from "@/lib/axios.config"
import { GetUserResponseType } from "@/types/GetUserResponseType"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const useCreateUserSkill =()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async({authJwtToken, skillIds}: {authJwtToken: string | null, skillIds: number[], skillName: string})=>{
            const response = await userServiceApi.post("/user-skills", {skillIds}, {
                headers: {
                    Authorization: `${authJwtToken}`
                }
            })
            return response.data ;
        },
        onSuccess: (_, variables)=>{
            queryClient.setQueryData<GetUserResponseType>(["userDetails", variables.authJwtToken], (prev)=> {
                if(prev){                    
                    return {
                        ...prev,
                        skills: [...prev.skills, { id: variables.skillIds[0], name: variables.skillName }]
                    }
                }
            } )
            queryClient.invalidateQueries({ queryKey: ["userDetails", variables.authJwtToken] });
            queryClient.refetchQueries({ queryKey: ["userDetails", variables.authJwtToken] });

        }
    })
}

export default useCreateUserSkill ;