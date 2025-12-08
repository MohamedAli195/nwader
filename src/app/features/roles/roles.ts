import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
// import BASE_URL from "../../Url";
// import { IPermissions } from "../permissions/permissions";
import Base_URL from "../../url";
export interface IRole {
  id?: number;
  name: string;
   permissions: string[]
;
}
export interface IRoleResponse {
  code: number;
  message: string;
  status: boolean;
  data: IRole;
}
export interface IRolesListResponse {
  code: number;
  message: string;
  status: boolean;

    data: IRole[];
   
  
  meta:{
    current_page: number;
last_page: number;
per_page: number;
total: number;
  }
}



export const roleApi = createApi({
  reducerPath: "roleApi",

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

  tagTypes: ["roles"],

  endpoints: (builder) => ({
    // 👇 get all Roles
    getRoles: builder.query<IRolesListResponse, number>({
      query: (per=10) => `/roles?per_page=${per}`,
      providesTags: ["roles"],
    }),

    // 👇 get one
    getRole: builder.query<IRoleResponse, number>({
      query: (id) => `/roles/${id}`,
      providesTags: ["roles"],
    }),

    // 👇 create
    createRole: builder.mutation<IRoleResponse, FormData>({
      query: (body) => ({
        url: "/roles",
        method: "POST",
        body,
      }),
      invalidatesTags: ["roles"],
    }),

    // 👇 update
    updateRole: builder.mutation<
      IRoleResponse,
      { id: number | undefined; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/roles/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["roles"],
    }),

    // 👇 delete
    deleteRole: builder.mutation<IRoleResponse, number | undefined>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["roles"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
