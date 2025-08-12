import { userServiceApi } from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";

const useGetCity = (authJwtToken: string | null, cityName: string | undefined) => {
  return useQuery({
    queryKey: ["city", cityName],
    queryFn: () => {
      return getCity(authJwtToken, cityName);
    },
    enabled: !!authJwtToken,
  });
};

const getCity = async (authJwtToken: string | null, cityName: string | undefined) => {
  try {
    if(!cityName){
      return [];
    }
    const response = await userServiceApi.get("/city?city="+ cityName, {
      headers: {
        Authorization: authJwtToken,
      },
    });
    console.log(response.data.data);
    
    return response.data?.data;
  } catch (error) {
    throw error;
  }
};

export default useGetCity ;