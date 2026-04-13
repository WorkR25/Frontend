import { userServiceApi } from "@/lib/axios.config";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types/ErrorResponse";
import { ApiResponse } from "@/types/ApiResponse";

const useCreateRole = () => {
  return useMutation({
    mutationFn: async ({
      authJwtToken,
      roleName,
    }: {
      authJwtToken: string | undefined;
      roleName: string;
    }) => {
      return await createRole( authJwtToken,roleName);
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
              error.response?.data?.message ||
              error.message ||
              "Something went wrong";

      toast.error(message);
    },

    onSuccess: (data) => {
      toast.success(data.message || "Role created successfully!");
    },
  });
};

type Role = {
  id: number;
  name: string;
  createdAt: string; 
  updatedAt: string; 
  deletedAt: string | null;
};

const createRole=async( authJwtToken: string | undefined, roleName: string):Promise<ApiResponse<Role>>=>{
   if (!roleName || roleName.trim() === "") {
        throw new Error("Role name cannot be empty");
      }

      const response = await userServiceApi.post(
        "/role",
        { name: roleName },
        {
          headers: {
            Authorization: `${authJwtToken}`,
          },
        }
      );
      return response.data;
}

export default useCreateRole;