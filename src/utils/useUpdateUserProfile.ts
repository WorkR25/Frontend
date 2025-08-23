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
        yearsOfExperience:
          userProfileData.yearsOfExperience === null ||
          userProfileData.yearsOfExperience === undefined ||
          userProfileData.yearsOfExperience === (0)
            ? 0
            : Number(userProfileData.yearsOfExperience),
        // Only include linkedinUrl if not empty
        ...(userProfileData.linkedinUrl && {
          linkedinUrl: userProfileData.linkedinUrl,
        }),
      };

      // send to API
      await userServiceApi.put(`/users/update-profile/${id}`, payload, {
        headers: {
          Authorization: `${authJwtToken}`,
        },
      });
    },
    onSuccess: ()=>{
      toast.success("Profile updated successfully")
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
