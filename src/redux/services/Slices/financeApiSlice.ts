import { api } from "../apiSlice";

const passengersApiConfig = api.enhanceEndpoints({
  addTagTypes: ["Finance"],
});
const passengersApi = passengersApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    getFinancialReport: builder.query({
      query: ({ filter_by }) => ({
        url: `/admin/transactions/report`,
        method: "GET",
        params: { filter_by }, // Pass filter_by as a query parameter
      }),
      providesTags: ["Finance"],
    }),

    getDriversEarnings: builder.query({
      query: ({ page, search }: any) => ({
        url: `/admin/finance/drivers-earnings?page=${page}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["Finance"],
    }),

    getAgentsEarnings: builder.query({
      query: ({ page, search }: any) => ({
        url: `/admin/finance/agents-earnings?page=${page}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["Finance"],
    }),

    getRefundRequest: builder.query({
      query: ({page}: any) => ({
        url: `/admin/transactions/refund-requests?page=${page}`,
        method: "GET",
      }),
      providesTags: ["Finance"],
    }),

    approveWithdrawalRequest: builder.mutation({
      query: (payout) => ({
        url: `/admin/transactions/approve-withdrawal/${payout}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Finance"],
    }),

    DeclineWithdrawalRequest: builder.mutation({
      query: (payout) => ({
        url: `/admin/transactions/decline-withdrawal/${payout}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Finance"],
    }),
  }),
});

export const {
  useGetFinancialReportQuery,
  useGetDriversEarningsQuery,
  useGetAgentsEarningsQuery,
  useApproveWithdrawalRequestMutation,
  useDeclineWithdrawalRequestMutation,
  useGetRefundRequestQuery
} = passengersApi;
