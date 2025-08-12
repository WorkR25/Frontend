import { jobServiceApi } from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";

const useGetJobTitle = (authJwtToken: string | null, titleName: string | null) => {
  return useQuery({
    queryKey: ["jobTitles", titleName],
    queryFn: () => {
      return getJobTitle(authJwtToken, titleName);
    },
    enabled: !!authJwtToken,
  });
};

const getJobTitle = async (authJwtToken: string | null, titleName: string | null) => {
  try {
    console.log("titleName", titleName)
    if(!titleName){
      return []
    }
    const response = await jobServiceApi.get("/job-title?name="+ titleName, {
      headers: {
        Authorization: authJwtToken,
      },
    });
    console.log("job-title",response.data.data);
    
    return response.data?.data;
  } catch (error) {
    throw error;
  }
};

export default useGetJobTitle ;