import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import { IStore } from "../stores/stores";
import { IPermissions } from "../permissions/permissions";
import BASE_URL from "../../Url";

export interface IAdmins {
  id?: number | undefined;
  name: string;
  email: string;
  password?: string;
  store: IStore;
  phone: string;
    permissions?: IPermissions[];
      work_start_time?: string;
  work_end_time?: string;
  work_days?: string[];
  base_salary?: string;
  hourly_rate?: string;
role : string[];
}
export interface ICreateAdminPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  store_id: string;
  roles: string[];
   base_salary: number;
  hourly_rate: number;
  work_start_time: string;
  work_end_time: string;
  work_days: string[];
}

// const BASE_URL = "https://api.almajd-company.com/public/api"; // triggers the proxy

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: { data: IAdmins[] | undefined; total: number | undefined };
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
  tagTypes: ["Admins"], // ✅ Define tag type
  endpoints: (builder) => ({
    getAdmins: builder.query<Ires, { search?: string; page: number }>({
      query: ({ search = "", page = 1 }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        if (search) params.append("search", search);
        return `/admins?${params.toString()}`;
      },
      providesTags: ["Admins"],
    }),

    getAdminsByStoreID: builder.query<IresAdminsForStore, string | undefined  >({
      query: (id) => {
   
        return `/admins/${id}`;
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
        url: `/admins`,
        method: "POST",
        body: FormData,
      }),
      invalidatesTags: ["Admins"], // ✅ Invalidate tag to refetch list
    }),
    deleteAdmin: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/admins/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admins"],
    }),
    updateAdmin: builder.mutation<IresPost, { id: number | undefined; data: ICreateAdminPayload }>(
      {
        query: ({ id, data }) => ({
          url: `/admins/${id}/update`,
          method: "POST",
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
