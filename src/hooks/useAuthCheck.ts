"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // If using Next.js, or use useNavigate for React Router
import fetchToken from "@/lib/auth";

const useAuthCheck = () => {
  const { push } = useRouter(); // For navigation

  // Function to check if user is authenticated
  const isAuth = async () => {
    try {
      const token = await fetchToken();
      if (!token?.data?.token) {
        push("/"); // Redirect to homepage or login if not authenticated
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        push("/"); // Redirect on 401 Unauthorized error
      }
    }
  };

  // useEffect to run the authentication check on component mount
  useEffect(() => {
    isAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures it runs once when component mounts
};

export default useAuthCheck;
