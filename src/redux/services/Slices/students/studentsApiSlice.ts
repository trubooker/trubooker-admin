import { api } from "../../apiSlice";

const studentApiConfig = api.enhanceEndpoints({ addTagTypes: ["Student"] });

const studentApiSlice = studentApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    addClassToCalendar: builder.mutation({
      query: (classShedule: string) => ({
        url: `/students/add-to-calendar/${classShedule}`,
        method: "POST",
      }),
      invalidatesTags: ["Student"],
    }),
    viewReceipt: builder.query({
      query: (id: any) => ({
        url: `/students/view-reciept?class_schedule_id=${id}`,
        method: "GET",
      }),
      providesTags: ["Student"],
    }),

    addTeacherToFavourite: builder.mutation({
      query: (classSchedule: string) => ({
        url: `/students/add-favourite-teacher/${classSchedule}`,
        method: "POST",
      }),
      invalidatesTags: ["Student"],
    }),
    fetchFavTeachers: builder.query({
      query: () => ({
        url: "/students/favourite-teachers",
        method: "GET",
      }),
      providesTags: ["Student"],
    }),
    removeTeacherFromFavourite: builder.mutation({
      query: (teacherId: string) => ({
        url: `/students/remove-favourite-teacher/${teacherId}`,
        method: "POST",
      }),
      invalidatesTags: ["Student"],
    }),
    deleteComment: builder.mutation({
      query: (comment: string) => ({
        url: `/classShedule/delete-comment/${comment}`,
        method: "POST",
      }),
      invalidatesTags: ["Student"],
    }),
    rateClass: builder.mutation({
      query: ({ classShedule, rating }: any) => ({
        url: `/students/rate-class/${classShedule}`,
        method: "POST",
        body: { rating },
      }),
      invalidatesTags: ["Student"],
    }),
    addComment: builder.mutation({
      query: ({ classShedule, comment }: any) => ({
        url: `/classShedule/${classShedule}/add-comment`,
        method: "POST",
        body: { comment },
      }),
      invalidatesTags: ["Student"],
    }),
    fetchComments: builder.query({
      query: (classShedule: any) => ({
        url: `/classShedule/${classShedule}/fetch-comments`,
        method: "GET",
      }),
      providesTags: ["Student"],
    }),
    getAllTeachers: builder.query({
      // query: () => ({
      //   url: `/admin/teachers`,
      //   method: "GET",
      // }),
      query: ({ page, search }: any) => ({
        url: `/admin/teachers?${
          page
            ? `page=${encodeURIComponent(page)}`
            : `search=${encodeURIComponent(search)}`
        }`,
        method: "GET",
      }),
      providesTags: ["Student"],
    }),
  }),
});

export const {
  useDeleteCommentMutation,
  useRateClassMutation,
  useFetchCommentsQuery,
  useGetAllTeachersQuery,
  useAddClassToCalendarMutation,
  useAddCommentMutation,
  useViewReceiptQuery,
  useAddTeacherToFavouriteMutation,
  useFetchFavTeachersQuery,
  useRemoveTeacherFromFavouriteMutation,
} = studentApiSlice;
