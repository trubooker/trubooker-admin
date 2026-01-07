import { api } from "../apiSlice";

const driversApiConfig = api.enhanceEndpoints({
  addTagTypes: ["Drivers"],
});
const driversApi = driversApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    getDriversDocuments: builder.query({
      query: (driverId: string) => ({
        url: `/admin/drivers/fetch-drivers-document/${driverId}`,
        method: "GET",
      }),
      providesTags: ["Drivers"],
    }),

    approveDriversDocuments: builder.mutation({
      query: (documentVerificationId: string) => ({
        url: `/admin/drivers/approve-document/${documentVerificationId}`,
        method: "POST",
      }),
      invalidatesTags: ["Drivers"],
    }),

    rejectDriversDocuments: builder.mutation({
      query: ({
        documentVerificationId,
        reason,
      }: {
        documentVerificationId: string;
        reason: string;
      }) => ({
        url: `/admin/drivers/reject-document/${documentVerificationId}`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["Drivers"],
    }),

    getDrivers: builder.query({
      query: ({ page, search, per_page = 10 }) => ({
        url: `/admin/drivers?page=${page}&search=${search}&per_page=${per_page}`,
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
  useGetDriversDocumentsQuery,
  useApproveDriversDocumentsMutation,
  useRejectDriversDocumentsMutation,
} = driversApi;
