/*
 * @Description:
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-04-22 15:55:59
 * @LastEditTime: 2020-05-22 11:23:36
 * @LastEditors: John Trump
 */
import { RpcError } from "./rpcerror";

export type TJsonRpcResponse<T> = {
  code: number;
  message: string;
  content: T;
  details?: string;
};

export class JsonRpc {
  public endpoint: string;
  public fetchBuiltin: (input?: Request | string, init?: RequestInit) => Promise<Response>;

  constructor(endpoint: string, args:
    { fetch?: (input?: string | Request, init?: RequestInit) => Promise<Response> } = {},
  ) {
    if (this.endpoint != '') {
      this.endpoint = endpoint.replace(/\/$/, '');
    }
    if (args.fetch) {
      this.fetchBuiltin = args.fetch;
    } else {
      this.fetchBuiltin = (global as any).fetch;
    }
  }

  async fetch(path: string, body: any) {
    let response;
    let json;
    try {
      const f = this.fetchBuiltin;
      response = await f(this.endpoint + path, {
        body: body ? JSON.stringify(body) : null,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        method: body ? 'POST' : 'GET',
      });

      json = await response.json();
      // if (json.code) {
      //   throw new RpcError(json);
      // }
    } catch (e) {
      e.isFetchError = true;
      throw e;
    }
    if (!response.ok) {
      throw new RpcError(json);
    }
    return json;
  }
}