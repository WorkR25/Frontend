import { jobServiceApi } from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";

const useFindJobTitle = (authJwtToken: string | null, title: string | null) => {
  return useQuery({
    queryKey: ["findJobTitle", title ?? ""],
    queryFn: () => findJobTitle(authJwtToken, title),
    enabled: !!authJwtToken,
    refetchOnWindowFocus: false,
  });
};

const findJobTitle = async (authJwtToken: string | null, title: string | null) => {
  try {
    if (!title) {
      return null;
    }
    const response = await jobServiceApi.get("/job-title/find-title?name=" + title, {
      headers: {
        Authorization: authJwtToken,
      },
    });
    return response.data?.data;
  } catch (error) {
    throw error;
  }
};

export default useFindJobTitle;
