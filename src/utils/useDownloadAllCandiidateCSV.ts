import { userServiceApi } from "@/lib/axios.config";
import { useMutation } from "@tanstack/react-query";

export function useDownloadCandidatesCsv({jwtToken, details, date}: {jwtToken: string, details: string, date?: string}) {
  return useMutation({
    mutationFn: () => downloadCSV({ jwtToken, details, date })
  });
}

const downloadCSV = async ({jwtToken, details, date}: {jwtToken: string, details: string, date?: string}) => {
  const res = await userServiceApi.get("/users/all-candiates/csv?details=" + details + (date ? "&date=" + date : ""), {
    responseType: "blob",
    headers:{
      Authorization: jwtToken
    }
  });

  const blob = new Blob([res.data], {
    type: "text/csv;charset=utf-8;",
  });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = date ? `candidates-${date}.csv` : "candidates.csv";
  a.click();

  window.URL.revokeObjectURL(url);

  return true ;
};
