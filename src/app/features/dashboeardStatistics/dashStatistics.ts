import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import Base_URL from "../../url";



interface IStatics {
   user_counts: {
        total_teachers: number,
        total_students: number,
        unconfirmed_teachers: number
    },
    activity_counts: {
        total_bookings: number
    },
    leaderboards: {
        most_booked_class: {
            class_id: number,
            class_name: string,
            booking_count: number
        },
        most_active_teacher: {
            teacher_id: number,
            booking_count: number,
            teacher: {
              id: number,
                name: string,
                image_path: null
            }
        }
    }
}

const BASE_URL = Base_URL; // triggers the proxy

// interface Ires {
//   code: number;
//   message: string;
//   status: boolean;
//   data: IStatics;
//   links: {
//     first: string;
//     second: string;
//   };
//   meta: {
//     current_page: number;
//     from: number;
//     last_page: number;
//     links: {
//       active: boolean;
//       label: string;
//       url: string;
//     }[];
//     path: string;
//     per_page: number;
//     to: number;
//     total: number;
//   };
// }



export const dashStatisticsApi = createApi({
  reducerPath: "dashStatisticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        // Do not manually set Content-Type for FormData
      }
      headers.set("Accept", "application/json");

      return headers;
    },
  }),
  tagTypes: ["dashStatistics"], // ✅ Define tag type
  endpoints: (builder) => ({
    getDashStatistics: builder.query<IStatics, void>({
      query: () => {

        return `/dashboard/statistics`;
      },
      providesTags: ["dashStatistics"],
    }),






 
  }),
});

export const {

  useGetDashStatisticsQuery,

} = dashStatisticsApi;

export default dashStatisticsApi;
