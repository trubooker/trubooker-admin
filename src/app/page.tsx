"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/login");
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
