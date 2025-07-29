import { configureStore } from '@reduxjs/toolkit'
import isSidebarOpenReducer from '../features/isSidebarOpen/isSidebarOpenSlice'
import mainMenuCollapsed from '../features/mainMenuCollapsed/mainMenuCollapsed'
import otherMenuCollapsed from '../features/otherMenuCollapsed/otherMenuCollapsedSlice'
import authJwtToken from '../features/authJwtToken/authJwtTokenSlice'

export const store= configureStore({
  reducer: {
    isSidebarOpen: isSidebarOpenReducer,
    mainMenuCollapsed: mainMenuCollapsed,
    otherMenuCollapsed: otherMenuCollapsed,
    authJwtToken: authJwtToken
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch