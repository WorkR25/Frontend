import { userServiceApi } from "@/lib/axios.config";
import { ApiResponse } from "@/types/ApiResponse";
import { ErrorResponse } from "@/types/ErrorResponse";
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
      return await createSkill( jwtToken, skills);
    },
    onSuccess: (data)=>{
        toast.success(data.message || "Skills Added successfully");
    },
    onError: (error: AxiosError<ErrorResponse>)=>{
        const message =
              error.response?.data?.message ||
              error.message ||
              "Something went wrong";

        toast.error(message);
    }
  });
};

interface skill{
   id: number;
  name: string;
  createdAt: string;  
  deletedAt: string | null;
}

const createSkill=async(jwtToken: string, skills: string[]):Promise<ApiResponse<skill>>=>{
  try {
        const response = await userServiceApi.post(
          "/skills",
          { skills },
          {
            headers: {
              Authorization: `${jwtToken}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        throw error;
      }
}

export default useCreateSkill;
