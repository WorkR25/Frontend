import { api } from "@/lib/axios.config";
import { SignUpFormSchema } from "@/schema/signUp.validator";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

type FormValues = z.infer<typeof SignUpFormSchema>;

const useSignup = () =>
  useMutation({
    mutationFn: async (signupData: FormValues) => {
      const response = await api.post("/auth/register", signupData);
      return response.data;
    },
    onError: (error) => {
      console.error("Signup error:", error);
    },
    onSuccess: (data) => {
      const jwtToken = data.data;
      localStorage.setItem("AuthJwtToken", jwtToken);
    },
  });

export default useSignup;
