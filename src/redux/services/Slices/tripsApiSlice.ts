import { api } from "../apiSlice";

const tripsApiConfig = api.enhanceEndpoints({
  addTagTypes: ["Trips", "TripRequests"],
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

    getTripRequest: builder.query({
      query: ({ status = "pending", page = 1, limit = 20 }: any = {}) => ({
        url: `/v1/trip-requests`,
        method: "GET",
        params: { status, page, limit },
      }),
      providesTags: ["TripRequests"],
    }),

    getSingleTrip: builder.query({
      query: ({ trip }: any) => ({
        url: `/v1/admin/trips/${trip}`,
        method: "GET",
      }),
      providesTags: ["Trips"],
    }),

    getSingleTripRequest: builder.query({
      query: (tripid: string) => ({
        url: `/v1/trip-requests/${tripid}`,
        method: "GET",
      }),
      providesTags: (result, error, tripid) => [
        { type: "TripRequests", id: tripid },
      ],
    }),

    // ✅ Approve a trip request
    approveTripRequest: builder.mutation({
      query: (tripid: string) => ({
        url: `/v1/trip-requests/${tripid}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, tripid) => [
        "TripRequests",
        { type: "TripRequests", id: tripid },
      ],
    }),

    // ✅ Decline a trip request (optionally send a reason)
    declineTripRequest: builder.mutation({
      query: ({ tripid, adminNote }: { tripid: string; adminNote?: string }) => ({
        url: `/v1/trip-requests/${tripid}/decline`,
        method: "PATCH",
        body: adminNote ? { adminNote } : undefined,
      }),
      invalidatesTags: (result, error, { tripid }) => [
        "TripRequests",
        { type: "TripRequests", id: tripid },
      ],
    }),
  }),
});

export const {
  useGetSingleTripQuery,
  useGetAllTripsQuery,
  useGetTripRequestQuery,
  useGetSingleTripRequestQuery,
  useApproveTripRequestMutation,
  useDeclineTripRequestMutation,
} = tripsApi;