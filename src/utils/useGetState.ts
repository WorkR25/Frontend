import { userServiceApi } from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";

const useGetState = (authJwtToken: string | null, stateName: string | undefined) => {
  return useQuery({
    queryKey: ["city", stateName ?? ""],
    queryFn: () => {
      return getState(authJwtToken, stateName);
    },
    enabled: !!authJwtToken,
    refetchOnWindowFocus: false, 
  });
};

const getState = async (authJwtToken: string | null, stateName: string | undefined) => {
  try {
    if(!stateName){
      return [];
    }
    const response = await userServiceApi.get("/state?name="+ stateName, {
      headers: {
        Authorization: authJwtToken,
      },
    });
    
    return response.data?.data;
  } catch (error) {
    throw error;
  }
};

export default useGetState ;