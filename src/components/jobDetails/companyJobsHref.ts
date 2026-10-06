/** Explore-jobs URL filtered to one company. */
export function companyJobsHref(companyName: string, companyId?: number) {
  const params = new URLSearchParams({ company: companyName });
  if (companyId) params.set("companyId", String(companyId));
  return `/dashboard/jobs?${params.toString()}`;
}
