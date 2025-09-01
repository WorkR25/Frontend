import { OptionType } from "@/components/createJob/CreateJobForm";
import { userServiceApi } from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";

const useGetSkill = (authJwtToken: string | null, skillName: string | null) => {
  return useQuery({
    queryKey: ["skills", skillName ?? ""],
    queryFn: () => {
      return getSkill(authJwtToken, skillName);
    },
    enabled: !!authJwtToken,
    refetchOnWindowFocus: false, 

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
    return response.data?.data as OptionType[] ;
  } catch (error) {
    throw error;
  }
};

export default useGetSkill ;