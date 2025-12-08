import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
export interface IEducationalSystem {
  name: string;
  description: string;
}
export interface IEduSystems {
  id?: number;
  name: string;
  description: string;
}

const BASE_URL = "https://keen-edu.com/backend/api/admin"; // triggers the proxy
interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: IEduSystems[];
  links: {
    first: string;
    second: string;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      active: boolean;
      label: string;
      url: string;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
interface IOneCategoryres {
  code: number;
  message: string;
  status: boolean;
  data: IEduSystems;
}
interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: IEduSystems;
}

export const EduSystemsApi = createApi({
  reducerPath: "EduSystemsApi",
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
  tagTypes: ["EduSystems"], // ✅ Define tag type
  endpoints: (builder) => ({
    getEduSystems: builder.query<Ires, { search?: string; page: number }>({
      query: ({ search = "", page = 1 }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        if (search) params.append("search", search);
        return `/educational-systems?${params.toString()}`;
      },
      providesTags: ["EduSystems"],
    }),
    getEduSystem: builder.query<IOneCategoryres, number>({
      query: (id) => {
        return `/educational-systems/${id}`;
      },
      providesTags: ["EduSystems"],
    }),
    //Example: createCategory mutation (to show how to invalidate)
    createEduSystem: builder.mutation<IresPost, FormData>({
      query: (FormData) => ({
        url: `/educational-systems`,
        method: "POST",
        body: FormData,
      }),
      invalidatesTags: ["EduSystems"], // ✅ Invalidate tag to refetch list
    }),
    deleteEduSystem: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/educational-systems/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EduSystems"],
    }),

    updateEduSystem: builder.mutation<
      IresPost,
      { id: number; body: IEducationalSystem }
    >({
      query: ({ id, body }) => ({
        url: `/educational-systems/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["EduSystems"],
    }),
  }),
});

export const {
  useGetEduSystemsQuery,
  useGetEduSystemQuery,
  useCreateEduSystemMutation,
  useDeleteEduSystemMutation,
  useUpdateEduSystemMutation,
} = EduSystemsApi;
