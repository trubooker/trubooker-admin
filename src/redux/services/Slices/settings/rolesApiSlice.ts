import { api } from "../../apiSlice";

const passengersApiConfig = api.enhanceEndpoints({
  addTagTypes: ["Roles"],
});
const passengersApi = passengersApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    assignRoleToUser: builder.mutation({
      query: (body) => ({
        url: `/admin/assign-role-to-user`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Roles"],
    }),

    getRoles: builder.query({
      query: () => ({
        url: `/admin/get-roles`,
        method: "GET",
      }),
      providesTags: ["Roles"],
    }),

    groupUserByRoles: builder.query({
      query: () => ({
        url: `/admin/group-users-by-role`,
        method: "GET",
      }),
      providesTags: ["Roles"],
    }),

    getRolesById: builder.query({
      query: (id) => ({
        url: `/admin/get-role-by-id/${id}`,
        method: "GET",
      }),
      providesTags: ["Roles"],
    }),

    getPermissions: builder.query({
      query: () => ({
        url: `/admin/get-permissions`,
        method: "GET",
      }),
      providesTags: ["Roles"],
    }),

    getPermissionsById: builder.query({
      query: (id) => ({
        url: `/admin/get-permission-by-id/${id}`,
        method: "GET",
      }),
      providesTags: ["Roles"],
    }),

    getUsersByRole: builder.query({
      query: ({ page, search }) => ({
        url: `/admin/user-by-role?page=${page}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["Roles"],
    }),

    updateRoles: builder.mutation({
      query: ({id, body}: any) => ({
        url: `/admin/update-roles/${id}`,
        method: "PUT",
        body
      }),
      invalidatesTags: ["Roles"],
    }),
  }),
});

export const {
  useAssignRoleToUserMutation,
  useGetRolesQuery,
  useUpdateRolesMutation,
  useGetPermissionsByIdQuery,
  useGetPermissionsQuery,
  useGetUsersByRoleQuery,
  useGetRolesByIdQuery,
  useGroupUserByRolesQuery,
} = passengersApi;
