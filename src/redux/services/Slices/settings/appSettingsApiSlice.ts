import { api } from "../../apiSlice";

export const appSettingsApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAppSettings: builder.query({
      // ✅ FIX: Remove "/settings" from URL - should match Laravel route
      query: () => "/admin/app-versions",
      providesTags: ["AppSettings"],
    }),
    updateAppSettings: builder.mutation({
      query: (data) => ({
        // ✅ FIX: Remove "/settings" from URL
        url: "/admin/app-versions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AppSettings"],
    }),
    getVersionHistory: builder.query({
      query: (params) => ({
        // ✅ FIX: Remove "/settings" from URL
        url: "/admin/app-versions/history",
        params,
      }),
      providesTags: ["VersionHistory"],
    }),
  }),
});

export const {
  useGetAppSettingsQuery,
  useUpdateAppSettingsMutation,
  useGetVersionHistoryQuery,
} = appSettingsApiSlice;