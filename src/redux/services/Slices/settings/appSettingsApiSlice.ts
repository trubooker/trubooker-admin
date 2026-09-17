import { api } from "../../apiSlice";

// Matches the backend UpdateAppVersionDto exactly
export interface UpdateAppVersionDto {
  appType: "passenger" | "driver";
  platform: "android" | "ios";
  minVersion: string;
  latestVersion: string;
  isForceUpdate: boolean;
  isEnabled: boolean;
  updateMessage: string | null;
}

// ── Price per km types ─────────────────────────────────────────────────────

export interface SetPricePerKmDto {
  pricePerKm: number;
}

// ── Dispatch window types ──────────────────────────────────────────────────

export interface DispatchWindowSettings {
  intraStateDispatchWindowHours: number;
  interStateDispatchWindowHours: number;
}

export type UpdateDispatchWindowDto = DispatchWindowSettings;

// ── Settings get-all types ─────────────────────────────────────────────────

export interface SettingValue {
  // price_control fields
  agentEarningAmount?: number;
  platformCommissionRate?: number;
  driverEarningRate?: number;
  minTripPrice?: number;
  maxTripPrice?: number;
  intraStateDispatchWindowHours?: number;
  interStateDispatchWindowHours?: number;
  perKmRate?: number;
  pricePerKm?: number;
  // allow other shapes without type errors
  [key: string]: unknown;
}

export interface SettingEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  createdBy: string | null;
  key: string;
  description: string;
  value: SettingValue;
}

export type GetAllSettingsResponse = SettingEntry[];

export const appSettingsApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // ── App Version endpoints ─────────────────────────────────────────────
    getAppSettings: builder.query({
      query: () => "/v1/admin/app-versions",
      providesTags: ["AppSettings"],
    }),

    updateAppSettings: builder.mutation<void, UpdateAppVersionDto>({
      query: (dto) => ({
        url: "/v1/admin/app-versions/update",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["VersionHistory"],
    }),

    getVersionHistory: builder.query({
      query: (params) => ({
        url: "/v1/admin/history",
        params,
      }),
      providesTags: ["VersionHistory"],
    }),

    // ── Settings get-all (read) ───────────────────────────────────────────
    getAllSettings: builder.query<GetAllSettingsResponse, void>({
      query: () => "/v1/admin/settings/get-all",
      providesTags: ["Settings"],
    }),

    // ── Price per km (write) ──────────────────────────────────────────────
    setPricePerKm: builder.mutation<void, SetPricePerKmDto>({
      query: (dto) => ({
        url: "/v1/admin/settings/price-per-km",
        method: "POST",
        body: dto,
      }),
      invalidatesTags: ["Settings"],
    }),

    // ── Dispatch window (write) ───────────────────────────────────────────
    updateDispatchWindow: builder.mutation<void, UpdateDispatchWindowDto>({
      query: (dto) => ({
        url: "/v1/admin/settings/dispatch-window",
        method: "PATCH",
        body: dto,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetAppSettingsQuery,
  useUpdateAppSettingsMutation,
  useGetVersionHistoryQuery,
  useGetAllSettingsQuery,
  useSetPricePerKmMutation,
  useUpdateDispatchWindowMutation,
} = appSettingsApiSlice;