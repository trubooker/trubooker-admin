import { api } from "../../apiSlice";

interface ClassProp {
  title: string;
  description: string;
  currency: string;
  price: number;
  class_date: string;
  class_time: string;
  studio_name: string;
  studio_address: string;
  class_size: number;
  class_type: string;
  frequency: string;
  duration: string;
  images: File;
}

const teacherClassApiConfig = api.enhanceEndpoints({
  addTagTypes: ["MyClass"],
});

const teacherClassApiSlice = teacherClassApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    createTeacherClassSchedule: builder.mutation({
      query: ({ formdata }) => ({
        url: "/classSchedules",
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["MyClass"],
    }),
    getTeacherClassSchedules: builder.query({
      query: (variety: any) => ({
        url: `/teachers/my-classes?variety=${variety}`,
        method: "GET",
      }),
      providesTags: ["MyClass"],
    }),
    getBusinessDetails: builder.query({
      query: () => ({
        url: `/teachers/my-business`,
        method: "GET",
      }),
      providesTags: ["MyClass"],
    }),
    getTeacherClassAttendee: builder.query({
      query: (variety: any) => ({
        url: `/teachers/my-students?class_shedule_id=${variety}`,
        method: "GET",
      }),
      providesTags: ["MyClass"],
    }),
    getAllTeacherStudents: builder.query({
      query: () => ({
        url: `/teachers/all-students`,
        method: "GET",
      }),
      providesTags: ["MyClass"],
    }),
    getSingleTeacherClassSchedule: builder.query({
      query: (classShedule: any) => ({
        url: `classSchedules/${classShedule}`,
        method: "GET",
      }),
      providesTags: ["MyClass"],
    }),
    addClassToCalendar: builder.mutation({
      query: (classSheduleID: string) => ({
        url: `/teachers/add-class-to-calendar/${classSheduleID}`,
        method: "POST",
      }),
      invalidatesTags: ["MyClass"],
    }),
    updateClassSchedule: builder.mutation({
      query: (formdata: FormData) => ({
        url: `/update-classSchedules`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["MyClass"],
    }),
    deleteClassSchedule: builder.mutation({
      query: (classShedule: any) => ({
        url: `/classSchedules/${classShedule}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MyClass"],
    }),
    duplicateClassSchedule: builder.mutation({
      query: ({ body, id }: any) => ({
        url: `/classSchedules/${id}/duplicate`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["MyClass"],
    }),
    getOtherCoursesByTeacher: builder.query({
      query: (classSchedule: any) => ({
        url: `/get-teacher-class/${classSchedule}`,
        method: "GET",
      }),
      providesTags: ["MyClass"],
    }),
    fetchStudentsRecords: builder.query({
      query: ({ student, variety }: any) => ({
        url: `/teachers/fetch-student-profile/${student}?variety=${variety}`,
        method: "GET",
      }),
      providesTags: ["MyClass"],
    }),
    getTeacherOtherCourses: builder.query({
      query: (classShedule: any) => ({
        url: `/teachers/my-other-course/${classShedule}`,
        method: "GET",
      }),
      providesTags: ["MyClass"],
    }),
    getTeacherStudentsProfile: builder.query({
      query: (studentId: any) => ({
        url: `/teachers/student-profile?student_id=${studentId}`,
        method: "GET",
      }),
      providesTags: ["MyClass"],
    }),
    sendPromo: builder.mutation({
      query: (body) => ({
        url: "/teachers/send-promo",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MyClass"],
    }),
  }),
});

export const {
  useCreateTeacherClassScheduleMutation,
  useDeleteClassScheduleMutation,
  useFetchStudentsRecordsQuery,
  useDuplicateClassScheduleMutation,
  useGetTeacherClassSchedulesQuery,
  useGetAllTeacherStudentsQuery,
  useGetBusinessDetailsQuery,
  useGetTeacherOtherCoursesQuery,
  useGetTeacherClassAttendeeQuery,
  useGetTeacherStudentsProfileQuery,
  useGetSingleTeacherClassScheduleQuery,
  useUpdateClassScheduleMutation,
  useAddClassToCalendarMutation,
  useGetOtherCoursesByTeacherQuery,
  useSendPromoMutation,
} = teacherClassApiSlice;
