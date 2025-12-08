import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Base_URL from "../url";



interface Ires {
  token: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: Base_URL,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<Ires, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/admin/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
