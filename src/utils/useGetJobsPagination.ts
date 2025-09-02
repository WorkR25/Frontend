import { setTotalJobPages } from "@/features/jobPageNumber/jobPageNumberSlice"
import { jobServiceApi } from "@/lib/axios.config"
import { Job } from "@/types/GetJobType"
import { Dispatch, UnknownAction } from "@reduxjs/toolkit"
import { useQuery } from "@tanstack/react-query"
import { useDispatch } from "react-redux"

const useGetJobPagination= (authJwtToken: string , page: number , limit: number ) => {
    const dispatch = useDispatch() ;
    return useQuery<Job[]>({
        queryKey: ['jobListPage', `${page}`, `${limit}`],
        queryFn: () => {
            return getJobPagination({authJwtToken, page, limit, dispatch})
        },
        enabled: !!authJwtToken,
        refetchInterval: 30*60*1000 // 30 mins 
    })
}

const getJobPagination= async ({authJwtToken, page, limit, dispatch}: { authJwtToken: string , page: number , limit: number,  dispatch: Dispatch<UnknownAction> })=>{
    try {
        const response = await jobServiceApi.get(`/jobs/pages?page=${page}&limit=${limit}`, {
          headers: {
            Authorization: authJwtToken,
          },
        });
        dispatch(setTotalJobPages(response.data.data.pagination.totalPages))
        return response.data.data.records as Job[];
      } catch (error) {
        throw error;
      }
}

export default useGetJobPagination ;