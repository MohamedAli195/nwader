// services/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import Base_URL from "../url";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({

    baseUrl: Base_URL,



  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/admin/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // حفظ التوكن في الكوكيز
          Cookies.set("token", data.token, {
            expires: 14,
            secure: true,
            sameSite: "strict",
          });
        } catch (error) {
          console.error("فشل حفظ التوكن في الكوكيز:", error);
        }
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
