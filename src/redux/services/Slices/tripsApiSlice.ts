import { api } from "../apiSlice";

const tripsApiConfig = api.enhanceEndpoints({
  addTagTypes: ["Trips", "TripRequests", "NoShows"],
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
          body,
        };
      },
      invalidatesTags: (result, error, arg) => {
        const tripid = typeof arg === "string" ? arg : arg.tripid;
        return ["TripRequests", { type: "TripRequests", id: tripid }];
      },
    }),

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

    // ============================================================
    // ADMIN — No-Show / Driver Refund endpoints
    // ============================================================

    // 3) List no-shows with optional status filter + pagination
    getAllNoShows: builder.query({
      query: ({ status, page = 1, limit = 20 }: any = {}) => ({
        url: `/v1/admin/no-shows`,
        method: "GET",
        params: { status, page, limit },
      }),
      providesTags: ["NoShows"],
      // 👇 DEBUG LOG: fires whenever the query resolves with data
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log(
          "[getAllNoShows] 🚀 Request params:",
          JSON.stringify(arg, null, 2)
        );
        try {
          const { data } = await queryFulfilled;
          console.log(
            "[getAllNoShows] ✅ Full response:",
            JSON.stringify(data, null, 2)
          );
          console.log(
            "[getAllNoShows] 📦 List count:",
            data?.result?.data?.length ?? 0
          );
          console.log(
            "[getAllNoShows] 📄 Pagination meta:",
            JSON.stringify(data?.result?.meta, null, 2)
          );
          if (data?.result?.data?.length) {
            console.log(
              "[getAllNoShows] 🧾 First no-show item:",
              JSON.stringify(data.result.data[0], null, 2)
            );
          }
        } catch (err) {
          console.error("[getAllNoShows] ❌ Failed:", err);
        }
      },
    }),

    // 4) Single no-show details
    getSingleNoShow: builder.query({
      query: (id: string) => ({
        url: `/v1/admin/no-shows/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "NoShows", id }],
      // 👇 DEBUG LOG: fires whenever a single no-show is fetched
      async onQueryStarted(id, { queryFulfilled }) {
        console.log("[getSingleNoShow] 🚀 Requesting id:", id);
        try {
          const { data } = await queryFulfilled;
          console.log(
            "[getSingleNoShow] ✅ Full response:",
            JSON.stringify(data, null, 2)
          );
          console.log(
            "[getSingleNoShow] 🧾 No-show payload:",
            JSON.stringify(data?.result ?? data?.data ?? data, null, 2)
          );
          console.log(
            "[getSingleNoShow] 📍 Coordinates:",
            {
              latitude: data?.result?.latitude ?? data?.data?.latitude,
              longitude: data?.result?.longitude ?? data?.data?.longitude,
            }
          );
          console.log(
            "[getSingleNoShow] 🕒 Reported at:",
            data?.result?.reportedAt ??
              data?.data?.reportedAt ??
              data?.result?.createdAt ??
              data?.data?.createdAt
          );
        } catch (err) {
          console.error("[getSingleNoShow] ❌ Failed:", err);
        }
      },
    }),

    // 5) Approve a no-show (credits driver wallet)
    approveNoShow: builder.mutation({
      query: ({
        id,
        adminNote,
      }: {
        id: string;
        adminNote?: string;
      }) => ({
        url: `/v1/admin/no-shows/${id}/approve`,
        method: "PATCH",
        body: adminNote ? { adminNote } : {},
      }),
      invalidatesTags: (result, error, { id }) => [
        "NoShows",
        { type: "NoShows", id },
      ],
      // 👇 DEBUG LOG: fires after the mutation succeeds/fails
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log(
          "[approveNoShow] 🚀 Request payload:",
          JSON.stringify(arg, null, 2)
        );
        try {
          const { data } = await queryFulfilled;
          console.log(
            "[approveNoShow] ✅ Response:",
            JSON.stringify(data, null, 2)
          );
        } catch (err) {
          console.error("[approveNoShow] ❌ Failed:", err);
        }
      },
    }),

    // 6) Decline a no-show
    declineNoShow: builder.mutation({
      query: ({
        id,
        reason,
      }: {
        id: string;
        reason?: string;
      }) => ({
        url: `/v1/admin/no-shows/${id}/decline`,
        method: "PATCH",
        body: { reason: reason ?? "" },
      }),
      invalidatesTags: (result, error, { id }) => [
        "NoShows",
        { type: "NoShows", id },
      ],
      // 👇 DEBUG LOG: fires after the mutation succeeds/fails
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log(
          "[declineNoShow] 🚀 Request payload:",
          JSON.stringify(arg, null, 2)
        );
        try {
          const { data } = await queryFulfilled;
          console.log(
            "[declineNoShow] ✅ Response:",
            JSON.stringify(data, null, 2)
          );
        } catch (err) {
          console.error("[declineNoShow] ❌ Failed:", err);
        }
      },
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
  useGetAllNoShowsQuery,
  useGetSingleNoShowQuery,
  useApproveNoShowMutation,
  useDeclineNoShowMutation,
} = tripsApi;