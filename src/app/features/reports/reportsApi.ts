// src/app/features/reports/studentsPerInstitutionApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import BASE_URL from "../../url";

// ----------------- Existing Interfaces ----------------- //
// Students Per Institution
export interface StudentPerInstitution {
  institution_id: number | null;
  institution_name: string;
  institution_type: string;
  student_count: number;
}

export interface StudentsPerInstitutionResponse {
  data: StudentPerInstitution[];
  summary: {
    total_institutions: number;
    total_students: number;
  };
}

// Students by Institution Type
export interface StudentsByInstitutionType {
  type: string;
  student_count: number;
}

export interface StudentsByInstitutionTypeResponse {
  data: StudentsByInstitutionType[];
}

// QR Scan Statistics
export interface ScanByDate {
  date: string;
  scan_count: number;
}

export interface ScanByDevice {
  device_type: string;
  scan_count: number;
}

export interface TopScannedStudent {
  student_id: number;
  student_name: string;
  qr_code: string;
  scan_count: number;
}

export interface QRScanStatisticsResponse {
  data: {
    total_scans: number;
    scans_by_date: ScanByDate[];
    scans_by_device: ScanByDevice[];
    top_scanned_students: TopScannedStudent[];
  };
}

// ----------------- NEW: Institution Details ----------------- //
export interface InstitutionDetails {
  id: number;
  name: string;
  type: string;
}

export interface InstitutionStatistics {
  total_students: number;
  active_students: number;
  inactive_students: number;
  students_registered_last_30_days: number;
}

export interface InstitutionDetailsResponse {
  data: {
    institution: InstitutionDetails;
    statistics: InstitutionStatistics;
  };
}

// ----------------- API ----------------- //
export const reportsApi = createApi({
  reducerPath: "studentsPerInstitutionApi",
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
  tagTypes: ["StudentsPerInstitution", "StudentsByType", "QRScanStats", "InstitutionDetails"],
  endpoints: (builder) => ({
    getStudentsPerInstitution: builder.query<StudentsPerInstitutionResponse, void>({
      query: () => "reports/students-per-institution",
      providesTags: ["StudentsPerInstitution"],
    }),
    getStudentsByInstitutionType: builder.query<StudentsByInstitutionTypeResponse, void>({
      query: () => "reports/students-by-institution-type",
      providesTags: ["StudentsByType"],
    }),
    getQRScanStatistics: builder.query<QRScanStatisticsResponse, void>({
      query: () => "reports/qr-scan-statistics",
      providesTags: ["QRScanStats"],
    }),
    // ✅ New Endpoint: Institution Details
    getInstitutionDetails: builder.query<InstitutionDetailsResponse, number>({
      query: (institutionId) => `reports/institution/${institutionId}`,
      providesTags: ["InstitutionDetails"],
    }),
  }),
});

export const { 
  useGetStudentsPerInstitutionQuery, 
  useGetStudentsByInstitutionTypeQuery,
  useGetQRScanStatisticsQuery,
  useGetInstitutionDetailsQuery
} = reportsApi;

export default reportsApi;
