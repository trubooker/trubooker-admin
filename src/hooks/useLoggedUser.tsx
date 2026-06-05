import { useGetCurrentUserQuery } from "@/redux/services/Slices/userApiSlice";

export const useLoggedInUser = () => {
  const {
    data,
    refetch: userRefetching,
    isLoading: userLoading,
    isError: userError,
    status,
  } = useGetCurrentUserQuery(null);

  const userData = data?.result || null;

  return { userData, userError, userLoading, userRefetching, status };
};
