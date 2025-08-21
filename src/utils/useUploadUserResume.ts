import { userServiceApi } from "@/lib/axios.config";
import { useMutation } from "@tanstack/react-query";

const useUploadUserResume = () => {
  return useMutation({
    mutationFn: async ({ file, authJwtToken }: { authJwtToken: string | null; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      console.log("file", file);
      try {
        const response = await userServiceApi.post(
          "/users/upload-resume",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${authJwtToken}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
};

export default useUploadUserResume;
