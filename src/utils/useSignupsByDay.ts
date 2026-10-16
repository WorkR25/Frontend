import { userServiceApi } from "@/lib/axios.config";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export type SignupDayType = {
  /** Indian calendar day, YYYY-MM-DD */
  date: string;
  total: number;
  students: number;
  workingProfessionals: number;
};

export type SignupsByDayType = {
  timezone: string;
  /** Newest first: index 0 is today. Days with no sign-ups are included with zeros. */
  days: SignupDayType[];
};

const getSignupsByDay = async (authJwtToken: string | null, days: number): Promise<SignupsByDayType> => {
  const response = await userServiceApi.get(`/users/signups/daily?days=${days}`, {
    headers: { Authorization: authJwtToken },
  });
  return response.data.data;
};

/** Job-seeker sign-ups per day for the last `days` days (admin only). */
const useSignupsByDay = (authJwtToken: string | null, days: number) =>
  useQuery({
    queryKey: ["signupsByDay", authJwtToken ?? "", days],
    queryFn: () => getSignupsByDay(authJwtToken, days),
    enabled: !!authJwtToken,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

export default useSignupsByDay;
