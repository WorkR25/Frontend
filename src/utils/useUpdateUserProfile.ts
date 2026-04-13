import { UserProfileFormValues } from "@/components/me/UserProfileForm";
import { userServiceApi } from "@/lib/axios.config";
import { ErrorResponse } from "@/types/ErrorResponse";
import { useMutation } from "@tanstack/react-query";
import  { AxiosError } from "axios";
import { toast } from "sonner";

const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: async ({
      authJwtToken,
      id,
      userProfileData,
    }: {
      authJwtToken: string | null;
      id: string;
      userProfileData: UserProfileFormValues;
    }) => {
      const payload = {
        ...userProfileData,
        yearsOfExperience: userProfileData.yearsOfExperience
          ? Number.isNaN(Number(userProfileData.yearsOfExperience))
            ? 0
            : Number(userProfileData.yearsOfExperience)
          : undefined, // don’t send null/0 unless required

        linkedinUrl: userProfileData.linkedinUrl || undefined,

        currentLocationId: userProfileData.currentLocationId
          ? Number.isNaN(Number(userProfileData.currentLocationId))
            ? 0
            : Number(userProfileData.currentLocationId)
          : undefined,

        currentCompany: userProfileData.currentCompany || null,
      };


      // send to API
      await userServiceApi.put(`/users/update-profile/${id}`, payload, {
        headers: {
          Authorization: `${authJwtToken}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },

    onError: (error: AxiosError<ErrorResponse>) => {
       const message =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong";

      toast.error(message);
    },
  });
};

export default useUpdateUserProfile;
