import { api } from "../../apiSlice";

// Matches the backend UpdateAppVersionDto exactly
export interface UpdateAppVersionDto {
  appType: "passenger" | "driver";
  platform: "android" | "ios";
  minVersion: string;
  latestVersion: string;
  isForceUpdate: boolean;
  isEnabled: boolean;
  updateMessage: string | null;
}

export const appSettingsApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAppSettings: builder.query({
      query: () => "/v1/admin/app-versions",
      providesTags: ["AppSettings"],
    }),

    // Backend takes ONE flat DTO per call — the frontend fires 4 times (one per combo)
    updateAppSettings: builder.mutation<void, UpdateAppVersionDto>({
      query: (dto) => ({
        url: "/v1/admin/app-versions/update",
        method: "POST",
        body: dto,
      }),
      // Don't auto-invalidate here — AppSettings.tsx calls refetch() manually
      // after all 4 requests complete so we get one clean refresh.
      invalidatesTags: ["VersionHistory"],
    }),

    getVersionHistory: builder.query({
      query: (params) => ({
        url: "/v1/admin/history",
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

// import { api } from "../../apiSlice";

// export const appSettingsApiSlice = api.injectEndpoints({
//   endpoints: (builder) => ({
//     getAppSettings: builder.query({
//       query: () => "/v1/admin/app-versions",
//       providesTags: ["AppSettings"],
//     }),
//     updateAppSettings: builder.mutation({
//       query: (data) => ({
//         url: "/v1/admin/app-versions/update",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ["AppSettings", "VersionHistory"],
//     }),
//     getVersionHistory: builder.query({
//       query: (params) => ({
//         url: "/v1/admin/history",
//         params,
//       }),
//       providesTags: ["VersionHistory"],
//     }),
//   }),
// });

// export const {
//   useGetAppSettingsQuery,
//   useUpdateAppSettingsMutation,
//   useGetVersionHistoryQuery,
// } = appSettingsApiSlice;