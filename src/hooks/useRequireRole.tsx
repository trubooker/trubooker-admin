"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type UserRole = "student" | "teacher";
type User = {
  data: {
    attributes: {
      role: UserRole;
    };
  };
};

type UseRoleCheckProps = {
  user: User | null;
};

export const useRoleCheck = ({ user }: UseRoleCheckProps) => {
  const router = useRouter();

  useEffect(() => {
    const role = user?.data?.attributes?.role;

    if (!role) {
      router.push("/login"); // Redirect to login if no role
      return;
    }

    console.log(router);

    // const isStudentPage = router.pathname.startsWith("/student");
    // const isTeacherPage = router.pathname.startsWith("/teacher");

    // Prevent teacher from accessing student pages
    // if (role === "teacher" && isStudentPage) {
    //   router.push("/teacher/dashboard"); // Redirect to teacher dashboard
    // }

    // Prevent student from accessing teacher pages
    // if (role === "student" && isTeacherPage) {
    //   router.push("/student/dashboard"); // Redirect to student dashboard
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
};
