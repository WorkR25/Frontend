import { userServiceApi } from "@/lib/axios.config";
import { useMutation } from "@tanstack/react-query";

export function useDownloadCandidatesCsv({jwtToken, details}: {jwtToken: string, details: string}) {
  return useMutation({
    mutationFn: () => downloadCSV({ jwtToken, details })
  });
}

const downloadCSV = async ({jwtToken, details}: {jwtToken: string, details: string}) => {
  const res = await userServiceApi.get("/users/all-candiates/csv?details=" + details, {
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
  a.download = "candidates.csv";
  a.click();

  window.URL.revokeObjectURL(url);

  return true ;
};
