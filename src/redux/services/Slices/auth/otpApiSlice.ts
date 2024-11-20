import { api } from "../../apiSlice";

interface OtpProp {
  code: string;
}

interface resetOtpProp {
  reference: string;
}

export const userOtpApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    Otp: builder.mutation<OtpProp, OtpProp>({
      query: (body) => ({
        url: "/otp/verify",
        method: "POST",
        body,
      }),
    }),
    ResendOtp: builder.mutation<OtpProp, any>({
      query: () => ({
        url: "/otp/resend",
        method: "POST",
      }),
    }),
    ResetOtp: builder.mutation<resetOtpProp, resetOtpProp>({
      query: (body) => ({
        url: "/verify-forgot-password-otp",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useOtpMutation, useResendOtpMutation, useResetOtpMutation } =
  userOtpApiSlice;
