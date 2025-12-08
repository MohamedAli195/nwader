import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import Base_URL from "../../url";

export interface IBookingRequest {
  student_id: number;
  teacher_id: number;
  class_id: number;
  booking_time: string; // format: "YYYY-MM-DD HH:mm:ss"
  status: string; // optionally narrow the type if you know possible statuses
}

export interface BookingResponse {
  data: Booking[];
}

export interface Booking {
  id: number;
  booking_id: number;
  status: string;
  booking_time: string;
  student: Student;
  teacher: Teacher;
  class_details: ClassDetails;
  created_at: string;
}

export interface Student {
  id: number;
  name: string;
  phone: string;
  registered_at: string;
}

export interface Teacher {
  id: number;
  name: string;
  phone: string;
  is_confirmed: boolean;
  image_url: string | null;
  profile: TeacherProfile;
  availability: Availability;
  classes: TeacherClass[];
  created_at: string;
  updated_at: string;
}

export interface TeacherProfile {
  workplace: string | null;
  title: string | null;
  specialization: string | null;
  experience_years: number | null;
  description: string | null;
  country: string | null;
}

export interface Availability {
  online: boolean;
  offline: boolean;
}

export interface TeacherClass {
  id: number;
  name: string;
  academic_year_id: number;
  created_at: string;
  updated_at: string;
  pivot: Pivot;
  academic_year: AcademicYear;
}

export interface Pivot {
  teacher_id: number;
  class_id: number;
  status: string;
  class_price: number;
  created_at: string;
  updated_at: string;
}

export interface AcademicYear {
  id: number;
  name: string;
  academic_stage_id: number;
  created_at: string;
  updated_at: string;
  academic_stage: AcademicStage;
}

export interface AcademicStage {
  id: number;
  name: string;
  educational_system_id: number;
  created_at: string;
  updated_at: string;
  educational_system: EducationalSystem;
}

export interface EducationalSystem {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ClassDetails {
  id: number;
  name: string;
  academic_year: AcademicYearLite;
}

export interface AcademicYearLite {
  id: number;
  name: string;
  academic_stage: AcademicStageLite;
}

export interface AcademicStageLite {
  id: number;
  name: string;
  educational_system: EducationalSystemLite;
}

export interface EducationalSystemLite {
  id: number;
  name: string;
  description: string;
}

export interface IFormInputEduSys {
  name: string;
  phone: string;
  // password: string;
}

export interface IStudents {
  id?: number | undefined;
  name: string;
  phone: string;
  registered_at: string;
  password?: string;
}

const BASE_URL =  Base_URL; // triggers the proxy

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: Booking[];
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
  data: Booking;
}
interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: Booking;
}

export const academicBookingApi = createApi({
  reducerPath: "academicBookingApi",
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
  tagTypes: ["Booking"], // ✅ Define tag type
  endpoints: (builder) => ({
    getAcademicBookings: builder.query<Ires, { search?: string; page: number }>(
      {
        query: ({ search = "", page = 1 }) => {
          const params = new URLSearchParams();
          params.append("page", page.toString());
          if (search) params.append("search", search);
          return `/bookings?${params.toString()}`;
        },
        providesTags: ["Booking"],
      }
    ),

    getAcademicBooking: builder.query<IOneCategoryres, number>({
      query: (id) => {
        return `/bookings/${id}`;
      },
      providesTags: ["Booking"],
    }),

    //Example: createCategory mutation (to show how to invalidate)
    createAcademicBookings: builder.mutation<IresPost, FormData>({
      query: (FormData) => ({
        url: `/bookings`,
        method: "POST",
        body: FormData,
      }),
      invalidatesTags: ["Booking"], // ✅ Invalidate tag to refetch list
    }),

    deleteAcademicBookings: builder.mutation<IresPost, number | undefined>({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking"],
    }),

    updateAcademicBookings: builder.mutation<
      IresPost,
      { id: number; body: IBookingRequest }
    >({
      query: ({ id, body }) => ({
        url: `/bookings/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const {
  useGetAcademicBookingsQuery,
  useGetAcademicBookingQuery,
  useCreateAcademicBookingsMutation,
  useDeleteAcademicBookingsMutation,
  useUpdateAcademicBookingsMutation,
} = academicBookingApi;
