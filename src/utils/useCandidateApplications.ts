import { jobServiceApi } from "@/lib/axios.config";
import { useAppSelector } from "@/lib/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";

export type CandidateApplicationType = {
  application_id: number;
  candidate_id: number;
  job_id: number;
  company_id: number | null;
  company_name: string | null;
  company_logo: string | null;
  job_title: string | null;
  applied_at: string;
};

export type CandidateApplicationsPage = {
  candidate_id: number;
  total_applications: number;
  applications: CandidateApplicationType[];
  pagination: {
    current_page: number;
    limit: number;
    total_pages: number;
    has_next_page: boolean;
    has_previous_page: boolean;
  };
};

export const APPLICATIONS_PAGE_SIZE = 10;

const getCandidateApplications = async (
  authJwtToken: string | null,
  candidateId: number,
  page: number,
): Promise<CandidateApplicationsPage> => {
  const response = await jobServiceApi.get(
    `/applications/candidate/${candidateId}/history?page=${page}&limit=${APPLICATIONS_PAGE_SIZE}`,
    { headers: { Authorization: authJwtToken } },
  );
  return response.data.data;
};

/**
 * One candidate's job applications, newest first (GET /applications/candidate/:id/history).
 * The first page also carries `total_applications`, so the same request feeds the count chip in the
 * list and the expanded list of jobs; "Show more" fetches the next page.
 */
const useCandidateApplications = (candidateId: number, enabled = true) => {
  const authJwtToken = useAppSelector((state) => state.authJwtToken.value);
  return useInfiniteQuery({
    queryKey: ["candidateApplications", authJwtToken ?? "", candidateId],
    queryFn: ({ pageParam }) => getCandidateApplications(authJwtToken, candidateId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.pagination.has_next_page ? last.pagination.current_page + 1 : undefined),
    enabled: enabled && !!authJwtToken && Number.isInteger(candidateId) && candidateId > 0,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
    retry: 1,
  });
};

export default useCandidateApplications;
