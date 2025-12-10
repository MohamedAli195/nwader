import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import Base_URL from "../../url";

export interface IFormInputEduSys {
  name: string;
  phone: string;
  // password: string;
}

export interface IStudents {
  id?: number | undefined;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  date_of_birth: string;
  student_id: string;
  institution_id: string;
  bio: string;
  profile_image: string;
  phone: string;
  registered_at: string;
  is_active: string;
  password?: string;
}

const BASE_URL = Base_URL;// triggers the proxy

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: IStudents[];
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
// interface IOneCategoryres {
//   code: number;
//   message: string;
//   status: boolean;
//   data: IStudents;
// }
interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: IStudents;
}

export const academicStudentApi = createApi({
  reducerPath: "academicStudentApi",
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
  tagTypes: ["Students"], // ✅ Define tag type
  endpoints: (builder) => ({
    getAcademicStudents: builder.query<Ires, { search?: string; page: number }>(
      {
        query: ({ search = "", page = 1 }) => {
          const params = new URLSearchParams();
          params.append("page", page.toString());
          if (search) params.append("search", search);
          return `/students?${params.toString()}`;
        },
        providesTags: ["Students"],
      }
    ),



    //Example: createCategory mutation (to show how to invalidate)
    createAcademicStudents: builder.mutation<IresPost, FormData>({
      query: (FormData) => ({
        url: `/students`,
        method: "POST",
        body: FormData,
      }),
      invalidatesTags: ["Students"], // ✅ Invalidate tag to refetch list
    }),

    deleteAcademicStudents: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Students"],
    }),

    updateAcademicStudents: builder.mutation<
      IresPost,
      { id: number; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/students/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Students"],
    }),
  }),
});

export const {
  useGetAcademicStudentsQuery,
  useCreateAcademicStudentsMutation,
  useDeleteAcademicStudentsMutation,
  useUpdateAcademicStudentsMutation,
  //   useGetAcademicStageQuery,
} = academicStudentApi;
