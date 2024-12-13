import { api } from "../apiSlice";

interface Enum {
  type: "read" | "unread";
}

const notificationApiConfig = api.enhanceEndpoints({
  addTagTypes: ["Notification"],
});
const notificationApi = notificationApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    fetchNotifications: builder.query({
      query: ({ type }: Enum) => ({
        url: `/notifications/fetch?type=${type}`,
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    // getOneDriver: builder.query({
    //   query: (driver) => ({
    //     url: `/admin/notification/${driver}`,
    //     method: "GET",
    //   }),
    //   providesTags: ["Notification"],
    // }),

    // getTripDetails: builder.query({
    //   query: (trip) => ({
    //     url: `/admin/notification/trip/${trip}`,
    //     method: "GET",
    //   }),
    //   providesTags: ["Notification"],
    // }),

    // togglenotificationtatus: builder.mutation({
    //   query: (driver) => ({
    //     url: `/admin/notification/toggle-status/${driver}`,
    //     method: "PATCH",
    //   }),
    //   invalidatesTags: ["Notification"],
    // }),
  }),
});

export const { useFetchNotificationsQuery } = notificationApi;
