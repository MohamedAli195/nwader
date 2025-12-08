import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";

// 🧩 Interfaces
export interface ISchoolBody {
  name: string;
  governorate?: string;
  type?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  is_active?: boolean;
}

export interface ISchool {
  id?: number;
  name: string;
  governorate: string;
  type: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IGetAllSchoolsResponse {
  data: ISchool[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface IOneSchoolResponse {
  code: number;
  message: string;
  status: boolean;
  data: ISchool;
}

export interface IPostSchoolResponse {
  code: number;
  message: string;
  status: boolean;
  data: ISchool;
}

// 🧠 Base URL
const BASE_URL = "https://keen-edu.com/backend/api/admin";

// 🚀 API Slice
export const SchoolsApi = createApi({
  reducerPath: "SchoolsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.access_token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Schools"],
  endpoints: (builder) => ({
    // 🔹 Get all schools
    getSchools: builder.query<IGetAllSchoolsResponse, { search?: string; page?: number }>({
      query: ({ search = "", page = 1 }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        if (search) params.append("search", search);
        return `/schools?${params.toString()}`;
      },
      providesTags: ["Schools"],
    }),

    // 🔹 Get one school by ID
    getSchoolById: builder.query<IOneSchoolResponse, number>({
      query: (id) => `/schools/${id}`,
      providesTags: ["Schools"],
    }),

    // 🔹 Create new school
    createSchool: builder.mutation<IPostSchoolResponse, ISchoolBody>({
      query: (body) => ({
        url: `/schools`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Schools"],
    }),

    // 🔹 Update school
    updateSchool: builder.mutation<
      IPostSchoolResponse,
      { id: number; body: Partial<ISchoolBody> }
    >({
      query: ({ id, body }) => ({
        url: `/schools/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Schools"],
    }),

    // 🔹 Delete school
    deleteSchool: builder.mutation<IPostSchoolResponse, number>({
      query: (id) => ({
        url: `/schools/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Schools"],
    }),
  }),
});

// 🧩 Export hooks
export const {
  useGetSchoolsQuery,
  useGetSchoolByIdQuery,
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
  useDeleteSchoolMutation,
} = SchoolsApi;
