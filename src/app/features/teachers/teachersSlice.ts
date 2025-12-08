import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
// import { IEduSystems } from "../EduSystems/EduSystemsSlice";

export interface ITeacher {
  id: number;
  name: string;
  phone: string;
  password?: string;

  desc?: string;

  // is_online?: number;
  // is_offline?: string;
  image?: string;
  is_confirmed: boolean;
  image_url: string;
  profile: {
    years_of_experience?: number;
    national_id_egypt?: string;
    residence_number_outside_egypt?: string;
    title: string;
    experience_years: number;
    description: string;
    country?: string;
    city?: string;
    district?: string;
    current_workplace?: string;
    specialization: string;
    work_title?: string;
    phone2?: string;
    home_address?: string;
    work_address?: string;
    workplace: string;
  };
  availability: {
    online: boolean;
    offline: boolean;
    at_home: boolean;
  };
  classes: [];
}

const BASE_URL = "https://keen-edu.com/backend/api/admin"; // triggers the proxy

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: ITeacher[];
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
  data: ITeacher;
}
interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: ITeacher;
}

export const TeacherApi = createApi({
  reducerPath: "TeacherApi",
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
  tagTypes: ["Teachers"], // ✅ Define tag type
  endpoints: (builder) => ({
    getTeatchers: builder.query<Ires, { search?: string; page: number }>({
      query: ({ search = "", page = 1 }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        if (search) params.append("search", search);
        return `/teachers?${params.toString()}`;
      },
      providesTags: ["Teachers"],
    }),
    getTeatcher: builder.query<IOneCategoryres, number>({
      query: (id) => {
        return `/teachers/${id}`;
      },
      providesTags: ["Teachers"],
    }),
    //Example: createCategory mutation (to show how to invalidate)
    createTeatcher: builder.mutation<IresPost, FormData>({
      query: (FormData) => ({
        url: `/teachers`,
        method: "POST",
        body: FormData,
      }),
      invalidatesTags: ["Teachers"], // ✅ Invalidate tag to refetch list
    }),
    deleteTeatcher: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/teachers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Teachers"],
    }),
    updateTeatcher: builder.mutation<IresPost, { id: number; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/teachers/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Teachers"],
    }),
    confirmTeatcher: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/teachers/${id}/confirm`,
        method: "POST",
      }),
      invalidatesTags: ["Teachers"],
    }),
    registerClass: builder.mutation<IresPost, { id: number; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/teachers/${id}/register-class`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Teachers"],
    }),
  }),
});

export const {
  useGetTeatchersQuery,
  useGetTeatcherQuery,
  useCreateTeatcherMutation,
  useDeleteTeatcherMutation,
  useUpdateTeatcherMutation,
  useConfirmTeatcherMutation,
  useRegisterClassMutation,
} = TeacherApi;
export default TeacherApi;
