// /admin/transactions/reportimport { api } from "../apiSlice";
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

    getTransactionHistory: builder.query({
      query: ({ page, search }) => ({
        url: `/admin/transactions/histories?page=${page}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["Finance"],
    }),
  }),
});

export const { useGetFinancialReportQuery, useGetTransactionHistoryQuery } =
  passengersApi;
