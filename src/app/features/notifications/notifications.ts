// store/featchers/notifications/notificationsSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";

export interface NotificationData {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: {
    message: string;
    user_type?: string;
    user_id?: number;
    action_url?: string;
    booking_id?: number;
    student_id?: number;
    teacher_id?: number;
  };
  read_at: string | null;
  created_at: string;
}
const BASE_URL = "https://keen-edu.com/backend/api"; // triggers the proxy
export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.access_token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        // Do not manually set Content-Type for FormData
      }
      headers.set("Accept", "application/json");

      return headers;
    },
  }),

  endpoints: (builder) => ({
    getNotifications: builder.query<{ data: NotificationData[] }, void>({
      query: () => "admin/notifications",
    }),
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: "admin/notifications/mark-all-as-read",
        method: "POST",
      }),
    }),
    markAsRead: builder.mutation({
      query: (id: string) => ({
        url: `/admin/notifications/${id}/mark-as-read`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} = notificationsApi;
