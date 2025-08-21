import { setShowCreateCompanyForm } from "@/features/showCreateCompanyForm/showCreateCompanyFormSlice";
import { toogleShowJobCreateForm } from "@/features/showJobCreateForm/showJobCreateForm";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type OnClickFnType = (
    
  dispatch: Dispatch<UnknownAction>,
  router: AppRouterInstance,
  link: string | null
) => void;

export const onClickOverview: OnClickFnType = (dispatch, router, link) => {
  router.replace(`/dashboard/${link}`);
};

export const onClickExploreJob: OnClickFnType = (dispatch, router, link) => {
  router.replace(`/dashboard/${link}`);
};

export const onClickCreateJob: OnClickFnType = (dispatch) => {
  dispatch(toogleShowJobCreateForm());
};

export const onClickAllJobs: OnClickFnType = (dispatch, router, link) => {
  router.replace(`/dashboard/${link}`);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const onClickCreateCompany: OnClickFnType = (dispatch, router, link) => {
  dispatch(setShowCreateCompanyForm(true));
};

//                     dispatch(isSidebarOpenToogle(false));
// {() => {
//                     setMainMenuActiveTab(index);
//                     console.log("dashboard sidebar : ", index);
//                     if (index != 2) {
//                       router.replace(`/dashboard/${tab.link}`);
//                     } else {
//                       dispatch(toogleShowJobCreateForm());
//                     }
//                   }}
