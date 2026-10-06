import { userServiceApi } from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";

const useGetCountry = (authJwtToken: string | null, countryName: string | undefined) => {
  return useQuery({
    queryKey: ["country", countryName ?? ""],
    queryFn: () => {
      return getCountry(authJwtToken, countryName);
    },
    enabled: !!authJwtToken,
    refetchOnWindowFocus: false, 
  });
};

const getCountry = async (authJwtToken: string | null, countryName: string | undefined) => {
  try {
    if(!countryName){
      return [];
    }
    const response = await userServiceApi.get("/country?name="+ countryName, {
      headers: {
        Authorization: authJwtToken,
      },
    });
    
    return response.data?.data;
  } catch (error) {
    throw error;
  }
};

export default useGetCountry ;