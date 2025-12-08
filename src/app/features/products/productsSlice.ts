import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import Base_URL from "../../url";
const BASE_URL = Base_URL; // triggers the proxy
export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  store_link: string;
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ProductsResponse {
  data: IProduct[];
  meta: Meta;
}
export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  store_link: string;
  is_active: boolean;
  images: File[]; // المرفوعات
}
export interface ProductCreateResponse {
  message: string;
  data: IProduct;
}

export interface ProductUpdateRequest {
  id: number; // product ID
  name?: string;
  description?: string;
  price?: number;
  store_link?: string;
  is_active?: boolean;
  images?: File[]; // صور جديدة
}

export interface ProductUpdateResponse {
  message: string;
  data: IProduct;
}


export const productsApi = createApi({
  reducerPath: "productsApi",
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
  tagTypes: ["Products"],

  endpoints: (builder) => ({
    // =====================================
    // Get All Products
    // =====================================
    getProducts: builder.query<
      ProductsResponse,
      { page?: number; per_page?: number }
    >({
      query: ({ page = 1, per_page = 15 }) =>
        `products?page=${page}&per_page=${per_page}`,
      providesTags: ["Products"],
    }),

    // =====================================
    // Get Product by ID
    // =====================================
    getProductById: builder.query<IProduct, number>({
      query: (id) => `products/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Products", id }],
    }),

    // =====================================
    // Create Product
    // =====================================
    createProduct: builder.mutation<ProductCreateResponse, FormData>({
      query: (formData) => ({
        url: "products",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    // =====================================
    // Update Product
    // =====================================
    updateProduct: builder.mutation<ProductUpdateResponse, FormData>({
      query: (formData) => {
        const id = formData.get("id");
        return {
          url: `products/${id}`,
          method: "POST", // Laravel غالباً يستخدم POST مع method=PUT
          body: formData,
        };
      },
      invalidatesTags: ["Products"],
    }),

    // =====================================
    // Delete Product
    // =====================================
    deleteProduct: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;

export default productsApi;




