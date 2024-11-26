import { useGetCurrentUserQuery } from "@/redux/services/Slices/userApiSlice";

export const useLoggedInUser = () => {
  const {
    data,
    refetch: userRefetching,
    isLoading: userLoading,
    isError: userError,
    status,
  } = useGetCurrentUserQuery(null);

  const userData = data?.data || null;
  console.log(data);

  return { userData, userError, userLoading, userRefetching, status };
};