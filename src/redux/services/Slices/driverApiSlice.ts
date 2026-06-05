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
        url: `/v1/admin/documents/${documentVerificationId}/approve`,
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
        url: `/v1/admin/documents/${documentVerificationId}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["Drivers"],
    }),

    getDrivers: builder.query({
      query: ({ page, search, limit = 10 }) => ({
        url: `/v1/admin/drivers?page=${page}&search=${search}&limit=${limit}`,
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
// Temporary debug version
addDriversDocument: builder.mutation({
  query: (formData) => {
    // Log the raw FormData entries
    console.log("🔍 MUTATION RECEIVED FORM DATA:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }
    
    return {
      url: `/v1/admin/drivers/add-document`,
      method: "POST",
      body: formData,
      // Don't set Content-Type
    };
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
} = driversApi;
