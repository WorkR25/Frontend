import { useMutation } from "@tanstack/react-query";
import { userServiceApi } from "@/lib/axios.config";
import { UserDetailFormValues } from "@/components/me/UserDetailForm";
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
  });
};


export default useUpdateUserDetails;
