import { userServiceApi } from "@/lib/axios.config";
import { SignUpFormSchema } from "@/schema/signUp.validator";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
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
    onError: () => {
      toast.error("Signup failed. Please check your details.");
    },
    onSuccess: (data) => {
      const jwtToken = data.data;
      localStorage.setItem("AuthJwtToken", jwtToken);
    },
  });

export default useSignup;
