import { Endpoint } from "./endpoint";
import { LocalStorageTokenManager, TokenManagerI } from "./token_manager";
type UserRegisterT = {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: string;
  };
  token: string;
};
type UserLoginT = {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: string;
  };
  token: string;
};
export type UserT = {
  id: string;
  name: string;
  username: string;
  profilePicture: string;
};
export type UserDataT = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
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
      url: "auth/login",
      data: payload,
    }).then((resp) => {
      localStorage.setItem(
        "dancehub-user-token",
        Buffer.from(resp.data.token).toString("base64")
      );
      return new User(resp.data.user, resp.data.token);
    });
  }

  static register(payload: {
    email: string;
    password: string;
    name: string;
  }): Promise<User> {
    return Endpoint.request<UserRegisterT>("post", {
      url: "auth/register",
      data: payload,
    }).then((resp) => {
      localStorage.setItem(
        "dancehub-user-token",
        Buffer.from(resp.data.token).toString("base64")
      );
      return new User(resp.data.user, resp.data.token);
    });
  }

  static getUser(payload: { token: string }): Promise<User> {
    return Endpoint.request<UserLoginT>("get", {
      url: `auth/user`,
      data: payload,
    }).then((resp) => {
      localStorage.setItem(
        "dancehub-user-token",
        Buffer.from(resp.data.token).toString("base64")
      );
      return new User(resp.data.user, resp.data.token);
    });
  }
}
