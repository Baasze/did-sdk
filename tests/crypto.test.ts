// @ts-nocheck
/*
 * @Description:
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-04-29 16:03:06
 * @LastEditTime: 2020-05-22 18:40:50
 * @LastEditors: John Trump
 */
import assert from 'assert';
import { SANClient } from "../index";
import fetch from "node-fetch";
import { serviceEndpoint } from "./constant";

describe('crypto', async () => {
  const client = new SANClient({serviceEndpoint, fetch });
  var response = client.crypto.newKey();
  console.log(response);

  const msgStr = 'hello world!'
  const signature  = client.crypto.sign(msgStr, response.priKey);
  console.log(signature);

  const valid  = client.crypto.verify(msgStr, signature, response.pubKey);
  console.log(valid)
  assert(valid == true);

  const encryptData  = client.crypto.encrypt(msgStr, response.pubKey);
  console.log(encryptData)
  const data  = client.crypto.decrypt(encryptData, response.priKey);
  console.log(data)
  assert(data == msgStr)
});