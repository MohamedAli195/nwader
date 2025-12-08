import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
// import { IEduSystems } from "../EduSystems/EduSystemsSlice";

import { IAcademicYears } from "../academicYears/academicYearsSlice";
import Base_URL from "../../url";

export interface IFormInputClasses {
  name: string;
  academic_year_id: number | null; // ✅ كده يقبل null
}
export interface IAcademicClasses {
  id?: number | undefined;
  name: string;
  academic_year: IAcademicYears;
}

const BASE_URL = Base_URL; // triggers the proxy

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: IAcademicClasses[];
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
  data: IAcademicClasses;
}
interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: IAcademicClasses;
}

export const AcademicClassesApi = createApi({
  reducerPath: "AcademicClassesApi",
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
  tagTypes: ["classes"], // ✅ Define tag type
  endpoints: (builder) => ({
    getAcademicClasses: builder.query<Ires, { search?: string; page: number }>({
      query: ({ search = "", page = 1 }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        if (search) params.append("search", search);
        return `/classes?${params.toString()}`;
      },
      providesTags: ["classes"],
    }),

    getAcademicClass: builder.query<IOneCategoryres, number>({
      query: (id) => {
        return `/classes/${id}`;
      },
      providesTags: ["classes"],
    }),
    //Example: createCategory mutation (to show how to invalidate)
    createAcademicClasses: builder.mutation<IresPost, FormData>({
      query: (FormData) => ({
        url: `/classes`,
        method: "POST",
        body: FormData,
      }),
      invalidatesTags: ["classes"], // ✅ Invalidate tag to refetch list
    }),
    deleteAcademicClasses: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/classes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["classes"],
    }),
    updateAcademicClasses: builder.mutation<
      IresPost,
      { id: number; body: IFormInputClasses }
    >({
      query: ({ id, body }) => ({
        url: `/classes/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["classes"],
    }),
  }),
});

export const {
  useGetAcademicClassesQuery,
  useGetAcademicClassQuery,
  useCreateAcademicClassesMutation,
  useDeleteAcademicClassesMutation,
  useUpdateAcademicClassesMutation,
} = AcademicClassesApi;
export default AcademicClassesApi;
