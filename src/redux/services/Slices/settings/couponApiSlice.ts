import { api } from "@/redux/services/apiSlice";

export const couponApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get the active welcome coupon (your route is welcome/active, GET)
    getWelcomeCouponSettings: builder.query({
      query: () => "/v1/admin/coupons/welcome/active",
      transformResponse: (res: any) => res.result,
      providesTags: ["WelcomeCoupon"],
    }),

    // Toggle/set the welcome coupon (your route is welcome/toggle, POST)
    setWelcomeCouponSettings: builder.mutation({
      query: (data) => ({
        url: "/v1/admin/coupons/welcome/toggle",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["WelcomeCoupon"],
    }),

    generateCoupon: builder.mutation({
      query: (data) => ({
        url: "/v1/admin/coupons/generate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupons"],
    }),

    getGeneratedCoupons: builder.query({
      // Your list endpoint supports page/limit/type/isActive. Map your UI
      // filters to those, or extend the backend list() to accept search/status.
      query: ({ page = 1, limit = 10 }) =>
        `/v1/admin/coupons?page=${page}&limit=${limit}`,
      transformResponse: (res: any) => res.result,
      providesTags: ["Coupons"],
    }),

    getCouponById: builder.query({
      query: (id) => `/v1/admin/coupons/${id}`,
      transformResponse: (res: any) => res.result,
      providesTags: (r, e, id) => [{ type: "Coupons", id }],
    }),

    // Your backend route is :id/update (PUT)
    updateCoupon: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/v1/admin/coupons/${id}/update`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Coupons"],
    }),

    updateCouponStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/v1/admin/coupons/${id}/status`,
        method: "PUT",
        body: data, // { isActive: boolean }
      }),
      invalidatesTags: ["Coupons"],
    }),

    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/v1/admin/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupons"],
    }),

    getCouponStats: builder.query({
      query: () => "/v1/admin/coupons/stats",
      transformResponse: (res: any) => res.result,
      providesTags: ["CouponStats"],
    }),
  }),
});

export const {
  useGetWelcomeCouponSettingsQuery,
  useSetWelcomeCouponSettingsMutation,
  useGenerateCouponMutation,
  useGetGeneratedCouponsQuery,
  useGetCouponByIdQuery,
  useUpdateCouponMutation,
  useUpdateCouponStatusMutation,
  useDeleteCouponMutation,
  useGetCouponStatsQuery,
} = couponApiSlice;
// // @/redux/services/Slices/settings/couponApiSlice.ts
// import { api } from "@/redux/services/apiSlice";

// export const couponApiSlice = api.injectEndpoints({
//   endpoints: (builder) => ({
//     // Get welcome coupon settings
//     getWelcomeCouponSettings: builder.query({
//       query: () => ({
//         url: "/v1/admin/coupons/welcome/activate",
//         method: "GET",
//       }),
//       providesTags: ['WelcomeCoupon'],
//     }),

//     // Set welcome coupon settings
//     setWelcomeCouponSettings: builder.mutation({
//       query: (data) => ({
//         url: "/v1/admin/coupons/create",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ['WelcomeCoupon'],
//     }),

//     // Generate promotion coupon
//     generateCoupon: builder.mutation({
//       query: (data) => ({
//         url: "/admin/coupons/generate",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ['Coupons'],
//     }),

//     // Get generated coupons list
//     getGeneratedCoupons: builder.query({
//       query: ({ page = 1, limit = 10, search = '', filter = 'all', status = 'all' }) => ({
//         url: `/admin/coupons?page=${page}&limit=${limit}&search=${search}&filter=${filter}&status=${status}`,
//         method: "GET",
//       }),
//       providesTags: ['Coupons'],
//     }),

//     // Get single coupon details (We'll need to create this endpoint in backend)
//     // For now, we'll filter from the list
//     getCouponById: builder.query({
//       query: (id) => ({
//         url: `/v1/admin/coupons/${id}`,
//         method: "GET",
//       }),
//       providesTags: (result, error, id) => [{ type: 'Coupons', id }],
//     }),

//     // Update coupon (We'll need to create this endpoint in backend)
//     // For now, we'll use status update
//     updateCoupon: builder.mutation({
//       query: ({ id, ...data }) => ({
//         url: `/admin/coupons/${id}`,
//         method: "PUT",
//         body: data,
//       }),
//       invalidatesTags: ['Coupons'],
//     }),

//     // Update coupon status
//     updateCouponStatus: builder.mutation({
//       query: ({ id, ...data }) => ({
//         url: `/admin/coupons/${id}/status`,
//         method: "PUT",
//         body: data,
//       }),
//       invalidatesTags: ['Coupons'],
//     }),

//     // Delete coupon
//     deleteCoupon: builder.mutation({
//       query: (id) => ({
//         url: `/admin/coupons/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ['Coupons'],
//     }),

//     // Get coupon statistics
//     getCouponStats: builder.query({
//       query: () => ({
//         url: "/admin/coupons/stats",
//         method: "GET",
//       }),
//       providesTags: ['CouponStats'],
//     }),
//   }),
// });

// export const {
//   useGetWelcomeCouponSettingsQuery,
//   useSetWelcomeCouponSettingsMutation,
//   useGenerateCouponMutation,
//   useGetGeneratedCouponsQuery,
//   useGetCouponByIdQuery,
//   useUpdateCouponMutation,
//   useUpdateCouponStatusMutation,
//   useDeleteCouponMutation,
//   useGetCouponStatsQuery,
// } = couponApiSlice;