import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import Base_URL from "../../url";

export interface IFormInputNews {
  title: string;
  description: string;
  image: FileList;
}

export interface Iinquiries {
  id: number;
  subject: string;
  message: string;
  status: string;
  submitted_at: string;

  author: {
    id: number;
    name: string;
    type: string;
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
  data: Iinquiries[];
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
  data: Iinquiries;
}
interface IresPost {
  code: number;
  message: string;
  status: boolean;
  data: Iinquiries;
}

export const inquiriesApi = createApi({
  reducerPath: "inquiriesApi",
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
  tagTypes: ["Inquiries"], // ✅ Define tag type
  endpoints: (builder) => ({
    getInquiries: builder.query<Ires, void>({
      query: () => {
        return `/inquiries`;
      },
      providesTags: ["Inquiries"],
    }),

    getInquirie: builder.query<IOneCategoryres, string | undefined>({
      query: (id) => {
        return `/inquiries/${id}`;
      },
      providesTags: ["Inquiries"],
    }),

    //Example: createCategory mutation (to show how to invalidate)
    createInquirieResponse: builder.mutation<
      IresPost,
      { id: number; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/inquiries/${id}/response`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Inquiries"], // ✅ Invalidate tag to refetch list
    }),

    // deleteComplaint: builder.mutation<IresPost, number | undefined>({
    //   query: (id) => ({
    //     url: `/news/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Complaints"],
    // }),

    updateInquirie: builder.mutation<IresPost, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/inquiries/${id}`,
        method: "PUT",
        body: { status }, // ✅ لازم يبقى object
      }),
      invalidatesTags: ["Inquiries"],
    }),
  }),
});

export const {
  useGetInquirieQuery,
  useCreateInquirieResponseMutation,
  useGetInquiriesQuery,
  useUpdateInquirieMutation,
} = inquiriesApi;

export default inquiriesApi;
