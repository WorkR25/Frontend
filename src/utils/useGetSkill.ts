import { userServiceApi } from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";

const useGetSkill = (authJwtToken: string | null, skillName: string | null) => {
  return useQuery({
    queryKey: ["skills", skillName],
    queryFn: () => {
      return getSkill(authJwtToken, skillName);
    },
    enabled: !!authJwtToken,
  });
};

const getSkill = async (authJwtToken: string | null, skillName: string | null) => {
  try {
    if(!skillName){
      return [];
    }
    const response = await userServiceApi.get("/skills?skill=" + skillName, {
      headers: {
        Authorization: authJwtToken,
      },
    });
    
    return response.data?.data;
  } catch (error) {
    throw error;
  }
};

export default useGetSkill ;