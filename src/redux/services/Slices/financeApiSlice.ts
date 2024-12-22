import { api } from "../apiSlice";

const passengersApiConfig = api.enhanceEndpoints({
  addTagTypes: ["Finance"],
});
const passengersApi = passengersApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    getFinancialReport: builder.query({
      query: () => ({
        url: `/admin/transactions/report`,
        method: "GET",
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
  }),
});

export const {
  useGetFinancialReportQuery,
  useGetDriversEarningsQuery,
  useGetAgentsEarningsQuery,
} = passengersApi;
