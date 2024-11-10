"use client";
import React from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

import User from "@/src/API/user";
import { UserContext } from "@/utils/user-context";
function Register() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const { setUser } = React.useContext(UserContext);
  const handleRegister = React.useCallback(() => {
    if (email === "" || password === "" || name === "") {
      setErrorMessage("Please fill all the fields to continue");
      return;
    }
    User.register({ email, password, name })
      .then((resp) => {
        if (resp.token) {
          setUser(resp);
          localStorage.setItem("thunderhawks-token", resp.token);
          router.push("/projects");
        }
      })
      .catch((err) => {
        setErrorMessage("Something went wrong, please try again later");
        console.error(err);
      });
  }, [email, password, name, setUser]);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="flex flex-col max-w-[500px] md:w-[500px] gap-4 px-14 items-center h-full justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Create Account in</h1>
          <p className="text-primary text-4xl font-semibold py-1 mb-3">
            Project name
          </p>
        </div>
        <Input
          isRequired
          label={"Name"}
          type="text"
          value={name}
          variant="underlined"
          onValueChange={setName}
        />
        <Input
          isRequired
          label={"Email"}
          type="email"
          value={email}
          variant="underlined"
          onValueChange={setEmail}
        />
        <Input
          isRequired
          label={"Password"}
          type="password"
          value={password}
          variant="underlined"
          onValueChange={setPassword}
        />
        {errorMessage && (
          <p className="text-red-500 text-xs text-start w-full">
            {errorMessage}
          </p>
        )}
        <Button fullWidth onPress={handleRegister}>
          Sign Up
        </Button>
        <div className="flex justify-center items-center gap-1">
          <p>{"Already have an account?"}</p>
          <Link className="text-primary" href="/login">
            {"Login"}
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Register;
