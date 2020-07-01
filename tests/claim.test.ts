// @ts-nocheck
/*
 * @Description:
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-04-27 16:59:27
 * @LastEditTime: 2020-05-28 14:53:56
 * @LastEditors: sandman
 */
import assert from 'assert';
import { SANClient } from "../index";
import fetch from "node-fetch";
import { serviceEndpoint, issuerId } from "./constant";

let client: SANClient;

before(async() => {
  console.log('init did-sdk client');
  client = new SANClient({
    serviceEndpoint,
    fetch
  });
});

describe('claim', async () => {
  console.log('did create');
  const client =new SANClient({
    serviceEndpoint,
    fetch
  });
  var response = await client.did.create();
  console.log(response);
  assert(response.code == 0);
  const did = response.content.did
  var authenticationKey = response.content.authenticationKey

  console.log('issuer resolve');
  response = await client.issuer.resolve(issuerId)
  console.log(response);
  console.log('issuer requestData');
  console.log(response.content.issuers[0].requestData);
  assert(response.code == 0);

  console.log('claim apply');
  var issuer = response.content.issuers[0];
  issuer.requestData = {
    basicData: {
      name: 'did-sdk-test',
      identity: '350402199001010001',
      claimType: 'UniversityDegreeCredential',
    },
    otherData: [],
  };
  response = await client.claim.apply(issuer.uuid, issuer.endpoint, did, issuer.requestData, authenticationKey.priKey)
  console.log(response);
  assert(response.code == 0);
  const applyId = response.content.applyId

  // 查看 status == Done

  console.log('claim result');
  response = await client.claim.result(issuer.uuid, issuer.endpoint, did, applyId, authenticationKey.priKey);
  console.log(response);
  assert(response.code == 0);
  var claim = response.content.claim;
  console.log('raw claim: ');
  console.log(claim);
  claim = JSON.stringify(claim)

  console.log('claim create vc');
  response = await client.did.create();
  console.log(response);
  assert(response.code == 0);
  const vcdid = response.content.did
  authenticationKey = response.content.authenticationKey

  console.log('claim authorize');
  response = await client.claim.authorize(vcdid, claim);
  console.log(response);
  assert(response.code == 0);
  claim = response.content.claim

  console.log('claim verify');
  response = await client.claim.verify(claim, authenticationKey.priKey);
  console.log(response);
  assert(response.code == 0);
})