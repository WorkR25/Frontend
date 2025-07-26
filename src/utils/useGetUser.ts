import { api } from "@/lib/axios.config";
import { GetUserResponseType } from "@/types/GetUserResponseType";
import { useQuery } from "@tanstack/react-query";


export const useGetUser = (authJwtToken: string | null) => {
  return useQuery({
    queryKey: ["userDetails"],
    queryFn: () => {
      return getUserDetils(authJwtToken);
    },
    enabled: !!authJwtToken,
  });
};

const getUserDetils = async (authJwtToken: string | null) => {
  const response = await api.get("/users", {
    headers: {
      Authorization: authJwtToken,
    },
  });
  
  return response.data.data as GetUserResponseType;
};
