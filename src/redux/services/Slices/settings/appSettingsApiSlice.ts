import { api } from "../../apiSlice";

export const appSettingsApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAppSettings: builder.query({
      query: () => "/admin/app-versions",
      providesTags: ["AppSettings"],
    }),
    updateAppSettings: builder.mutation({
      query: (data) => ({
        url: "/admin/app-versions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AppSettings", "VersionHistory"],
    }),
    getVersionHistory: builder.query({
      query: (params) => ({
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