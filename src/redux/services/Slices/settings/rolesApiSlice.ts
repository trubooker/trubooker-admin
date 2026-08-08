import { api } from "../../apiSlice";

const passengersApiConfig = api.enhanceEndpoints({
  addTagTypes: ["Roles"],
});
const passengersApi = passengersApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    assignRoleToUser: builder.mutation({
      query: (body) => ({
        url: `/v1/admin/assign-role-to-user`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Roles"],
    }),

    inviteAdmin: builder.mutation({
      query: (body) => ({
        url: `/v1/admin/invite-admin`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Roles"],
    }),

    getRoles: builder.query({
      query: () => ({
        url: `/v1/admin/get-roles`,
        method: "GET",
      }),
      providesTags: ["Roles"],
    }),

    groupUserByRoles: builder.query({
      query: () => ({
        url: `/v1/admin/group-users-by-role`,
        method: "GET",
      }),
      providesTags: ["Roles"],
    }),

    getRolesById: builder.query({
      query: (id) => ({
        url: `/v1/admin/get-role-by-id/${id}`,
        method: "GET",
      }),
      providesTags: ["Roles"],
    }),

    getPermissions: builder.query({
      query: () => ({
        url: `/v1/admin/get-permissions`,
        method: "GET",
      }),
      providesTags: ["Roles"],
    }),

    getPermissionsById: builder.query({
      query: (id) => ({
        url: `/v1/admin/get-permission-by-id/${id}`,
        method: "GET",
      }),
      providesTags: ["Roles"],
    }),

getUsersByRole: builder.query({
  query: ({ page = 1, search = "" }) => ({
    url: `/v1/admin/user-by-role`,
    method: "GET",
    params: {
      page,
      search,
    },
  }),
  providesTags: ["Roles"],
}),

    updateRoles: builder.mutation({
      query: ({ name, permissions, id }: any) => ({
        url: `/v1/admin/update-roles/${id}`,
        method: "PUT",
        body: { name, permissions },
      }),
      invalidatesTags: ["Roles"],
    }),
  }),
});

export const {
  useAssignRoleToUserMutation,
  useInviteAdminMutation,
  useGetRolesQuery,
  useUpdateRolesMutation,
  useGetPermissionsByIdQuery,
  useGetPermissionsQuery,
  useGetUsersByRoleQuery,
  useGetRolesByIdQuery,
  useGroupUserByRolesQuery,
} = passengersApi;
