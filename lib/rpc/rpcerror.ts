/*
 * @Description: 
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-04-22 15:52:25
 * @LastEditTime: 2020-05-06 16:32:50
 * @LastEditors: sandman
 */

export class RpcError extends Error {
  constructor(json: any) {
    if (json.code) {
      super(json.message);
    } else {
      super(json)
    }
  }
}