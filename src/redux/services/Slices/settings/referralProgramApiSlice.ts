import { api } from "../../apiSlice";

const referralApiConfig = api.enhanceEndpoints({
  addTagTypes: ["Referral"],
});
const referralApi = referralApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    setPriceControl: builder.mutation({
      query: (body) => ({
        url: `/admin/system-settings/set-price-control`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Referral"],
    }),

    setReferralProgram: builder.mutation({
      query: (body) => ({
        url: `/admin/system-settings/set-referral-program`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Referral"],
    }),

    getSystemSettings: builder.query({
      query: () => ({
        url: `/admin/system-settings`,
        method: "GET",
      }),
      providesTags: ["Referral"],
    }),

    getReferralPrograms: builder.query({
      query: () => ({
        url: `/admin/referral-programs`,
        method: "GET",
      }),
      providesTags: ["Referral"],
    }),

    getAnnouncements: builder.query({
      query: () => ({
        url: `/admin/anoucements`,
        method: "GET",
      }),
      providesTags: ["Referral"],
    }),
  }),
});

export const {
  useSetPriceControlMutation,
  useSetReferralProgramMutation,
  useGetSystemSettingsQuery,
  useGetAnnouncementsQuery,
  useGetReferralProgramsQuery,
} = referralApi;
