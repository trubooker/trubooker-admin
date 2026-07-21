import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import fetchToken from "@/lib/auth";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
  prepareHeaders: async (headers) => {
    const token = await fetchToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token?.data?.token}`);
    }
    // DON'T set Content-Type here at all
    // Let fetchBaseQuery handle it based on the body type
    headers.set("Accept", "application/json");
    return headers;
  },
});

// Define a custom error type for fetch errors
interface FetchError {
  status: 'FETCH_ERROR';
  data?: unknown;
  error?: string;
}

// Custom query function that can handle FormData
const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // If args is a string, convert it to FetchArgs
  const fetchArgs: FetchArgs = typeof args === 'string' 
    ? { url: args, method: 'GET' } 
    : args;
  
  // Check if the body is FormData
  if (fetchArgs.body instanceof FormData) {
    
    // Create a custom request without Content-Type
    const customFetch = async (url: string, options: RequestInit) => {
      // Remove Content-Type from headers if it exists
      if (options.headers) {
        const headers = new Headers(options.headers);
        headers.delete('Content-Type');
        options.headers = headers;
      }
      
      // Let the browser set the correct Content-Type with boundary
      return fetch(url, options);
    };
    
    // Use custom fetch for FormData
    try {
      const token = await fetchToken();
      const response = await customFetch(
        `${process.env.NEXT_PUBLIC_API_URL}${fetchArgs.url}`,
        {
          method: fetchArgs.method || 'POST',
          headers: {
            'Authorization': `Bearer ${token?.data?.token}`,
            'Accept': 'application/json',
          },
          body: fetchArgs.body as FormData,
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        // Return in the format RTK Query expects for errors
        return {
          error: {
            status: response.status,
            data: data,
          } as FetchBaseQueryError,
        };
      }
      
      return { data };
    } catch (error) {
      // Return in the format RTK Query expects for network errors
      return {
        error: {
          status: 'FETCH_ERROR',
          data: error,
        } as FetchBaseQueryError,
      };
    }
  }
  
  // For non-FormData requests, use the default baseQuery
  const result = await baseQuery(args, api, extraOptions);
  
  if (result?.error?.status === 401) {
    window.location.href = "/";
  }
  
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: dynamicBaseQuery,
  tagTypes: [
    "User", 
    "Teacher", 
    "Withdraw", 
    "WelcomeCoupon", 
    "Coupons", 
    "CouponStats",
    "AppSettings",
    "VersionHistory",
    "Drivers",
    "Vehicles",
    "VehicleTypes"
  ],
  keepUnusedDataFor: 30,
  endpoints: () => ({}),
});