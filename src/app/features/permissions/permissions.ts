import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import Base_URL from "../../url";

export interface IPermissions {
 id: number,
            name: string,
            // display_name:string
}

// const BASE_URL = "https://api.almajd-company.com/public/api"; // triggers the proxy
interface Ires {
  code: number;
  message: string;
  status: boolean;
  data: IPermissions[] | undefined; 
}
// interface IOneCategoryres {
//   code: number;
//   message: string;
//   status: boolean;
//   data: IPermissions;
// }
// interface IresPost {
//   code: number;
//   message: string;
//   status: boolean;
//   data: IPermissions;
// }

export const PermissionsApi = createApi({
  reducerPath: "PermissionsApi",
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
  tagTypes: ["Permissions"], // ✅ Define tag type
  endpoints: (builder) => ({
    getPermissions: builder.query<Ires, void>({
      query: () => {
        
        return `/permissions?per_page=15`;
      },
      providesTags: ["Permissions"],
    }),


  }),
});

export const {
  useGetPermissionsQuery
} = PermissionsApi;
