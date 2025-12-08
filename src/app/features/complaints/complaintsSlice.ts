import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import Base_URL from "../../url";

export interface IFormInputNews {
  title: string;
  description: string;
  image: FileList;
}

export interface IComplaint {
  id: number;
  subject: string;
  message: string;
  status: string;
  submitted_at: string;

  complaint_about_teacher: {
    id: number;
    name: string;
    phone: string;
    image_url: string | null;
  };
  submitted_by_student: {
    id: number;
    name: string;
    phone: string;
  };
  responses: [
    {
      id: number;
      message: string;
      responded_at: string;
    }
  ];
}

const BASE_URL = Base_URL; // triggers the proxy

interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: IComplaint[];
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
  data: IComplaint;
}
interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: IComplaint;
}

export const complaintsApi = createApi({
  reducerPath: "complaintsApi",
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
  tagTypes: ["Complaints"], // ✅ Define tag type
  endpoints: (builder) => ({
    getComplaints: builder.query<Ires, void>({
      query: () => {
        return `/complaints`;
      },
      providesTags: ["Complaints"],
    }),

    getComplaint: builder.query<IOneCategoryres, string | undefined>({
      query: (id) => {
        return `/complaints/${id}`;
      },
      providesTags: ["Complaints"],
    }),

    //Example: createCategory mutation (to show how to invalidate)
    createComplaintResponse: builder.mutation<
      IresPost,
      { id: number; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/complaints/${id}/response`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Complaints"], // ✅ Invalidate tag to refetch list
    }),

    // deleteComplaint: builder.mutation<IresPost, number | undefined>({
    //   query: (id) => ({
    //     url: `/news/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Complaints"],
    // }),

    updateComplaint: builder.mutation<IresPost, { id: number; status: string }>(
      {
        query: ({ id, status }) => ({
          url: `/complaints/${id}`,
          method: "PUT",
          body: { status }, // ✅ لازم يبقى object
        }),
        invalidatesTags: ["Complaints"],
      }
    ),
  }),
});

export const {
  useCreateComplaintResponseMutation,
  useGetComplaintQuery,
  useGetComplaintsQuery,
  useUpdateComplaintMutation,
} = complaintsApi;

export default complaintsApi;
