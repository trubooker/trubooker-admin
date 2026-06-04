import { api } from "../apiSlice";

const dashboardApiConfig = api.enhanceEndpoints({ addTagTypes: ["Dashboard"] });
const dashboardApi = dashboardApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: ({ page }: any) => ({
        url: `/admin/dashboard?page=${page}`,
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;
