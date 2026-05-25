import { userServiceApi } from "@/lib/axios.config";
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { toast } from "sonner";

const useCreateLocation = () => {
    return useMutation({
        mutationFn: async({jwtToken, city, state, country}: {jwtToken: string, city: string, state: string, country: string})=> {
            try {
                const response = userServiceApi.post('/locations', {city, state, country}, {
                    headers: {
                        Authorization: jwtToken
                    }
                });

                return response ;
            } catch (error) {
                throw error ;
            }
        },
        onSuccess: ()=>{
            toast.success("Location Added successfully")
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Error creating location");
            } else {
                toast.error("Error creating location");
            }
        }
    })
}

export default useCreateLocation ;