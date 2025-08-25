import { UserProfileFormValues } from "@/components/me/UserProfileForm";
import { userServiceApi } from "@/lib/axios.config";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

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
        currentCtc:
          userProfileData.currentCtc?.trim() === ""
            ? 0
            : Number(userProfileData.currentCtc),

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

        currentCompanyId: userProfileData.currentCompanyId
          ? Number.isNaN(Number(userProfileData.currentCompanyId))
            ? 0
            : Number(userProfileData.currentCompanyId)
          : undefined,
      };

      console.log(
        userProfileData.currentCompanyId && {
          currentCompanyId: Number.isNaN(
            Number(userProfileData.currentCompanyId)
          )
            ? 0
            : Number(userProfileData.currentCompanyId),
        }
      );
      console.log(
        Number.isNaN(Number(userProfileData.currentCompanyId))
          ? 0
          : Number(userProfileData.currentCompanyId)
      );
      console.log(payload);

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

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error updating profile");
      } else {
        toast.error("Error updating profile");
      }
    },
  });
};

export default useUpdateUserProfile;
