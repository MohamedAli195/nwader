import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./features/languageSlice";
import authReducer from "./features/auth/authSlice";
import { authApi } from "./features/auth/authQuery";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
// import storage from 'redux-persist/lib/storage'; // uses localStorage
import cookieStorage from "../services/cookieStorage";

import { academicStudentApi } from "./features/academicStudent/academicStudentApi";

import newsApi from "./features/News/newsSlice";
import dashStatisticsApi from "./features/dashboeardStatistics/dashStatistics";
import complaintsApi from "./features/complaints/complaintsSlice";
import inquiriesApi from "./features/inquiries/inquiriesSlice";
import { notificationsApi } from "./features/notifications/notifications";

import productsApi from "./features/products/productsSlice";
import { roleApi } from "./features/roles/roles";
import { adminsApi } from "./features/Admins/AdminsSlice";
import { PermissionsApi } from "./features/permissions/permissions";
import { institutionApi } from "./features/institution/institutionApi";
import { qrApi } from "./features/qrApi/qrApi";
import reportsApi from "./features/reports/reportsApi";

const persistConfig = {
  key: "auth",
  storage: cookieStorage,
  whitelist: ["token"], // Only persist token or full reducer as needed
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// ✅ Step 2: Configure store
export const store = configureStore({
  reducer: {
    language: languageReducer,
    auth: persistedAuthReducer, // use persisted version
    [authApi.reducerPath]: authApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [institutionApi.reducerPath]: institutionApi.reducer,
    [qrApi.reducerPath]: qrApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [academicStudentApi.reducerPath]: academicStudentApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [dashStatisticsApi.reducerPath]: dashStatisticsApi.reducer,
    [complaintsApi.reducerPath]: complaintsApi.reducer,
    [inquiriesApi.reducerPath]: inquiriesApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [adminsApi.reducerPath]: adminsApi.reducer,
    [PermissionsApi.reducerPath]: PermissionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      productsApi.middleware,
      institutionApi.middleware,
      qrApi.middleware,
      reportsApi.middleware,
      academicStudentApi.middleware,
      newsApi.middleware,
      dashStatisticsApi.middleware,
      complaintsApi.middleware,
      inquiriesApi.middleware,
      notificationsApi.middleware,
      roleApi.middleware,
      adminsApi.middleware,
      PermissionsApi.middleware,
    ),
});

// ✅ Step 3: Create persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
