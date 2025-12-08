import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import Base_URL from "../../url";
export interface IAdmins {
  id?: number | undefined;
  name: string;
  username: string;
  email: string;
  password?: string;
role : string[];
}
export interface ICreateAdminPayload {
  name: string;
  username:string
  email: string;
  password: string;
  roles: string[];
}

// const BASE_URL = "https://api.almajd-company.com/public/api"; // triggers the proxy

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: IAdmins[];
   meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
interface IresAdminsForStore {
  code: number;
  message: string;
  status: boolean;
  data: IAdmins[] | undefined;
}
interface IOneCategoryres {
  code: number;
  message: string;
  status: boolean;
  data: IAdmins;
}
interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: IAdmins;
}

export const adminsApi = createApi({
  reducerPath: "adminsApi",
    baseQuery: fetchBaseQuery({
      baseUrl: Base_URL,
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        headers.set("Accept", "application/json");
  
        return headers;
      },
    }),
  tagTypes: ["Admins"], // ✅ Define tag type
  endpoints: (builder) => ({
    getAdmins: builder.query<Ires, { search?: string; per_page: number }>({
      query: ({ search = "", per_page = 15 }) => {
        const params = new URLSearchParams();
        params.append("per_page", per_page.toString());
        if (search) params.append("search", search);
        return `/users?${params.toString()}`;
      },
      providesTags: ["Admins"],
    }),

    getAdminsByStoreID: builder.query<IresAdminsForStore, string | undefined  >({
      query: (id) => {
   
        return `/users/${id}`;
      },
      providesTags: ["Admins"],
    }),

    //     query: (id) => ({
         
    // return `/admins/${id}`
    //    }),
    //     invalidatesTags: ["Admins"],
    //   }
    // ),

    getAdmin: builder.query<IOneCategoryres, number>({
      query: (id) => {
        return `/admins/${id}`;
      },
      providesTags: ["Admins"],
    }),
    //Example: createCategory mutation (to show how to invalidate)
    createAdmin: builder.mutation<IresPost, ICreateAdminPayload>({
      query: (FormData) => ({
        url: `/users`,
        method: "POST",
        body: FormData,
      }),
      invalidatesTags: ["Admins"], // ✅ Invalidate tag to refetch list
    }),
    deleteAdmin: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admins"],
    }),
    updateAdmin: builder.mutation<IresPost, { id: number | undefined; data: ICreateAdminPayload }>(
      {
        query: ({ id, data }) => ({
          url: `/users/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: ["Admins"],
      }
    ),
  }),
});

export const {
  useGetAdminQuery,
  useGetAdminsQuery,
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useUpdateAdminMutation,
  useGetAdminsByStoreIDQuery
} = adminsApi;
