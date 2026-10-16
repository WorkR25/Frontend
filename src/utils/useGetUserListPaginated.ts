import { userServiceApi } from "@/lib/axios.config";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const useGetUserListPagination = (authJwtToken: string | null, page: number, limit: number, details: string, date?: string) => {
  return useQuery({
    queryKey: ["useGetUserListPagination", authJwtToken ?? "", details, `${page}`, `${limit}`, date ?? "all"],
    queryFn: () => {
      return getUserListPagination(authJwtToken, page, limit, details, date);
    },
    enabled: !!authJwtToken,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,

  });
};

/** `date` (YYYY-MM-DD, Indian calendar day) limits the list to people who signed up that day. */
const getUserListPagination = async (authJwtToken: string | null, page: number, limit: number, details: string, date?: string) => {
  try {
    const response = await userServiceApi.get(`/users/pages?page=${page}&limit=${limit}&details=${details}${date ? `&date=${date}` : ""}`, {
      headers: {
        Authorization: authJwtToken,
      },
    });
    return response.data.data ;
  } catch (error) {
    throw error;
  }
};

export default useGetUserListPagination ;