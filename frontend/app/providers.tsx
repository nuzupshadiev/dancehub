"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { Spinner } from "@nextui-org/react";
import { UserContext, VideoVersionContext } from "@/utils/user-context";
import User from "@/src/API/user";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const [user, setUser] =
    React.useState<React.ContextType<typeof UserContext>["user"]>(undefined);
  const [videoVersion, setVideoVersion] =
    React.useState<
      React.ContextType<typeof VideoVersionContext>["videoVersion"]
    >("");

  React.useEffect(() => {
    const token = localStorage.getItem("thunderhawks-token");

    if (token) {
      User.getUser({ token: token })
        .then((user) => {
          setUser(user);
        })
        .catch(() => {
          console.error("Failed to get user");
          // router.push("/login");
        });
    }
  }, []);

  return (
    <React.Suspense fallback={<Spinner />}>
      <UserContext.Provider value={{ user, setUser }}>
        <VideoVersionContext.Provider value={{ videoVersion, setVideoVersion }}>
          <NextUIProvider navigate={router.push}>
            <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
          </NextUIProvider>
        </VideoVersionContext.Provider>
      </UserContext.Provider>
    </React.Suspense>
  );
}
