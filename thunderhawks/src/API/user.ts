import { Endpoint } from "./endpoint";
import { ProjectT } from "./project";
type UserRegisterT = {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    projects: [];
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
    projects: [];
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
  projects: ProjectT[];
  createdAt: string;
};
export default class User {
  data: UserDataT;
  token: string;
  constructor(data: UserDataT, token: string) {
    this.data = data;
    this.token = "";
  }
  static login(payload: { email: string; password: string }): Promise<User> {
    return Endpoint.request<UserLoginT>("post", {
      url: "auth/login",
      data: payload,
    }).then((resp) => new User(resp.data.user, resp.data.token));
  }
  static register(payload: {
    email: string;
    password: string;
    name: string;
  }): Promise<User> {
    return Endpoint.request<UserRegisterT>("post", {
      url: "auth/register",
      data: payload,
    }).then((resp) => new User(resp.data.user, resp.data.token));
  }
}
