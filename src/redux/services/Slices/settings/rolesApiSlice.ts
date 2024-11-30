import { api } from "../../apiSlice";

const passengersApiConfig = api.enhanceEndpoints({
  addTagTypes: ["Roles"],
});
const passengersApi = passengersApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    addToRole: builder.mutation({
      query: () => ({
        url: ``,
        method: "GET",
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
      query: (id) => ({
        url: `/admin/update-roles/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Roles"],
    }),
  }),
});

export const {
  useAddToRoleMutation,
  useGetRolesQuery,
  useUpdateRolesMutation,
  useGetPermissionsByIdQuery,
  useGetPermissionsQuery,
  useGetUsersByRoleQuery,
  useGetRolesByIdQuery,
} = passengersApi;
