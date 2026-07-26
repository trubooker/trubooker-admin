import { api } from "../apiSlice";

const agentsApiConfig = api.enhanceEndpoints({
  addTagTypes: ["Agents"],
});
const agentsApi = agentsApiConfig.injectEndpoints({
  endpoints: (builder) => ({
    getAgents: builder.query({
      query: ({ page, search }) => ({
        url: `/v1/admin/agents?page=${page}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["Agents"],
    }),

    getOneAgent: builder.query({
      query: (agent) => ({
        url: `/v1/admin/agent/${agent}`,
        method: "GET",
      }),
      providesTags: ["Agents"],
    }),

    getAgentReferrals: builder.query({
      query: ({agent, page}) => ({
        url: `/v1/admin/agent-referral/${agent}?page=${page}`,
        method: "GET",
      }),
      providesTags: ["Agents"],
    }),

    toggleAgentStatus: builder.mutation({
      query: (agent) => ({
        url: `/v1/admin/toggle-agents/${agent}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Agents"],
    }),
  }),
});

export const {
  useGetAgentsQuery,
  useGetAgentReferralsQuery,
  useGetOneAgentQuery,
  useToggleAgentStatusMutation,
} = agentsApi;
