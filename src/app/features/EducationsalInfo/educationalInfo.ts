import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";

// 🧩 Interfaces
export interface IEducationalInformationBody {
  title: string;
  content: string;
  type?: string;
  is_active?: boolean;
}

export interface IEducationalInformation {
  id?: number;
  title: string;
  content: string;
  type: string;
  educational_system_id: number;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IGetAllEducationalInformationResponse {
  data: IEducationalInformation[];
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

export interface IOneEducationalInformationResponse {
  code: number;
  message: string;
  status: boolean;
  data: IEducationalInformation;
}

export interface IPostEducationalInformationResponse {
  code: number;
  message: string;
  status: boolean;
  data: IEducationalInformation;
}

// 🧠 Base URL
const BASE_URL = "https://keen-edu.com/backend/api/admin";

// 🚀 API Slice
export const EducationalInformationApi = createApi({
  reducerPath: "EducationalInformationApi",
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
  tagTypes: ["EducationalInformation"],
  endpoints: (builder) => ({
    // 🔹 Get all educational information
    getEducationalInformation: builder.query<
      IGetAllEducationalInformationResponse,
      { search?: string; page?: number }
    >({
      query: ({ search = "", page = 1 }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        if (search) params.append("search", search);
        return `/educational-information?${params.toString()}`;
      },
      providesTags: ["EducationalInformation"],
    }),

    // 🔹 Get single educational info
    getEducationalInformationById: builder.query<
      IOneEducationalInformationResponse,
      number
    >({
      query: (id) => `/educational-information/${id}`,
      providesTags: ["EducationalInformation"],
    }),

    // 🔹 Create educational info
    createEducationalInformation: builder.mutation<
      IPostEducationalInformationResponse,
      IEducationalInformationBody
    >({
      query: (body) => ({
        url: `/educational-information`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["EducationalInformation"],
    }),

    // 🔹 Update educational info
    updateEducationalInformation: builder.mutation<
      IPostEducationalInformationResponse,
      { id: number; body: IEducationalInformationBody }
    >({
      query: ({ id, body }) => ({
        url: `/educational-information/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EducationalInformation"],
    }),

    // 🔹 Delete educational info
    deleteEducationalInformation: builder.mutation<
      IPostEducationalInformationResponse,
      number
    >({
      query: (id) => ({
        url: `/educational-information/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EducationalInformation"],
    }),
  }),
});

// 🧩 Export hooks
export const {
  useGetEducationalInformationQuery,
  useGetEducationalInformationByIdQuery,
  useCreateEducationalInformationMutation,
  useUpdateEducationalInformationMutation,
  useDeleteEducationalInformationMutation,
} = EducationalInformationApi;
