"use client";
import User from "@/src/API/user";
import React from "react";

type UserT = User | null | undefined;

export type UserContextT = {
  user: UserT;
  setUser: React.Dispatch<React.SetStateAction<UserT>>;
};

export type AuthUserContextT = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<UserT>>;
};

export const UserContext = React.createContext<UserContextT>({
  user: null,
  setUser: () => {},
});

export const AuthUserContext = React.createContext<AuthUserContextT>(
  {} as AuthUserContextT,
);
