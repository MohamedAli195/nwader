import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Base_URL from "../../url";
import { RootState } from "../../store";

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

export interface StudentQRData {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  email: string;
  phone: string;
  date_of_birth: string;
  student_id: number | null;
  qr_code: string;
  qr_code_link: string;
  institution: Institution;
  institution_id: number;
  bio: string;
  profile_image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface QRResponse {
  data: StudentQRData;
}


export const qrApi = createApi({
  reducerPath: "qrApi",
 baseQuery: fetchBaseQuery({
    baseUrl: Base_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getStudentByQr: builder.query<QRResponse, string>({
      query: (qrCode) => `qr/${qrCode}`,
    }),
  }),
});

export const { useGetStudentByQrQuery } = qrApi;
