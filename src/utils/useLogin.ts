import { api } from "@/lib/axios.config";
import { LogInFormSchema } from "@/schema/logIn.validator";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

type FormValues = z.infer<typeof LogInFormSchema>;

const useLogin = () =>
  useMutation({
    mutationFn: async (logInData: FormValues) => {
      try {
        const response = await api.post("/auth/login", logInData);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onError: (error) => {
      console.log("Login error:", error);
    },
    onSuccess: (data) => {
      const jwtToken = data.data;

      localStorage.setItem("AuthJwtToken", String(jwtToken));
    },
  });

export default useLogin;
