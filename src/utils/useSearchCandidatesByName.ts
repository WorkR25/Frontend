import { userServiceApi } from "@/lib/axios.config";
import { GetUserResponseType } from "@/types/GetUserResponseType";
import { useQuery } from "@tanstack/react-query";

const useSearchCandidatesByName = (authJwtToken: string, name: string, page: number, limit: number) => {
  return useQuery({
    queryKey: ["searchCandidatesByName", name, page, limit],
    queryFn: () => searchCandidatesByName(authJwtToken, name, page, limit),
    enabled: authJwtToken.length > 0 && name.trim().length > 0,
    refetchOnWindowFocus: false,
  });
};

async function searchCandidatesByName(authJwtToken: string, name: string, page: number, limit: number) {
  const response = await userServiceApi.get(
    `/users/search/name?name=${encodeURIComponent(name)}&page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: authJwtToken,
      },
    }
  );
  return response.data.data as { count: number, rows: GetUserResponseType[] };
}
export default useSearchCandidatesByName ;