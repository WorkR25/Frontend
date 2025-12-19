/* eslint-disable @typescript-eslint/no-unused-vars */
import { isSidebarOpenToogle } from "@/features/isSidebarOpen/isSidebarOpenSlice";
import { setLoginRequiredDialogBox } from "@/features/loginRequiredDialogBox/loginRequiredDialogBoxSlice";
import { setShowAddLocationForm } from "@/features/showAddLocationForm/showAddLocationFormSlice";
import { setShowAddSkillsForm } from "@/features/showAddSkillsForm/showAddSkillsFormSlice";
import { setShowAddTitleForm } from "@/features/showAddTitleForm/showAddTitleFormSlice";
import { setShowAllCandidates } from "@/features/showAllCandidates/showAllCandidatesSlice";
import { setShowCreateCompanyForm } from "@/features/showCreateCompanyForm/showCreateCompanyFormSlice";
import { setShowEditSkills } from "@/features/showEditSkils/showEditSkillsSlice";
import { toogleShowJobCreateForm } from "@/features/showJobCreateForm/showJobCreateForm";
import { setShowSearchCandidates } from "@/features/showSearchCandidates/showSearchCandidates";
import { setShowSearchCandidatesByEmail } from "@/features/showSearchCandidates/showSearchCandidatesByEmail";
import { setShowSearchCandidatesByName } from "@/features/showSearchCandidates/showSearchCandidatesByName";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { set } from "zod/v3";
import { is } from "zod/v4/locales";

type OnClickFnType = (
    
  dispatch: Dispatch<UnknownAction>,
  router: AppRouterInstance,
  link: string | null,
  isSuccess?: boolean,
) => void;

export const onClickSearchCandidatesByName: OnClickFnType = (dispatch, router, link, isSuccess) => {
  dispatch(isSidebarOpenToogle(false));
  dispatch(setShowSearchCandidatesByName(true))
  // router.replace(`/dashboard/${link}`);
}

export const onClickSearchCandidatesByEmail: OnClickFnType = (dispatch, router, link, isSuccess) => {
  dispatch(isSidebarOpenToogle(false));
  dispatch(setShowSearchCandidatesByEmail(true))
  // router.replace(`/dashboard/${link}`);
}

export const onClickOverview: OnClickFnType = (dispatch, router, link, isSuccess) => {
  dispatch(isSidebarOpenToogle(false));
  router.replace(`/dashboard/${link}`);
  // if(isSuccess){
  // }
  // else{
  //   dispatch(setLoginRequiredDialogBox(true))
  //   // router.replace(`/login`);
  // }
};

export const onClickAllCandidates: OnClickFnType = (dispatch, router, link, isSuccess) => {
  dispatch(setShowAllCandidates(true));
  dispatch(isSidebarOpenToogle(false));
}

export const onClickExploreJob: OnClickFnType = (dispatch, router, link, isSuccess) => {
  dispatch(isSidebarOpenToogle(false));
  router.push(`/dashboard/${link}`);
  // if(isSuccess){
  // }
  // else{
    // dispatch(setLoginRequiredDialogBox(true))
    // router.replace(`/login`);
  // }

};

export const onClickCreateJob: OnClickFnType = (dispatch) => {
  dispatch(toogleShowJobCreateForm());
  dispatch(isSidebarOpenToogle(false));

};

export const onClickAllJobs: OnClickFnType = (dispatch, router, link, isSuccess) => {
  dispatch(isSidebarOpenToogle(false));
  router.replace(`/dashboard/${link}`);
  // if(isSuccess){
  // }else{
  //   dispatch(setLoginRequiredDialogBox(true))
    // router.replace(`/login`);
  // }
};

export const onClickCreateCompany: OnClickFnType = (dispatch, router, link) => {
  dispatch(setShowCreateCompanyForm(true));
  dispatch(isSidebarOpenToogle(false));
};

export const onClickAddSKill: OnClickFnType = (dispatch, router, link) => {
  dispatch(setShowAddSkillsForm(true))
  dispatch(isSidebarOpenToogle(false));
};

export const onClickAddCity: OnClickFnType = (dispatch, router, link) => {
  dispatch(setShowAddLocationForm(true))
  dispatch(isSidebarOpenToogle(false));
};


export const onClickAddTitle: OnClickFnType = (dispatch, router, link) => {
  dispatch(setShowAddTitleForm(true))
  dispatch(isSidebarOpenToogle(false));
}
//                     dispatch(isSidebarOpenToogle(false));
// {() => {
//                     setMainMenuActiveTab(index);
//                     if (index != 2) {
//                       router.replace(`/dashboard/${tab.link}`);
//                     } else {
//                       dispatch(toogleShowJobCreateForm());
//                     }
//                   }}
