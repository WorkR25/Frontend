import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { userServiceApi } from "@/lib/axios.config";
import { LogInFormSchema } from "@/schema/logIn.validator";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import z from "zod";

type FormValues = z.infer<typeof LogInFormSchema>;

const useLogin = () =>{
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (logInData: FormValues) => {
      try {
        const response = await userServiceApi.post("/auth/login", logInData);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error occured while logging in");
      } else {
        toast.error("Error occured while logging in");
      }
    },
    onSuccess: (data) => {
      const jwtToken = data.data;
      localStorage.setItem("AuthJwtToken", String(jwtToken));
      dispatch(setAuthJwtToken(jwtToken));
    },
  });
}

export default useLogin;
