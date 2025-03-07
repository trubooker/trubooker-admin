import { api } from "../apiSlice";

const agentsApiConfig = api.enhanceEndpoints({
  addTagTypes: ["Agents"],
});
const agentsApi = agentsApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    getAgents: builder.query({
      query: ({ page, search }) => ({
        url: `/admin/agents?page=${page}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["Agents"],
    }),

    getOneAgent: builder.query({
      query: (agent) => ({
        url: `/admin/agents/${agent}`,
        method: "GET",
      }),
      providesTags: ["Agents"],
    }),

    toggleAgentStatus: builder.mutation({
      query: (agent) => ({
        url: `/admin/agents/toggle-status/${agent}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Agents"],
    }),
  }),
});

export const {
  useGetAgentsQuery,
  useGetOneAgentQuery,
  useToggleAgentStatusMutation,
} = agentsApi;
