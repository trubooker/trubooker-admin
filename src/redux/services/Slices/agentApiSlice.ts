import { api } from "../apiSlice";

interface Prop {
  agent: string;
}

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

    getOneAgent: builder.query<Prop, string>({
      query: (agent) => ({
        url: `/admin/agents/${agent}`,
        method: "GET",
      }),
      providesTags: ["Agents"],
    }),

    toggleAgentStatus: builder.query<Prop, string>({
      query: (agent) => ({
        url: `/admin/agents/toggle-status/${agent}`,
        method: "PATCH",
      }),
      providesTags: ["Agents"],
    }),
  }),
});

export const {
  useGetAgentsQuery,
  useGetOneAgentQuery,
  useToggleAgentStatusQuery,
} = agentsApi;
