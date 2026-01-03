import { userServiceApi } from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";

const useGetRoles = (authJwtToken: string | null, roleName: string | null) => {
  return useQuery({
    queryKey: ["getRoles", roleName],
    queryFn: () => {
      return getRoles(authJwtToken, roleName);
    },
    enabled: !!authJwtToken,
    refetchOnWindowFocus: false, 
  });
};

const getRoles = async (authJwtToken: string | null, roleName: string | null) => {
  try {
    if(!roleName || roleName.trim() === ""){
      return []
    }
    const response = await userServiceApi.get("/role?name="+ roleName, {
      headers: {
        Authorization: authJwtToken,
      },
    });
    
    return response.data?.data as {name: string, id: number}[];
  } catch (error) {
    throw error;
  }
};

export default useGetRoles; ;