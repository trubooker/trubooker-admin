import { api } from "../../apiSlice";

const giftclassApiConfig = api.enhanceEndpoints({ addTagTypes: ["GiftClass"] });

const giftClassApiSlice = giftclassApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    giftClass: builder.mutation({
      query: (data: any) => ({
        url: `/classShedule/gitf-a-class`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["GiftClass"],
    }),
    proceedToGiftClass: builder.mutation({
      query: (giftClass: any) => ({
        url: `/classShedule/process-gift-class/${giftClass}`,
        method: "POST",
      }),
      invalidatesTags: ["GiftClass"],
    }),
    cancelGifting: builder.mutation({
      query: (giftClass: any) => ({
        url: `/classShedule/cancel-gift-class/${giftClass}`,
        method: "POST",
      }),
      invalidatesTags: ["GiftClass"],
    }),
  }),
});

export const {
  useGiftClassMutation,
  useCancelGiftingMutation,
  useProceedToGiftClassMutation,
} = giftClassApiSlice;
