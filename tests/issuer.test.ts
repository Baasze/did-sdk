// @ts-nocheck
/*
 * @Description:
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-04-26 14:11:39
 * @LastEditTime: 2020-05-26 11:56:50
 * @LastEditors: sandman
 */
import assert from 'assert';
import { SANClient } from "../index";
import fetch from "node-fetch";
import { serviceEndpoint, issuerId } from "./constant";

describe('issuer.update', async () => {
  console.log('did create');
  const client = new SANClient({serviceEndpoint, fetch });
  var response = await client.did.create();
  console.log(response);
  assert(response.code == 0);

  const did = response.content.did
  const authenticationKey = response.content.authenticationKey
  const recoveryKey = response.content.recoveryKey

  console.log('issuer claim');
  response = await client.issuer.claim({ issuer: did }, response.content.document.authentication[0], authenticationKey.priKey)
  console.log(response.content.claim);

  console.log('issuer create');
  var issuer = {
    "website": "https://cloud.baidu.com/solution/digitalIdentity.html",
    "endpoint": "https://did.baidu.com",
    "shortDescription": "百度云企业认证声明",
    "longDescription": "用户的账号在百度云平台需要通过需要提交企业名称、营业执照注册号、营业执照扫描件等才能通过审核获得百度云企业认证。",
    "serviceType": "EnterpriseAuthentication",
    "requestData": {
      "basicData": [{"name": "名称"}, {"phone": "电话"}],
      //"basicData": ["name", "phone"],
      //"otherData": any,
    },
  };

  (issuer as any).did = did;
  response = await client.issuer.create(issuer, authenticationKey.priKey);
  console.log(response);
  assert(response.code == 0);
  issuer = response.content.issuer;

  console.log('update issuer');
  issuer.shortDescription = "白泽企业认证声明"
  var response = await client.issuer.update(issuer, authenticationKey.priKey);
  console.log(response);
  assert(response.code == 0);

  console.log('获取issuer 列表');
  response = await client.issuer.resolve();
  console.log(response);
  assert(response.code == 0);

  console.log('issuer resolve');
  response = await client.issuer.resolve((issuer as any).uuid);
  console.log(response);
  assert(response.code == 0);

  console.log('issuer revoke');
  response = await client.issuer.revoke(did, (issuer as any).uuid, recoveryKey.priKey);
  console.log(response);
  assert(response.code == 0);
})