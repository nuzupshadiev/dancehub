"use client";

import React from "react";
import { Navbar as NextUINavbar, NavbarContent } from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Input } from "@nextui-org/input";
import { User } from "@nextui-org/react";

import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon } from "@/components/icons";
import { UserContext } from "@/utils/user-context";
import * as UserAPI from "@/src/API/user";

export const Navbar = () => {
  const { user } = React.useContext(UserContext);

  const handleLogout = React.useCallback(() => {
    UserAPI.default.logout(user).then(() => {
      localStorage.removeItem("thunderhawks-token");
      window.location.reload();
    });
  }, [user]);

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      {user && (
        <div className="flex flex-row justify-center items-center gap-4">
          <User
            avatarProps={{
              src: user.data.profilePicture,
            }}
            className="cursor-pointer"
            description={user.data.email}
            name={user.data.name}
            onClick={() => {
              window.location.href = "/projects";
            }}
          />
          <Button onPress={handleLogout}>Logout</Button>
        </div>
      )}
      <NavbarContent justify="end">
        <ThemeSwitch />
      </NavbarContent>
    </NextUINavbar>
  );
};
