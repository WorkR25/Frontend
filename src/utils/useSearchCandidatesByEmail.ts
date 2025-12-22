import { userServiceApi } from "@/lib/axios.config";
import { GetUserResponseType } from "@/types/GetUserResponseType";
import { useQuery } from "@tanstack/react-query";

const useSearchCandidatesByEmail = (authJwtToken: string, email: string) => {
  return useQuery({
    queryKey: ["searchCandidatesByEmail", email],
    queryFn: () => searchCandidatesByEmail(authJwtToken, email),
    enabled: authJwtToken.length > 0 && email.trim().length > 0,
    refetchOnWindowFocus: false,
  });
};

async function searchCandidatesByEmail(authJwtToken: string, email : string) {
  const response = await userServiceApi.get(
    `/users/search/email?email=${encodeURIComponent(email)}`,
    {
      headers: {
        Authorization: authJwtToken,
      },
    }
  );

  return response.data.data as GetUserResponseType;
}
export default useSearchCandidatesByEmail;