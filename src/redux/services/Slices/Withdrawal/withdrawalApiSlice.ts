import { api } from "../../apiSlice";

interface Prop {
  beneficiary_id: string | null;
  account_number: string;
  bank_code: string;
  bank_name: string;
  amount: number;
  bank_holder_name: string;
  narration: string;
  save_beneficiary: boolean | null;
}

export const userWithdrawFundsApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    withdrawFunds: builder.mutation<Prop, Prop>({
      query: (body) => ({
        url: "/agent/payout/initiate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Withdraw"],
    }),

    resolveAccountNumber: builder.mutation({
      query: (body: any) => ({
        url: "/agent/payout/name-enquiry",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Withdraw"],
    }),

    getBankCodes: builder.query({
      query: () => ({
        url: `/banks`,
        method: "GET",
      }),
      providesTags: ["Withdraw"],
    }),

    getBeneficiary: builder.query({
      query: () => ({
        url: `/agent/payout/beneficiary`,
        method: "GET",
      }),
      providesTags: ["Withdraw"],
    }),
  }),
});

export const {
  useWithdrawFundsMutation,
  useGetBankCodesQuery,
  useGetBeneficiaryQuery,
  useResolveAccountNumberMutation,
} = userWithdrawFundsApiSlice;
