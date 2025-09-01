import { userServiceApi } from "@/lib/axios.config";
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify";

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
        onError: ()=>{
            toast.error("Error creating location")
        }
    })
}

export default useCreateLocation ;