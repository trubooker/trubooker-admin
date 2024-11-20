import { api } from "../../apiSlice";

export const referralApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getReferrals: builder.query({
      query: () => ({
        url: `/agent/referrals`,
        method: "POST",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const { useGetReferralsQuery } = referralApiSlice;
