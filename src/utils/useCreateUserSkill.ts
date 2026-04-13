import { userServiceApi } from "@/lib/axios.config"
import { ApiResponse } from "@/types/ApiResponse";
import { GetUserResponseType } from "@/types/GetUserResponseType"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const useCreateUserSkill =()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async({authJwtToken, skillIds}: {authJwtToken: string | null, skillIds: number[], skillName: string})=>{
           return await createUserSkill(authJwtToken, skillIds);
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

interface userSkill{
    userId:number,
    skillId:number
}

const createUserSkill=async(authJwtToken: string | null, skillIds: number[]):Promise<ApiResponse<userSkill[]>>=>{
     const response = await userServiceApi.post("/user-skills", {skillIds}, {
                headers: {
                    Authorization: `${authJwtToken}`
                }
            })
     return response.data ;
}

export default useCreateUserSkill ;