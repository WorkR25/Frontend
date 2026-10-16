import { userServiceApi } from "@/lib/axios.config";
import { NurtureLeadsPage, NurtureLeadStatus, NurtureMatch, NurtureSummaryType } from "@/types/NurtureLeadsType";
import { DeliveryStatus } from "@/types/NurtureStatusType";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

export type NurtureLeadsParams = {
  day: number;
  match: NurtureMatch;
  status?: NurtureLeadStatus;
  delivery?: DeliveryStatus;
  search?: string;
};

const toQuery = (params: NurtureLeadsParams, extra: Record<string, string | number>) => {
  const query = new URLSearchParams({ day: String(params.day), match: params.match });
  if (params.status) query.set("status", params.status);
  if (params.delivery && params.match !== "next") query.set("delivery", params.delivery);
  if (params.search) query.set("search", params.search);
  Object.entries(extra).forEach(([key, value]) => query.set(key, String(value)));
  return query.toString();
};

/** One page of the working professionals in the nurture for a day (admin only). */
export const useNurtureLeads = (authJwtToken: string | null, params: NurtureLeadsParams, page: number, limit: number) =>
  useQuery<NurtureLeadsPage>({
    queryKey: ["nurtureLeads", authJwtToken ?? "", params.day, params.match, params.status ?? "", params.delivery ?? "", params.search ?? "", page, limit],
    queryFn: async () => {
      const response = await userServiceApi.get(`/users/nurture-leads?${toQuery(params, { page, limit })}`, {
        headers: { Authorization: authJwtToken },
      });
      return response.data.data;
    },
    enabled: !!authJwtToken,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

/** How many people sit at each nurture day (optionally only those of one status). */
export const useNurtureSummary = (authJwtToken: string | null, status?: NurtureLeadStatus) =>
  useQuery<NurtureSummaryType>({
    queryKey: ["nurtureLeadsSummary", authJwtToken ?? "", status ?? ""],
    queryFn: async () => {
      const response = await userServiceApi.get(`/users/nurture-leads/summary${status ? `?status=${status}` : ""}`, {
        headers: { Authorization: authJwtToken },
      });
      return response.data.data;
    },
    enabled: !!authJwtToken,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

/** Downloads every match of the current filters (not just the visible page) as a CSV. */
export const useDownloadNurtureLeadsCsv = (authJwtToken: string | null, params: NurtureLeadsParams) =>
  useMutation({
    mutationFn: async () => {
      const response = await userServiceApi.get(`/users/nurture-leads?${toQuery(params, { format: "csv" })}`, {
        responseType: "blob",
        headers: { Authorization: authJwtToken },
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "text/csv;charset=utf-8;" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `nurture-day-${params.day}-leads.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      return true;
    },
  });
