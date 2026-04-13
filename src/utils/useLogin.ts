import { setAuthJwtToken } from "@/features/authJwtToken/authJwtTokenSlice";
import { userServiceApi } from "@/lib/axios.config";
import { LogInFormSchema } from "@/schema/logIn.validator";
import { ErrorResponse } from "@/types/ErrorResponse";
import { useMutation } from "@tanstack/react-query";
import  { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
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
    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong";

      toast.error(message);
    },
    onSuccess: (data) => {
       const jwtToken = data.data;
       localStorage.setItem("AuthJwtToken", String(jwtToken));
       dispatch(setAuthJwtToken(jwtToken));
       toast.success(data.message || "Logged in successfully");
    },
  });
}

export default useLogin;
