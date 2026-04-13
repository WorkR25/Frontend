import { userServiceApi } from "@/lib/axios.config";
import { SignUpFormSchema } from "@/schema/signUp.validator";
import { ErrorResponse } from "@/types/ErrorResponse";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import z from "zod";

type FormValues = z.infer<typeof SignUpFormSchema>;

const useSignup = () =>
  useMutation({
    mutationFn: async (signupData: FormValues) => {
      try {
        const response = await userServiceApi.post("/auth/register", signupData);
      return response.data;
      } catch (error) {
        throw error ;
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
       const message =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong";

       toast.error(message);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Signed up successfully");
      const jwtToken = data.data;
      localStorage.setItem("AuthJwtToken", jwtToken);
    },
  });

export default useSignup;
