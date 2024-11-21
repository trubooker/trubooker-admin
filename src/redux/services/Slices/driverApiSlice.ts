import { api } from "../apiSlice";

const driversApiConfig = api.enhanceEndpoints({
  addTagTypes: ["Drivers"],
});
const driversApi = driversApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    getDrivers: builder.query({
      query: ({ page, search }) => ({
        url: `/admin/drivers?page=${page}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["Drivers"],
    }),

    getOneDriver: builder.query({
      query: (driver) => ({
        url: `/admin/drivers/${driver}`,
        method: "GET",
      }),
      providesTags: ["Drivers"],
    }),

    toggleDriverStatus: builder.query({
      query: (driver) => ({
        url: `/admin/drivers/toggle-status/${driver}`,
        method: "PATCH",
      }),
      providesTags: ["Drivers"],
    }),
  }),
});

export const {
  useGetDriversQuery,
  useGetOneDriverQuery,
  useToggleDriverStatusQuery,
} = driversApi;
