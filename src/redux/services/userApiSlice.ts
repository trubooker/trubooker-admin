import { api } from "./apiSlice";

const userApiConfig = api.enhanceEndpoints({ addTagTypes: ["User"] });

const userApi = userApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => `/user`,
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),
    editTeacherProfile: builder.mutation({
      query: (formdata: FormData) => ({
        url: `/user/update-teacher-profile`,
        method: `POST`,
        body: formdata,
      }),
      invalidatesTags: ["User"],
    }),
    editStudentProfile: builder.mutation({
      query: (formdata: FormData) => ({
        url: `/user`,
        method: `POST`,
        body: formdata,
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCurrentUserQuery,
  useEditTeacherProfileMutation,
  useEditStudentProfileMutation,
} = userApi;
