import { api } from "../../apiSlice";

interface resetPasswordProp {
  password: string;
  password_confirmation: string;
  email: string;
}

export const userResetPasswordApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    ResetPassword: builder.mutation<resetPasswordProp, resetPasswordProp>({
      query: (body) => ({
        url: "/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useResetPasswordMutation } = userResetPasswordApiSlice;
