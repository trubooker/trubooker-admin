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

    togglePassengerStatus: builder.query({
      query: (passenger) => ({
        url: `/admin/passengers/toggle-status/${passenger}`,
        method: "PATCH",
      }),
      providesTags: ["Passengers"],
    }),
  }),
});

export const {
  useGetPassengersQuery,
  useGetOnePassengerQuery,
  useTogglePassengerStatusQuery,
} = passengersApi;
