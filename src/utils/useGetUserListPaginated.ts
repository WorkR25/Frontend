import { userServiceApi } from "@/lib/axios.config";
import { useQuery } from "@tanstack/react-query";

const useGetUserListPagination = (authJwtToken: string | null, page: number, limit: number) => {
  return useQuery({
    queryKey: ["useGetUserListPagination", authJwtToken ?? ""],
    queryFn: () => {
      return getUserDetils(authJwtToken, page, limit );
    },
    enabled: !!authJwtToken,
    refetchOnWindowFocus: false, 

  });
};

const getUserDetils = async (authJwtToken: string | null, page: number, limit: number) => {
  try {
    const response = await userServiceApi.get(`/users/pages?page=${page}&limit=${limit}`, {
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