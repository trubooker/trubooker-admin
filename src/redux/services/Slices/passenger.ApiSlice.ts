import { api } from "../apiSlice";

const passengersApiConfig = api.enhanceEndpoints({
  addTagTypes: ["Passengers"],
});
const passengersApi = passengersApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    getPassengers: builder.query({
      query: ({ page, search }) => ({
        url: `/admin/passengers?page=${page}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["Passengers"],
    }),

    getOnePassenger: builder.query({
      query: (passenger) => ({
        url: `/admin/passengers/${passenger}`,
        method: "GET",
      }),
      providesTags: ["Passengers"],
    }),

    togglePassengerStatus: builder.mutation({
      query: (passenger) => ({
        url: `/admin/passengers/toggle-status/${passenger}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Passengers"],
    }),
  }),
});

export const {
  useGetPassengersQuery,
  useGetOnePassengerQuery,
  useTogglePassengerStatusMutation,
} = passengersApi;
