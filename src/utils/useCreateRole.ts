import { userServiceApi } from "@/lib/axios.config";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const useCreateRole = () => {
  return useMutation({
    mutationFn: async ({
      authJwtToken,
      roleName,
    }: {
      authJwtToken: string | undefined;
      roleName: string;
    }) => {
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
    },

    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Server error occurred";
        toast.error(`Error creating role: ${message}`);
      } else if (error instanceof Error) {
        toast.error(`${error.message}`);
      } else {
        toast.error("Error while creating job");
      }
    },

    onSuccess: () => {
        
      toast.success("Role created successfully!");
    },
  });
};

export default useCreateRole;