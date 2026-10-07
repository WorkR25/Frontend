import { jobServiceApi } from "@/lib/axios.config";
import { HiringCompany } from "@/types/GetJobType";
import { useQuery } from "@tanstack/react-query";

/** Companies with open jobs (and how many), optionally filtered by name. */
const useGetHiringCompanies = (name: string, limit = 8, enabled = true) => {
  return useQuery<HiringCompany[]>({
    queryKey: ["hiringCompanies", name, limit],
    queryFn: async () => {
      const response = await jobServiceApi.get("/jobs/companies", {
        params: { limit, ...(name ? { name } : {}) },
      });
      return (response.data?.data ?? []) as HiringCompany[];
    },
    staleTime: 5 * 60 * 1000,
    enabled,
    // Keep the previous search's results on screen while the next one loads, but never
    // carry over the unfiltered list (empty name) as if it were search results.
    placeholderData: (previous, previousQuery) => (previousQuery?.queryKey[1] ? previous : undefined),
  });
};

export default useGetHiringCompanies;
