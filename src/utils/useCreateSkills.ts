import { userServiceApi } from "@/lib/axios.config";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const useCreateSkill = () => {
  return useMutation({
    mutationFn: async ({
      jwtToken,
      skills,
    }: {
      jwtToken: string;
      skills: string[];
    }) => {
      try {
        const response = userServiceApi.post(
          "/skills",
          { skills },
          {
            headers: {
              Authorization: `${jwtToken}`,
            },
          }
        );
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: ()=>{
        toast.success('Skills Added successfully')
    },
    onError: (error) => {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message || "Error creating skills");
        } else {
            toast.error("Error creating skills");
        }
    }
  });
};

export default useCreateSkill;
