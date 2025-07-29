import { api } from "@/lib/axios.config";
import { LogInFormSchema } from "@/schema/logIn.validator";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

type FormValues = z.infer<typeof LogInFormSchema>;

const useLogin = () =>
  useMutation({
    mutationFn: async (logInData: FormValues) => {
      const response = await api.post("/auth/login", logInData);
      return response.data;
    },
    onError: (error) => {
      console.error("Signup error:", error);
    },
    onSuccess: (data) => {
      const jwtToken = data.data;

      localStorage.setItem("AuthJwtToken", String(jwtToken));
    },
  });

export default useLogin;
