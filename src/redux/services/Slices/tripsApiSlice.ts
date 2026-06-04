import { Search } from "lucide-react";
import { api } from "../apiSlice";

const tripsApiConfig = api.enhanceEndpoints({
  addTagTypes: ["Trips"],
});
const tripsApi = tripsApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    getAllTrips: builder.query({
      query: ({ type, page }: any) => ({
        url: `/admin/drivers-trips`,
        method: "GET",
        params: { type, page },
      }),
      providesTags: ["Trips"],
    }),

    getSingleTrip: builder.query({
      query: ({ trip }: any) => ({
        url: `/admin/drivers-trips/${trip}`,
        method: "GET",
      }),
      providesTags: ["Trips"],
    }),
  }),
});

export const { useGetSingleTripQuery, useGetAllTripsQuery } = tripsApi;
