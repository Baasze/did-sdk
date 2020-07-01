/*
 * @Description:
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-04-22 11:13:56
 * @LastEditTime: 2020-05-22 18:43:26
 * @LastEditors: John Trump
 */
import assert from "assert";
import { SANClient } from "../index";
import fetch from "node-fetch";
import { serviceEndpoint } from './constant';
let client: SANClient;

before(() => {
  console.log('init did-sdk client');
  client = new SANClient({
    serviceEndpoint,
    fetch
  });
});

describe("did", () => {
  it("#create", async () => {
    const response = await client.did.create();
    assert(response.code === 0);
  });

  it("#resolve", async () => {
    const createRes = await client.did.create();
    const didUser = createRes.content
    const did = didUser.did;
    const response = await client.did.resolve(did);
    assert(response.code === 0);
    assert(response.content.document.id === did);
  });

  it('#update', async () => {
    const createRes = await client.did.create();
    const didUser = createRes.content
    const did = didUser.did;
    const newAuthenticationKey = client.crypto.newKey();
    const newRecoveryKey = client.crypto.newKey();
    const document = didUser.document;

    document.publicKey = client.utils.setDocumentKey(
      document.publicKey,
      newAuthenticationKey,
      document.authentication[0]
    );

    document.publicKey = client.utils.setDocumentKey(
      document.publicKey,
      newRecoveryKey,
      document.recovery[0]
    );
    const updateRes = await client.did.update(
      did,
      didUser.recoveryKey.priKey,
      document,
      newRecoveryKey.priKey
    );
    assert(updateRes.code === 0);

    document.version = "2";

    const updateRes2 = await client.did.update(did, newRecoveryKey.priKey, document);
    assert(updateRes2.code === 0);
  })

});
