import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
// import { IEduSystems } from "../EduSystems/EduSystemsSlice";
import { IAcademicStages } from "../academicStages/academicStagesSlice";
import Base_URL from "../../url";

export interface IFormInputEduSys {
  name: string;
  academic_stage_id: number | null; // ✅ كده يقبل null
}
export interface IAcademicYears {
  id?: number | undefined;
  name: string;
  academic_stage: IAcademicStages;
}

const BASE_URL = Base_URL; // triggers the proxy

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: IAcademicYears[];
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
  data: IAcademicYears;
}
interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: IAcademicYears;
}

export const AcademicYearsApi = createApi({
  reducerPath: "AcademicYearsApi",
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
  tagTypes: ["AcademicYears"], // ✅ Define tag type
  endpoints: (builder) => ({
    getAcademicYears: builder.query<Ires, { search?: string; page: number }>({
      query: ({ search = "", page = 1 }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        if (search) params.append("search", search);
        return `/academic-years?${params.toString()}`;
      },
      providesTags: ["AcademicYears"],
    }),
    getAcademicYear: builder.query<IOneCategoryres, number>({
      query: (id) => {
        return `/academic-years/${id}`;
      },
      providesTags: ["AcademicYears"],
    }),
    //Example: createCategory mutation (to show how to invalidate)
    createAcademicYear: builder.mutation<IresPost, FormData>({
      query: (FormData) => ({
        url: `/academic-years`,
        method: "POST",
        body: FormData,
      }),
      invalidatesTags: ["AcademicYears"], // ✅ Invalidate tag to refetch list
    }),
    deleteAcademicYear: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/academic-years/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AcademicYears"],
    }),
    updateAcademicYear: builder.mutation<
      IresPost,
      { id: number; body: IFormInputEduSys }
    >({
      query: ({ id, body }) => ({
        url: `/academic-years/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AcademicYears"],
    }),
  }),
});

export const {
  useGetAcademicYearsQuery,
  useGetAcademicYearQuery,
  useCreateAcademicYearMutation,
  useDeleteAcademicYearMutation,
  useUpdateAcademicYearMutation,
} = AcademicYearsApi;
export default AcademicYearsApi;
