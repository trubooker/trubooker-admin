import { api } from "../apiSlice";



const vehicleApiConfig = api.enhanceEndpoints({
  addTagTypes: ["Vehicles", "VehicleTypes"],
});

const vehicleApi = vehicleApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    getVehicleTypes: builder.query({
      query: () => ({
        url: `/v1/admin/vehicle-types`,
        method: "GET",
      }),
      providesTags: ["VehicleTypes"],
    }),

    addVehicle: builder.mutation({
      query: (formData) => ({
        url: `/v1/admin/drivers/add-vehicle`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Vehicles"],
    }),

    updateVehicle: builder.mutation({
      query: (formData) => ({
        url: `/v1/admin/drivers/update-vehicle`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Vehicles"],
    }),

    deleteVehicle: builder.mutation({
      query: (vehicleId) => ({
        url: `/v1/admin/drivers/delete-vehicle/${vehicleId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vehicles"],
    }),

    getDriverVehicles: builder.query({
      query: (driverId) => ({
        url: `/v1/admin/drivers/vehicles/${driverId}`,
        method: "GET",
      }),
      providesTags: ["Vehicles"],
    }),
  }),
});

export const {
  useGetVehicleTypesQuery,
  useAddVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useGetDriverVehiclesQuery,
} = vehicleApi;