import { api } from "../../apiSlice";

const referralApiConfig = api.enhanceEndpoints({
  addTagTypes: ["Referral"],
});
const referralApi = referralApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    setPriceControl: builder.mutation({
      query: (body) => ({
        url: `/v1/admin/settings/price-control`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Referral"],
    }),

    setReferralProgram: builder.mutation({
      query: (body) => ({
        url: `/v1/admin/settings/referral-program`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Referral"],
    }),

    getSystemSettings: builder.query({
      query: () => ({
        url: `/v1/admin/settings/get-all`,
        method: "GET",
      }),
      providesTags: ["Referral"],
    }),

    getReferralPrograms: builder.query({
      query: () => ({
        url: `/v1/admin/settings/referral-program`,
        method: "GET",
      }),
      providesTags: ["Referral"],
    }),

    getAnnouncements: builder.query({
      query: () => ({
        url: `/v1/admin/anoucements`,
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
