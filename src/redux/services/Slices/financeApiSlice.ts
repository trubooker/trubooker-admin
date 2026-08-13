import { api } from "../apiSlice";

const passengersApiConfig = api.enhanceEndpoints({
  addTagTypes: ["Finance"],
});
const passengersApi = passengersApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    getFinancialReport: builder.query({
      query: ({ filter_by }) => ({
        url: `/v1/admin/transactions/report`,
        method: "GET",
        params: { filter_by }, // Pass filter_by as a query parameter
      }),
      providesTags: ["Finance"],
    }),

    getDriversEarnings: builder.query({
      query: ({ page, search }: any) => ({
        url: `/v1/admin/finance/drivers-earnings?page=${page}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["Finance"],
    }),

    getAgentsEarnings: builder.query({
      query: ({ page, search }: any) => ({
        url: `/v1/admin/finance/agents-earnings?page=${page}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["Finance"],
    }),

    getRefundRequest: builder.query({
      query: ({
        page,
        search,
        type,
      }: {
        page: number;
        search: string;
        type: "passenger" | "driver";
      }) => ({
        url: `/v1/admin/transactions/refund-requests?page=${page}&search=${search}&type=${type}`,
        method: "GET",
      }),
      providesTags: ["Finance"],
    }),

    approveWithdrawalRequest: builder.mutation({
      query: (payout) => ({
        url: `/v1/admin/transactions/approve-withdrawal/${payout}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Finance"],
    }),

    DeclineWithdrawalRequest: builder.mutation({
      query: (payout) => ({
        url: `/v1/admin/transactions/decline-withdrawal/${payout}`,
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
  useGetRefundRequestQuery,
} = passengersApi;
