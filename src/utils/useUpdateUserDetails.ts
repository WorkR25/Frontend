import { useMutation } from "@tanstack/react-query";
import { userServiceApi } from "@/lib/axios.config";
import { UserDetailFormValues } from "@/components/me/UserDetailForm";
import { AxiosError } from "axios";
import { toast } from "sonner";
const useUpdateUserDetails = () => {
  return useMutation({
    mutationFn: async ({
      authJwtToken,
      id,
      userDetails,
    }: {
      authJwtToken: string;
      id: string;
      userDetails: UserDetailFormValues;
    }) => {
      await userServiceApi.put(
        `/users/update/${id}`,
        {
          ...userDetails,
        },
        {
          headers: {
            Authorization: `${authJwtToken}`,
          },
        }
      );
      return true;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Error updating user details");
      } else {
        toast.error("Error updating user details");
      }
    },
    onSuccess: () => {
      toast.success("User details updated");
    },
  });
};


export default useUpdateUserDetails;
