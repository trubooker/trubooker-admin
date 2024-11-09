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

const classScheduleApiConfig = api.enhanceEndpoints({ addTagTypes: ["Class"] });

const classScheduleApiSlice = classScheduleApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    createClassSchedule: builder.mutation<ClassProp, any>({
      query: (body) => ({
        url: "/classSchedules",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Class"],
    }),
    getClassSchedules: builder.query({
      query: ({ page, search }: any) => ({
        url: `/all-classes?${
          page
            ? `page=${encodeURIComponent(page)}`
            : `search=${encodeURIComponent(search)}`
        }`,
        method: "GET",
      }),
      providesTags: ["Class"],
    }),
    getSingleClassSchedule: builder.query({
      query: (classShedule: any) => ({
        url: `get-classShedule/${classShedule}`,
        method: "GET",
      }),
      providesTags: ["Class"],
    }),
    updateClassSchedule: builder.mutation({
      query: (formdata: FormData) => ({
        url: `/update-classSchedules`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["Class"],
    }),
    deleteClassSchedule: builder.mutation({
      query: (classShedule: any) => ({
        url: `/classSchedules/${classShedule}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Class"],
    }),
    deleteClassScheduleImage: builder.mutation({
      query: (media_ids: any) => ({
        url: `/delete-images`,
        method: "DELETE",
        body: media_ids,
      }),
      invalidatesTags: ["Class"],
    }),
    duplicateClassSchedule: builder.mutation({
      query: ({ body, id }: any) => ({
        url: `/classSchedules/${id}/duplicate`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Class"],
    }),
    getOtherCoursesByTeacher: builder.query({
      query: (teacherId: any) => ({
        url: `/get-teacher-class/${teacherId}`,
        method: "GET",
      }),
      providesTags: ["Class"],
    }),
    getTeacherByID: builder.query({
      query: (teacherId: any) => ({
        url: `/admin/teachers/${teacherId}`,
        method: "GET",
      }),
      providesTags: ["Class"],
    }),
  }),
});

export const {
  useCreateClassScheduleMutation,
  useDeleteClassScheduleMutation,
  useDuplicateClassScheduleMutation,
  useGetClassSchedulesQuery,
  useGetSingleClassScheduleQuery,
  useUpdateClassScheduleMutation,
  useGetTeacherByIDQuery,
  useGetOtherCoursesByTeacherQuery,
  useDeleteClassScheduleImageMutation,
} = classScheduleApiSlice;
