import { configureStore } from '@reduxjs/toolkit'
import isSidebarOpenReducer from '../features/isSidebarOpen/isSidebarOpenSlice'
import mainMenuCollapsed from '../features/mainMenuCollapsed/mainMenuCollapsed'
import otherMenuCollapsed from '../features/otherMenuCollapsed/otherMenuCollapsedSlice'
import authJwtToken from '../features/authJwtToken/authJwtTokenSlice'
import jobId from '../features/jobId/jobId'
import jobDetails from '../features/jobDetails/jobDetails'
import showJobCreateForm from '../features/showJobCreateForm/showJobCreateForm'
import showJobUpdateForm from '../features/showJobUpdateForm/showJobUpdateForm'


export const store= configureStore({
  reducer: {
    isSidebarOpen: isSidebarOpenReducer,
    mainMenuCollapsed: mainMenuCollapsed,
    otherMenuCollapsed: otherMenuCollapsed,
    authJwtToken: authJwtToken,
    jobId: jobId,
    jobDetails: jobDetails,
    showJobCreateForm: showJobCreateForm,
    showJobUpdateForm: showJobUpdateForm,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch