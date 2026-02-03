// @/redux/services/Slices/settings/couponApiSlice.ts
import { api } from "@/redux/services/apiSlice";

export const couponApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get welcome coupon settings
    getWelcomeCouponSettings: builder.query({
      query: () => ({
        url: "/admin/coupons/settings/welcome-coupon",
        method: "GET",
      }),
      providesTags: ['WelcomeCoupon'],
    }),

    // Set welcome coupon settings
    setWelcomeCouponSettings: builder.mutation({
      query: (data) => ({
        url: "/admin/coupons/settings/welcome-coupon",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['WelcomeCoupon'],
    }),

    // Generate promotion coupon
    generateCoupon: builder.mutation({
      query: (data) => ({
        url: "/admin/coupons/generate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Coupons'],
    }),

    // Get generated coupons list
    getGeneratedCoupons: builder.query({
      query: ({ page = 1, limit = 10, search = '', filter = 'all', status = 'all' }) => ({
        url: `/admin/coupons?page=${page}&limit=${limit}&search=${search}&filter=${filter}&status=${status}`,
        method: "GET",
      }),
      providesTags: ['Coupons'],
    }),

    // Get single coupon details (We'll need to create this endpoint in backend)
    // For now, we'll filter from the list
    getCouponById: builder.query({
      query: (id) => ({
        url: `/admin/coupons/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: 'Coupons', id }],
    }),

    // Update coupon (We'll need to create this endpoint in backend)
    // For now, we'll use status update
    updateCoupon: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/coupons/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['Coupons'],
    }),

    // Update coupon status
    updateCouponStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/coupons/${id}/status`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['Coupons'],
    }),

    // Delete coupon
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/admin/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Coupons'],
    }),

    // Get coupon statistics
    getCouponStats: builder.query({
      query: () => ({
        url: "/admin/coupons/stats",
        method: "GET",
      }),
      providesTags: ['CouponStats'],
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