import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import Base_URL from "../../url";

export interface IFormInputNews {
  title: string;
  content: string;
  image: FileList;
}

export interface INews {
  id?: number | undefined;
  title: string;
  content: string;
  image: string;
  image_url?: string;
}

const BASE_URL = Base_URL; // triggers the proxy

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: INews[];
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
  data: INews;
}
interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: INews;
}

export const newsApi = createApi({
  reducerPath: "newsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        // Do not manually set Content-Type for FormData
      }
      headers.set("Accept", "application/json");

      return headers;
    },
  }),
  tagTypes: ["News"], // ✅ Define tag type
  endpoints: (builder) => ({
    getNews: builder.query<Ires, { search?: string; page: number }>({
      query: ({ search = "", page = 1 }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        if (search) params.append("search", search);
        return `/news?${params.toString()}`;
      },
      providesTags: ["News"],
    }),

    getNew: builder.query<IOneCategoryres, number>({
      query: (id) => {
        return `/academic-stages/${id}`;
      },
      providesTags: ["News"],
    }),

    //Example: createCategory mutation (to show how to invalidate)
    createNew: builder.mutation<IresPost, FormData>({
      query: (FormData) => ({
        url: `/news`,
        method: "POST",
        body: FormData,
      }),
      invalidatesTags: ["News"], // ✅ Invalidate tag to refetch list
    }),

    deleteNew: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/news/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["News"],
    }),

    updateNew: builder.mutation<IresPost, { id: number; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/news/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["News"],
    }),
  }),
});

export const {
  useCreateNewMutation,
  useDeleteNewMutation,
  useGetNewQuery,
  useGetNewsQuery,
  useUpdateNewMutation,
} = newsApi;

export default newsApi;
