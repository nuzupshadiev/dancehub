"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { Spinner } from "@nextui-org/react";
import { UserContext } from "@/utils/user-context";
import User from "@/src/API/user";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const [user, setUser] =
    React.useState<React.ContextType<typeof UserContext>["user"]>(undefined);

  React.useEffect(() => {
    const token = localStorage.getItem("dancehub-user-token");

    if (token) {
      User.getUser({ token: token })
        .then((user) => {
          setUser(user);
        })
        .catch(() => {
          setUser(null);
        });
    }
  }, []);

  return (
    <React.Suspense fallback={<Spinner />}>
      <UserContext.Provider value={{ user, setUser }}>
        <NextUIProvider navigate={router.push}>
          <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
        </NextUIProvider>
      </UserContext.Provider>
    </React.Suspense>
  );
}
