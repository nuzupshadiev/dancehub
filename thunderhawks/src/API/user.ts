import { UserContextT } from "@/utils/user-context";
import { Endpoint } from "./endpoint";
type UserRegisterT = {
  message: string;
  user: UserDataT;
  token: string;
};
type UserLoginT = {
  message: string;
  user: UserDataT;
  token: string;
};
export type UserT = {
  id: string;
  name: string;
  profileUrl: string;
};
export type UserDataT = {
  createdAt: string;
  email: string;
  id: number;
  name: string;
  profilePicture: string;
};

export default class User {
  data: UserDataT;
  token: string;
  constructor(data: UserDataT, token: string) {
    this.data = data;
    this.token = token;
  }

  static login(payload: { email: string; password: string }): Promise<User> {
    return Endpoint.request<UserLoginT>("post", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}auth/login`,
      data: payload,
    }).then((resp) => {
      localStorage.setItem("thunderhawks-token", resp.data.token);

      return new User(resp.data.user, resp.data.token);
    });
  }

  static register(payload: {
    email: string;
    password: string;
    name: string;
  }): Promise<User> {
    return Endpoint.request<UserRegisterT>("post", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}auth/register`,
      data: payload,
    }).then((resp) => {
      localStorage.setItem("thunderhawks-token", resp.data.token);

      return new User(resp.data.user, resp.data.token);
    });
  }

  static getUser(payload: { token: string }): Promise<User> {
    if (!payload.token) {
      return Promise.reject("No token provided");
    }

    return Endpoint.request<UserLoginT>("get", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}users`,
      headers: {
        Authorization: `Bearer ${payload.token}`,
      },
    }).then((resp) => {
      return new User(resp.data.user, payload.token);
    });
  }
  static logout(user: UserContextT["user"]): Promise<void> {
    if (!user) {
      return Promise.reject("No user provided");
    }

    return Endpoint.request("post", {
      url: `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}auth/logout`,
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    }).then(() => {
      localStorage.removeItem("thunderhawks-token");
    });
  }
}
