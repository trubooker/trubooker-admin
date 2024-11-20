import { api } from "../../apiSlice";

interface forgotPasswordProp {
  email: string;
  data?: string;
}

export const userForgotPasswordApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    ForgotPassword: builder.mutation<forgotPasswordProp, forgotPasswordProp>({
      query: (credentials) => ({
        url: "/forgot-password",
        method: "POST",
        body: { ...credentials },
      }),
    }),
  }),
});

export const { useForgotPasswordMutation } = userForgotPasswordApiSlice;
