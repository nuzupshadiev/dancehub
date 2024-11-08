"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { UserContext } from "@/utils/user-context";

export default function Page() {
  const router = useRouter();
  const userContext = React.useContext(UserContext);

  useEffect(() => {
    if (!userContext.user) {
      router.push("/login");
    } else {
      router.push("/projects");
    }
  }, [userContext.user, router]);

  return <div></div>;
}
