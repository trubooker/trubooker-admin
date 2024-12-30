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

    markAllAsRead: builder.mutation({
      query: () => ({
        url: `/notifications/mark-all-as-read`,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),

    markOneAsRead: builder.mutation({
      query: (id: any) => ({
        url: `/notifications/mark-as-read/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),

    deleteAllNotifications: builder.mutation({
      query: () => ({
        url: `/notifications/clear`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),

    deleteOneNotification: builder.mutation({
      query: (id: any) => ({
        url: `/notifications/clear/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useFetchNotificationsQuery,
  useDeleteAllNotificationsMutation,
  useDeleteOneNotificationMutation,
  useMarkAllAsReadMutation,
  useMarkOneAsReadMutation,
} = notificationApi;
