/* eslint-disable @typescript-eslint/no-unused-vars */
import { isSidebarOpenToogle } from "@/features/isSidebarOpen/isSidebarOpenSlice";
import { setShowAddLocationForm } from "@/features/showAddLocationForm/showAddLocationFormSlice";
import { setShowAddSkillsForm } from "@/features/showAddSkillsForm/showAddSkillsFormSlice";
import { setShowCreateCompanyForm } from "@/features/showCreateCompanyForm/showCreateCompanyFormSlice";
import { setShowEditSkills } from "@/features/showEditSkils/showEditSkillsSlice";
import { toogleShowJobCreateForm } from "@/features/showJobCreateForm/showJobCreateForm";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type OnClickFnType = (
    
  dispatch: Dispatch<UnknownAction>,
  router: AppRouterInstance,
  link: string | null
) => void;

export const onClickOverview: OnClickFnType = (dispatch, router, link) => {
  dispatch(isSidebarOpenToogle(false));
  router.replace(`/dashboard/${link}`);
};

export const onClickExploreJob: OnClickFnType = (dispatch, router, link) => {
  router.replace(`/dashboard/${link}`);
  dispatch(isSidebarOpenToogle(false));

};

export const onClickCreateJob: OnClickFnType = (dispatch) => {
  dispatch(toogleShowJobCreateForm());
  dispatch(isSidebarOpenToogle(false));

};

export const onClickAllJobs: OnClickFnType = (dispatch, router, link) => {
  router.replace(`/dashboard/${link}`);
  dispatch(isSidebarOpenToogle(false));
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

//                     dispatch(isSidebarOpenToogle(false));
// {() => {
//                     setMainMenuActiveTab(index);
//                     if (index != 2) {
//                       router.replace(`/dashboard/${tab.link}`);
//                     } else {
//                       dispatch(toogleShowJobCreateForm());
//                     }
//                   }}
