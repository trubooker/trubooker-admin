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
      query: ({ status, page = 1, limit = 20 }: any = {}) => ({
        url: `/v1/trip-requests`,
        method: "GET",
        // undefined `status` is stripped by fetchBaseQuery => returns ALL statuses.
        // an array serializes as ?status=approved&status=fulfilled (DTO now accepts it).
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

    // ✅ Approve a trip request.
    // Called as approveTripRequest(id) OR approveTripRequest({ tripid, tripId, adminNote }).
    approveTripRequest: builder.mutation({
      query: (
        arg:
          | string
          | { tripid: string; tripId?: string; adminNote?: string },
      ) => {
        const { tripid, ...body } =
          typeof arg === "string" ? { tripid: arg } : arg;
        return {
          url: `/v1/trip-requests/${tripid}/approve`,
          method: "PATCH",
          // {} when called with just an id; { tripId, adminNote } otherwise
          body,
        };
      },
      invalidatesTags: (result, error, arg) => {
        const tripid = typeof arg === "string" ? arg : arg.tripid;
        return ["TripRequests", { type: "TripRequests", id: tripid }];
      },
    }),

    // ✅ Decline a trip request. Backend requires a non-empty `reason`.
    // Accepts either `reason` or your existing `adminNote` and sends `reason`.
    declineTripRequest: builder.mutation({
      query: ({
        tripid,
        reason,
        adminNote,
      }: {
        tripid: string;
        reason?: string;
        adminNote?: string;
      }) => ({
        url: `/v1/trip-requests/${tripid}/decline`,
        method: "PATCH",
        body: { reason: reason ?? adminNote ?? "" },
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