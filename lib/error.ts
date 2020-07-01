/*
 * @Description:
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-05-07 14:17:09
 * @LastEditTime: 2020-05-28 11:16:34
 * @LastEditors: sandman
 */
import { TJsonRpcResponse } from "./rpc/jsonrpc";

export const enum error_code {
  PARAMS_INVALID = -10001,
  KEY_NOT_FOUND = -10002,
  PROOF_INVALID = -10003,
  EXPIRED = -10004,
  REVOCATION_REQUEST_ERROR = -10005,
  REVOCATION_PENDING = -10006,
  REVOKED = -10007,
}

var error_message_map: Map<error_code, string> = new Map([
  [error_code.PARAMS_INVALID, "请求参数无效"],
  [error_code.KEY_NOT_FOUND, "未找到匹配密钥"],
  [error_code.PROOF_INVALID, "proof签名无效"],
  [error_code.EXPIRED, "过期"],
  [error_code.REVOCATION_REQUEST_ERROR, "吊销请求错误"],
  [error_code.REVOCATION_PENDING, "吊销未决"],
  [error_code.REVOKED, "已吊销"],
]);

export const build_error = (
  code: error_code,
  detail: string
): Promise<TJsonRpcResponse<any>> => {
  var message = error_message_map.get(code);
  if (!message) {
    message = "未知错误";
  }
  return Promise.reject({ code, message, content: "", detail });
};
