// store/features/account/accountSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "https://keen-edu.com/backend/api";

export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    deleteAccount: builder.mutation<
      { message: string },
      { phone: string; password: string }
    >({
      query: (body) => ({
        url: "/account/delete",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useDeleteAccountMutation } = accountApi;
