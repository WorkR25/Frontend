import { jobServiceApi } from "@/lib/axios.config";
import { JobListResponse, JobListTab } from "@/types/GetJobType";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export type ExploreJobsParams = {
  page: number;
  limit: number;
  company?: string;
  companyId?: number;
  tab?: JobListTab;
  /** Ask the server for per-tab totals (used by the quick-filter tabs). */
  counts?: boolean;
};

const useExploreJobs = (authJwtToken: string, params: ExploreJobsParams, enabled = true) => {
  return useQuery<JobListResponse>({
    queryKey: [
      "exploreJobs",
      params.page,
      params.limit,
      params.company ?? "",
      params.companyId ?? 0,
      params.tab ?? "all",
      !!params.counts,
    ],
    queryFn: () => getExploreJobs(authJwtToken, params),
    placeholderData: keepPreviousData,
    refetchInterval: 30 * 60 * 1000, // 30 mins
    enabled,
  });
};

const getExploreJobs = async (
  authJwtToken: string,
  { page, limit, company, companyId, tab, counts }: ExploreJobsParams,
): Promise<JobListResponse> => {
  const response = await jobServiceApi.get("/jobs/pages", {
    params: {
      page,
      limit,
      ...(company ? { company } : {}),
      ...(companyId ? { companyId } : {}),
      ...(tab && tab !== "all" ? { tab } : {}),
      ...(counts ? { counts: true } : {}),
    },
    headers: { Authorization: authJwtToken },
  });
  return response.data.data as JobListResponse;
};

export default useExploreJobs;
