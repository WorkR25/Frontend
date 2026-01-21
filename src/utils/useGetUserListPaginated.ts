import { userServiceApi } from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";

const useGetUserListPagination = (authJwtToken: string | null, page: number, limit: number, details: string) => {
  return useQuery({
    queryKey: ["useGetUserListPagination", authJwtToken ?? "", `${page}`, `${limit}`],
    queryFn: () => {
      return getUserListPagination(authJwtToken, page, limit, details );
    },
    enabled: !!authJwtToken,
    refetchOnWindowFocus: false, 

  });
};

const getUserListPagination = async (authJwtToken: string | null, page: number, limit: number, details: string) => {
  try {
    const response = await userServiceApi.get(`/users/pages?page=${page}&limit=${limit}&details=${details}`, {
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