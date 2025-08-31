import { userServiceApi } from "@/lib/axios.config";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

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
    onError: ()=>{
        toast.error('Error creating skills')
    }
  });
};

export default useCreateSkill;
