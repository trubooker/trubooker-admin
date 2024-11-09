import { api } from "../../apiSlice";

const cartApiConfig = api.enhanceEndpoints({ addTagTypes: ["Checkout"] });

const cartApiSlice = cartApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    addClassToCart: builder.mutation({
      query: (classSchedule: string) => ({
        url: `/cart/add-to-cart/${classSchedule}`,
        method: "POST",
      }),
      invalidatesTags: ["Checkout"],
    }),
    paySingleClass: builder.mutation({
      query: (classShedule: string) => ({
        url: `/cart/pay-for-single-class/${classShedule}`,
        method: "POST",
      }),
      invalidatesTags: ["Checkout"],
    }),

    removeClassFromCart: builder.mutation({
      query: (classSchedule: string) => ({
        url: `/cart/remove-from-cart/${classSchedule}`,
        method: "POST",
      }),
      invalidatesTags: ["Checkout"],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: `/cart/clear`,
        method: "POST",
      }),
      invalidatesTags: ["Checkout"],
    }),
    viewCart: builder.query({
      query: () => ({
        url: "/cart/view-cart",
        method: "GET",
      }),
      providesTags: ["Checkout"],
    }),
    checkoutCart: builder.mutation({
      query: () => ({
        url: "/cart/checkout",
        method: "POST",
      }),
      invalidatesTags: ["Checkout"],
    }),
    viewMyClasses: builder.query({
      query: (variety: any) => ({
        url: `/students/my-courses?variety=${variety}`,
        method: "GET",
      }),
      providesTags: ["Checkout"],
    }),
  }),
});

export const {
  useAddClassToCartMutation,
  useCheckoutCartMutation,
  useRemoveClassFromCartMutation,
  useClearCartMutation,
  usePaySingleClassMutation,
  useViewCartQuery,
  useViewMyClassesQuery,
} = cartApiSlice;
