import { userServiceApi } from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";

const useGetUserRoles = (authJwtToken: string | null, userId: number | undefined ) => {
  return useQuery({
    queryKey: ["userDetails", userId],
    queryFn: () => {
      return getUserRoles(authJwtToken, String(userId));
    },
    enabled: !!authJwtToken,
  });
};

const getUserRoles = async (authJwtToken: string | null, userId: string | undefined) => {
  try {
    if(!userId){
        return [];
    }
    const response = await userServiceApi.get("/role/user/"+ userId, {
      headers: {
        Authorization: authJwtToken,
      },
    });
    return response.data.data as string[];
  } catch (error) {
    throw error;
  }
};

export default useGetUserRoles ;