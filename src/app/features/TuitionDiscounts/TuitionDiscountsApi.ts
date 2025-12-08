import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import Base_URL from "../../url";

// 🧩 Interfaces
export interface ITuitionDiscountBody {
  title: string;
  description?: string;
  discount_percentage: number;
  school_id?: number;
  start_date?: string;
  end_date?: string;
  max_uses?: number;
  is_active?: boolean;
}

export interface ITuitionDiscount {
  id?: number;
  title: string;
  description: string;
  discount_percentage: number;
  school_id: number;
  start_date: string;
  end_date: string;
  max_uses: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IGetAllTuitionDiscountsResponse {
  data: ITuitionDiscount[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface IOneTuitionDiscountResponse {
  code: number;
  message: string;
  status: boolean;
  data: ITuitionDiscount;
}

export interface IPostTuitionDiscountResponse {
  code: number;
  message: string;
  status: boolean;
  data: ITuitionDiscount;
}

// 🌍 Base URL
const BASE_URL = Base_URL;

// 🚀 API Slice
export const TuitionDiscountsApi = createApi({
  reducerPath: "TuitionDiscountsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["TuitionDiscounts"],
  endpoints: (builder) => ({
    // 🔹 Get all tuition discounts
    getTuitionDiscounts: builder.query<
      IGetAllTuitionDiscountsResponse,
      { search?: string; page?: number }
    >({
      query: ({ search = "", page = 1 }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        if (search) params.append("search", search);
        return `/tuition-discounts?${params.toString()}`;
      },
      providesTags: ["TuitionDiscounts"],
    }),

    // 🔹 Get one tuition discount by ID
    getTuitionDiscountById: builder.query<IOneTuitionDiscountResponse, number>({
      query: (id) => `/tuition-discounts/${id}`,
      providesTags: ["TuitionDiscounts"],
    }),

    // 🔹 Create tuition discount
    createTuitionDiscount: builder.mutation<
      IPostTuitionDiscountResponse,
      ITuitionDiscountBody
    >({
      query: (body) => ({
        url: `/tuition-discounts`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["TuitionDiscounts"],
    }),

    // 🔹 Update tuition discount
    updateTuitionDiscount: builder.mutation<
      IPostTuitionDiscountResponse,
      { id: number; body: Partial<ITuitionDiscountBody> }
    >({
      query: ({ id, body }) => ({
        url: `/tuition-discounts/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["TuitionDiscounts"],
    }),

    // 🔹 Delete tuition discount
    deleteTuitionDiscount: builder.mutation<IPostTuitionDiscountResponse, number>({
      query: (id) => ({
        url: `/tuition-discounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TuitionDiscounts"],
    }),
  }),
});

// 🧩 Export hooks
export const {
  useGetTuitionDiscountsQuery,
  useGetTuitionDiscountByIdQuery,
  useCreateTuitionDiscountMutation,
  useUpdateTuitionDiscountMutation,
  useDeleteTuitionDiscountMutation,
} = TuitionDiscountsApi;
