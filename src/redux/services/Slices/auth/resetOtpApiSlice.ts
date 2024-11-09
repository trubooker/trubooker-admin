import { api } from "../../apiSlice";

interface resetOtpProp {
  reference: string;
}

export const userResetOtpApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    ResetOtp: builder.mutation<resetOtpProp, resetOtpProp>({
      query: (body) => ({
        url: "/verify-forgot-password-otp",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useResetOtpMutation } = userResetOtpApiSlice;
