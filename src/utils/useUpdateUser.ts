import { userServiceApi } from "@/lib/axios.config";
import { UpdateProfileSchema } from "@/schema/updateProfile.validator";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

type UpdateProfileType = z.infer<typeof UpdateProfileSchema>;

const useUpdateUser = () => {
  return useMutation({
    mutationFn: async ({
      userDirty,
      userProfileDirty,
      authJwtToken,
      data,
      id,
    }: {
      userDirty: boolean;
      userProfileDirty: boolean;
      authJwtToken: string | null;
      data: UpdateProfileType;
      id: string;
    }) => {
      const { linkedinUrl, currentCtc, yearsOfExperience, ...rest } = data;
      if (userDirty) {
        console.log("user dirty", )
        await userServiceApi.put(
          `/users/update-profile/${id}`,
          {
            currentCtc: currentCtc === "" ? 0 : Number(currentCtc),
            yearsOfExperience:
              yearsOfExperience === "" ? 0 : Number(yearsOfExperience),
            ...rest,
            ...(linkedinUrl && { linkedinUrl }),
          },
          {
            headers: {
              Authorization: `${authJwtToken}`,
            },
          }
        );
      }
      if(userProfileDirty){
        console.log("userProfileDirty")
        await userServiceApi.put(
        `/users/update/${id}`,
        {
          ...rest,
        },
        {
          headers: {
            Authorization: `${authJwtToken}`,
          },
        }
      );
      }
      console.log("user profile");
      return true;
    },
  });
};

export default useUpdateUser;
