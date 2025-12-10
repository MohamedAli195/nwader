import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import Base_URL from "../../url";

export interface IAdminStatistics {
  data: {
    total_products: number;
    total_students: number;
    total_institutions: number;
    total_universities: number;
    total_schools: number;
    total_news: number;
    total_qr_scans: number;
    active_products: number;
    active_students: number;
  };
}

const BASE_URL = Base_URL;

export const dashStatisticsApi = createApi({
  reducerPath: "dashStatisticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Accept", "application/json");

      return headers;
    },
  }),

  tagTypes: ["AdminStatistics"],

  endpoints: (builder) => ({
    // ⭐ New Updated Endpoint
    getAdminStatistics: builder.query<IAdminStatistics, void>({
      query: () => `statistics`,
      providesTags: ["AdminStatistics"],
    }),
  }),
});

export const { useGetAdminStatisticsQuery } = dashStatisticsApi;

export default dashStatisticsApi;
