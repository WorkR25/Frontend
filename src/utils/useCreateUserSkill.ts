import { userServiceApi } from "@/lib/axios.config"
import { GetUserResponseType } from "@/types/GetUserResponseType"
import { QueryClient, useMutation } from "@tanstack/react-query"

const useCreateUserSkill =()=>{
    return useMutation({
        mutationFn: async({authJwtToken, skillIds}: {authJwtToken: string | null, skillIds: number[], skillName: string})=>{
            const response = await userServiceApi.post("/user-skills/", {skillIds}, {
                headers: {
                    Authorization: `${authJwtToken}`
                }
            })
            return response.data ;
        },
        onSuccess: (_, variables)=>{
            const queryClient = new QueryClient();
            queryClient.setQueryData<GetUserResponseType>(["userSkills"], (prev)=> {
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