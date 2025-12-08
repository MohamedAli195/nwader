import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import { IEduSystems } from "../EduSystems/EduSystemsSlice";
import Base_URL from "../../url";

export interface IFormInputEduSys {
  name: string;
  educational_system_id: number | null; // ✅ كده يقبل null
}

export interface IAcademicStages {
  id?: number | undefined;
  name: string;
  educational_system: IEduSystems;
}

const BASE_URL = Base_URL; // triggers the proxy
interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: IAcademicStages[];
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
  data: IAcademicStages;
}
interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: IAcademicStages;
}

export const AcademicStagesApi = createApi({
  reducerPath: "AcademicStagesApi",
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
  tagTypes: ["AcademicStages"], // ✅ Define tag type
  endpoints: (builder) => ({
    getAcademicStages: builder.query<Ires, { search?: string; page: number }>({
      query: ({ search = "", page = 1 }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        if (search) params.append("search", search);
        return `/academic-stages?${params.toString()}`;
      },
      providesTags: ["AcademicStages"],
    }),
    getAcademicStage: builder.query<IOneCategoryres, number>({
      query: (id) => {
        return `/academic-stages/${id}`;
      },
      providesTags: ["AcademicStages"],
    }),
    //Example: createCategory mutation (to show how to invalidate)
    createAcademicStage: builder.mutation<IresPost, FormData>({
      query: (FormData) => ({
        url: `/academic-stages`,
        method: "POST",
        body: FormData,
      }),
      invalidatesTags: ["AcademicStages"], // ✅ Invalidate tag to refetch list
    }),
    deleteAcademicStage: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/academic-stages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AcademicStages"],
    }),

    updateAcademicStage: builder.mutation<
      IresPost,
      { id: number; body: IFormInputEduSys }
    >({
      query: ({ id, body }) => ({
        url: `/academic-stages/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AcademicStages"],
    }),
  }),
});

export const {
  useGetAcademicStagesQuery,
  useGetAcademicStageQuery,
  useCreateAcademicStageMutation,
  useDeleteAcademicStageMutation,
  useUpdateAcademicStageMutation,
} = AcademicStagesApi;
