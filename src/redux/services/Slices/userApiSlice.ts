import { api } from "../apiSlice";

const userApiConfig = api.enhanceEndpoints({ addTagTypes: ["User"] });
const userApi = userApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => `/v1/admin/get-profile`,
      providesTags: ["User"],
      // keepUnusedDataFor: 5,
    }),

    // updateProfile: builder.mutation({
    //   query: (body) => ({
    //     url: `/v1/admin/update-profile`,
    //     method: "PATCH",
    //     body,
    //   }),
    //   invalidatesTags: ["User"],
    // }),

  updateProfile: builder.mutation({
  query: (body) => {
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any);
      }
    });
    return {
      url: `/v1/admin/update-profile`,
      method: "PATCH",
      body: formData,
    };
  },
  invalidatesTags: ["User"],
}),

    updatePassword: builder.mutation({
      query: ({ current_password, password, password_confirmation }: any) => ({
        url: `/v1/admin/password-update`,
        method: "POST",
        body: { current_password, password, password_confirmation },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} = userApi;
