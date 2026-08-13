import { api } from "../apiSlice";

const tripsApiConfig = api.enhanceEndpoints({
  addTagTypes: ["Trips"],
});
const tripsApi = tripsApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    getAllTrips: builder.query({
      query: ({ status, page }: any) => ({
        url: `/v1/admin/trips`,
        method: "GET",
        params: { status, page },
      }),
      providesTags: ["Trips"],
    }),

    getSingleTrip: builder.query({
      query: ({ trip }: any) => ({
        url: `/v1/admin/trips/${trip}`,
        method: "GET",
      }),
      providesTags: ["Trips"],
    }),
  }),
});

export const { useGetSingleTripQuery, useGetAllTripsQuery } = tripsApi;
