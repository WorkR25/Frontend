import { userServiceApi } from "@/lib/axios.config";
import { GetUserResponseType } from "@/types/GetUserResponseType";
import { useQuery } from "@tanstack/react-query";

const useGetUser = (authJwtToken: string | null) => {
  const time = new Date(); 
  console.log(":token", authJwtToken, time)
  return useQuery({
    queryKey: ["userDetails", authJwtToken ?? ""],
    queryFn: () => {
      return getUserDetils(authJwtToken);
    },
    enabled: !!authJwtToken,
    refetchOnWindowFocus: false, 

  });
};

const getUserDetils = async (authJwtToken: string | null) => {
  try {
    const response = await userServiceApi.get("/users", {
      headers: {
        Authorization: authJwtToken,
      },
    });
    return response.data.data as GetUserResponseType;
  } catch (error) {
    throw error;
  }
};

export default useGetUser ;