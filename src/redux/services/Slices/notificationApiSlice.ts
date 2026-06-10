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
      query: () => ({
        url: `/v1/notifications/all`,
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    markAllAsRead: builder.mutation({
      query: () => ({
        url: `/v1/notifications/markall`,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),

    markOneAsRead: builder.mutation({
      query: (id: any) => ({
        url: `/v1/notifications/mark-as-read/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),

    deleteAllNotifications: builder.mutation({
      query: () => ({
        url: `/v1/notifications/delete-notify`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),

    deleteOneNotification: builder.mutation({
      query: (id: any) => ({
        url: `/v1/notifications/clear/${id}`,
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
