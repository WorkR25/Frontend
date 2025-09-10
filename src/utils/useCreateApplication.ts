import { jobServiceApi } from "@/lib/axios.config"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"

const  useCreateApplication= ()=>{
    return useMutation({
        mutationFn: async({jobId, jwtToken}:{
            jobId: number | null,
            jwtToken: string | null
        })=>{
            try{
                if(!jwtToken){
                    toast.error('Log in to continue')
                    throw new Error("No jwt token provided");
                }
                const response= await jobServiceApi.post('/applications', {jobId}, {
                    headers: {
                        Authorization: jwtToken
                    }
                })

                return response.data ;
            }catch(error){
                throw error ;
            }
        },
        onError: ()=>{
            // toast.error("Error applying for job ")
        },
        onSuccess: ()=>{
            // toast.success("Succesfully applied")
        }
    })
}

export default useCreateApplication ;