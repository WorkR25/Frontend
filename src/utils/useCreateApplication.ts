import { jobServiceApi } from "@/lib/axios.config"
import { ApiResponse } from "@/types/ApiResponse"
import { ErrorResponse } from "@/types/ErrorResponse"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

const  useCreateApplication= ()=>{
    return useMutation({
        mutationFn: async({jobId, jwtToken}:{
            jobId: number | null,
            jwtToken: string | null
        })=>{
            return await createApplication(jwtToken, jobId);
        },
        onError: (error: AxiosError<ErrorResponse>)=>{
            const message =
                error.response?.data?.message ||
                error.message ||
                "Something went wrong";

            toast.error(message);
        },
        onSuccess: (data)=>{
            toast.success(data.message || "Succesfully applied");
        }
    })
}

interface Application{
   applied_at: string;
   candidate_id: number;
   deleted_at:string | null;
   id: number;
   job_id:number;
}

const createApplication=async(jwtToken: string | null ,jobId: number | null ):Promise<ApiResponse<Application>>=>{
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
}

export default useCreateApplication ;