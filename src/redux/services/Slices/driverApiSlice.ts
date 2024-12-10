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

    getTripDetails: builder.query({
      query: (trip) => ({
        url: `/admin/drivers/trip/${trip}`,
        method: "GET",
      }),
      providesTags: ["Drivers"],
    }),

    toggleDriverStatus: builder.mutation({
      query: (driver) => ({
        url: `/admin/drivers/toggle-status/${driver}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Drivers"],
    }),
  }),
});

export const {
  useGetDriversQuery,
  useGetOneDriverQuery,
  useToggleDriverStatusMutation,
  useGetTripDetailsQuery,
} = driversApi;
