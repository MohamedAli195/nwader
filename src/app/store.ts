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
import { EduSystemsApi } from "./features/EduSystems/EduSystemsSlice";
import { AcademicStagesApi } from "./features/academicStages/academicStagesSlice";
import { AcademicYearsApi } from "./features/academicYears/academicYearsSlice";
import AcademicClassesApi from "./features/academicClasses/academicClassesSlice";
import { academicStudentApi } from "./features/academicStudent/academicStudentApi";
import { academicBookingApi } from "./features/academicBooking/academicBookingApi";
import TeacherApi from "./features/teachers/teachersSlice";
import newsApi from "./features/News/newsSlice";
import dashStatisticsApi from "./features/dashboeardStatistics/dashStatistics";
import complaintsApi from "./features/complaints/complaintsSlice";
import inquiriesApi from "./features/inquiries/inquiriesSlice";
import { notificationsApi } from "./features/notifications/notifications";
import { EducationalInformationApi } from "./features/EducationsalInfo/educationalInfo";
import { SchoolsApi } from "./features/schools/schoolsApi";
import { TuitionDiscountsApi } from "./features/TuitionDiscounts/TuitionDiscountsApi";
import { roleApi } from "./features/roles/roles";
import { adminsApi } from "./features/Admins/AdminsSlice";
import { PermissionsApi } from "./features/permissions/permissions";

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
    [EduSystemsApi.reducerPath]: EduSystemsApi.reducer,
    [AcademicStagesApi.reducerPath]: AcademicStagesApi.reducer,
    [AcademicYearsApi.reducerPath]: AcademicYearsApi.reducer,
    [AcademicClassesApi.reducerPath]: AcademicClassesApi.reducer,
    [academicStudentApi.reducerPath]: academicStudentApi.reducer,
    [academicBookingApi.reducerPath]: academicBookingApi.reducer,
    [TeacherApi.reducerPath]: TeacherApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [dashStatisticsApi.reducerPath]: dashStatisticsApi.reducer,
    [complaintsApi.reducerPath]: complaintsApi.reducer,
    [inquiriesApi.reducerPath]: inquiriesApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [EducationalInformationApi.reducerPath]: EducationalInformationApi.reducer,
    [SchoolsApi.reducerPath]: SchoolsApi.reducer,
    [TuitionDiscountsApi.reducerPath]: TuitionDiscountsApi.reducer,
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
      EduSystemsApi.middleware,
      AcademicStagesApi.middleware,
      AcademicYearsApi.middleware,
      AcademicClassesApi.middleware,
      academicStudentApi.middleware,
      academicBookingApi.middleware,
      TeacherApi.middleware,
      newsApi.middleware,
      dashStatisticsApi.middleware,
      complaintsApi.middleware,
      inquiriesApi.middleware,
      notificationsApi.middleware,
      EducationalInformationApi.middleware,
      SchoolsApi.middleware,
      TuitionDiscountsApi.middleware,
      roleApi.middleware,
      adminsApi.middleware,
      PermissionsApi.middleware,
    ),
});

// ✅ Step 3: Create persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
