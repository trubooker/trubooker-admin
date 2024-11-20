import { api } from "../apiSlice";

const supportApiConfig = api.enhanceEndpoints({ addTagTypes: ["Support"] });
const supportApi = supportApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    sendSupportMessage: builder.mutation({
      query: (body) => ({
        url: `/contact-support/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Support"],
    }),
  }),
});

export const { useSendSupportMessageMutation } = supportApi;
``;
