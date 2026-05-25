import { userServiceApi } from "@/lib/axios.config";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const useUploadUserResume = () => {
  return useMutation({
    mutationFn: async ({ file, authJwtToken }: { authJwtToken: string | null; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
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
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Error uploading resume");
      } else {
        toast.error("Error uploading resume");
      }
    },
    onSuccess: () => {
      toast.success("Resume uploaded");
    },
  });
};

export default useUploadUserResume;
