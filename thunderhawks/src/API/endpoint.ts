import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";

export class Endpoint<OutputT> {
  instance: AxiosInstance;
  constructor(method: Method, baseURL?: string) {
    baseURL = baseURL ? baseURL : process.env.NEXT_PUBLIC_PHARMACO_NET_ENDPOINT;
    this.instance = axios.create({ method, baseURL });
  }
  req(
    config: Omit<AxiosRequestConfig<any>, "baseURL" | "method">,
  ): Promise<AxiosResponse<OutputT>> {
    return this.instance.request(config);
  }

  static request<OutputT>(
    method: Method,
    params: Omit<AxiosRequestConfig<any>, "method">,
  ): Promise<AxiosResponse<OutputT>> {
    return new Endpoint(method).req(params) as Promise<AxiosResponse<OutputT>>;
  }
}
