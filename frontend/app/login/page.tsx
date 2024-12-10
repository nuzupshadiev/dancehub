"use client";
import React, { useEffect } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

import User from "@/src/API/user";
import { UserContext } from "@/utils/user-context";

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const router = useRouter();
  const { user, setUser } = React.useContext(UserContext);

  useEffect(() => {
    if (user) {
      router.push("/projects");
    }
  }, [user]);

  const handleLogin = React.useCallback(() => {
    if (email === "" || password === "") {
      setErrorMessage("Please fill all the fields to continue");

      return;
    }
    User.login({ email, password })
      .then((resp) => {
        if (resp.token) {
          setErrorMessage("");
          setUser(resp);
          router.push("/projects");
        }
      })
      .catch(() => {
        setErrorMessage("Something went wrong, please try again later");
      });
  }, [email, password, setUser]);

  const handleOnKeyDown = React.useCallback<
    React.KeyboardEventHandler<HTMLInputElement>
  >((e) => {
    e.key === "Enter" && handleLogin();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="flex flex-col max-w-[500px] md:w-[500px] gap-4 px-14 items-center h-full justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Welcome back to</h1>
          <p className="text-primary text-4xl font-semibold py-1 mb-3">
            DanceHub
          </p>
        </div>
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          variant="underlined"
          onKeyDown={handleOnKeyDown}
          onValueChange={setEmail}
        />
        <Input
          label={"Password"}
          type="password"
          value={password}
          variant="underlined"
          onKeyDown={handleOnKeyDown}
          onValueChange={setPassword}
        />
        {errorMessage && (
          <p className="text-red-500 text-xs text-start w-full">
            {errorMessage}
          </p>
        )}
        <Button fullWidth onPress={handleLogin}>
          Login
        </Button>
        <div className="flex justify-center items-center gap-1">
          <p>{"Don't have an account yet? "}</p>
          <Link className="text-primary" href="/register">
            {"Sign Up"}
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Login;
