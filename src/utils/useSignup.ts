import { userServiceApi } from "@/lib/axios.config";
import { SignUpFormSchema } from "@/schema/signUp.validator";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
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
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error occured while signing up");
      } else {
        toast.error("Error occured while signing up");
      }
    },
    onSuccess: (data) => {
      const jwtToken = data.data;
      localStorage.setItem("AuthJwtToken", jwtToken);
    },
  });

export default useSignup;
