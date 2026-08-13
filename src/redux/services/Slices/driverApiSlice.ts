import { api } from "../apiSlice";

const driversApiConfig = api.enhanceEndpoints({
  addTagTypes: ["Drivers"],
});
const driversApi = driversApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    getDriversDocuments: builder.query({
      query: (driverId: string) => ({
        url: `/v1/admin/drivers/fetch-drivers-document/${driverId}`,
        method: "GET",
      }),
      providesTags: ["Drivers"],
    }),

    approveDriversDocuments: builder.mutation({
      query: (documentVerificationId: string) => ({
        url: `/v1/admin/documents/${documentVerificationId}/approve`,
        method: "PATCH",
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
        url: `/v1/admin/documents/${documentVerificationId}/reject`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Drivers"],
    }),

    getDrivers: builder.query({
  query: ({ page, search = "", limit = 10 }) => ({
    url: `/v1/admin/drivers?page=${page}&search=${encodeURIComponent(search)}&limit=${limit}`,
    method: "GET",
  }),
  providesTags: ["Drivers"],
}),



    getOneDriver: builder.query({
      query: (driver) => ({
        url: `/v1/admin/drivers/${driver}`,
        method: "GET",
      }),
      providesTags: ["Drivers"],
    }),

    getTripDetails: builder.query({
      query: (trip) => ({
        url: `/v1/admin/trips/${trip}`,
        method: "GET",
      }),
      providesTags: ["Drivers"],
    }),

    toggleDriverStatus: builder.mutation({
      query: (driver) => ({
        url: `/v1/admin/drivers/toggle-status/${driver}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Drivers"],
    }),

addDriversDocument: builder.mutation({
  query: ({ id, formData }) => {
    // Check if formData is FormData or plain object
    if (formData instanceof FormData) {
      // If it's FormData, send as multipart
      return {
        url: `/v1/admin/drivers/add-document/${id}`,
        method: "POST",
        body: formData,
        // Don't set Content-Type
      };
    } else {
      // If it's a plain object, send as JSON
      return {
        url: `/v1/admin/drivers/add-document/${id}`,
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    }
  },
  invalidatesTags: ["Drivers"],

}),

updateDriversDocument: builder.mutation({
  query: ({ id, formData }) => ({
    url: `/v1/admin/drivers/update-document/${id}`,
    method: "POST",
    body: formData,
  }),
  invalidatesTags: ["Drivers"],
}),

deleteDriversDocument: builder.mutation({
  query: (id) => ({
    url: `/v1/admin/drivers/delete-document/${id}`,
    method: "DELETE",
  }),
  invalidatesTags: ["Drivers"],
}),

getDocumentHistory: builder.query({
  query: (driverId) => ({
    url: `/v1/admin/drivers/document-history/${driverId}`,
    method: "GET",
  }),
  providesTags: ["Drivers"],
}),

getApprovedDriversCount: builder.query({
  query: () => ({
    url: `/v1/admin/drivers/approved/count`,
    method: "GET",
  }),
  providesTags: ["Drivers"],
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
    useAddDriversDocumentMutation,
  useUpdateDriversDocumentMutation,
  useDeleteDriversDocumentMutation,
  useGetDocumentHistoryQuery,
   useGetApprovedDriversCountQuery,
} = driversApi;
