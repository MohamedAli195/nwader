

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import Base_URL from "../../url";


// src/types/Institution.ts

export interface Institution {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string | null;
  type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InstitutionsResponse {
  data: Institution[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface CreateInstitutionRequest {
  name: string;
  type: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: File | null;
  is_active: boolean;
}

export interface AddInstitutionResponse {
  message: string;
  data: Institution;
}

export interface UpdateInstitutionResponse {
  message: string;
  data: Institution;
}
// src/app/services/institutionApi.ts
const appendToFormData = (formData: FormData, key: string, value: unknown) => {
  if (value instanceof File) {
    formData.append(key, value);
  } else if (typeof value === "boolean") {
    formData.append(key, value ? "1" : "0");
  } else if (typeof value === "number") {
    formData.append(key, value.toString());
  } else if (typeof value === "string") {
    formData.append(key, value);
  }
  // ignore null & undefined
};
export const institutionApi = createApi({
  reducerPath: "institutionApi",
   baseQuery: fetchBaseQuery({
     baseUrl: Base_URL,
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
  tagTypes: ["Institutions"],

  endpoints: (builder) => ({
    // =======================
    //      GET LIST
    // =======================
    getInstitutions: builder.query<InstitutionsResponse, number | void>({
      query: (page = 1) => `/institutions?per_page=15&page=${page}`,
      providesTags: ["Institutions"],
    }),

    // =======================
    //      ADD
    // =======================
    
    addInstitution: builder.mutation<
  AddInstitutionResponse,
  CreateInstitutionRequest
>({
  query: (body) => {
    const formData = new FormData();

    Object.entries(body).forEach(([key, value]) => {
      appendToFormData(formData, key, value);
    });

    return {
      url: `/institutions`,
      method: "POST",
      body: formData,
    };
  },
  invalidatesTags: ["Institutions"],
}),


    // =======================
    //      UPDATE
    // =======================
updateInstitution: builder.mutation<
  UpdateInstitutionResponse,
  { id: number; data: Partial<CreateInstitutionRequest> }
>({
  query: ({ id, data }) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        appendToFormData(formData, key, value);
      }
    });

    return {
      url: `/institutions/${id}`,
      method: "POST",
      body: formData,
    };
  },
  invalidatesTags: ["Institutions"],
}),


    // =======================
    //      DELETE
    // =======================
    deleteInstitution: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/institutions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Institutions"],
    }),
  }),
});

export const {
  useGetInstitutionsQuery,
  useAddInstitutionMutation,
  useUpdateInstitutionMutation,
  useDeleteInstitutionMutation,
} = institutionApi;

