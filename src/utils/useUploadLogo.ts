import { jobServiceApi } from "@/lib/axios.config";
import { useMutation } from "@tanstack/react-query"

const useUploadLogo= ()=> {
    return useMutation({
        mutationFn: async({authJwtToken, file}: {authJwtToken: string | null, file: File})=>{
            const formData = new FormData();
            formData.append("file", file);
            try {
                const response = await jobServiceApi.post("/companies/upload-logo", formData, {
                          headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `${authJwtToken}`,
                          },
                        });
                    return response.data ;
            } catch (error) {
                throw error ;
            }
        },
        onError: ()=>{

        },
        onSuccess: ()=>{

        }
    })
}

export default useUploadLogo ;