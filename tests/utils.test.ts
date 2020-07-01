// @ts-ignore
/*
 * @Description:
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-04-29 16:03:06
 * @LastEditTime: 2020-05-22 18:43:15
 * @LastEditors: John Trump
 */
import assert from 'assert';
import { SANClient } from "../index";
import fetch from "node-fetch";
import { serviceEndpoint } from "./constant";

describe('utils', async () => {
  const client = new SANClient({ serviceEndpoint, fetch });
  var did = client.utils.newDid();
  console.log(did)

  const accountFromDid = client.utils.getAccount(did);
  assert(("did:san:" + accountFromDid) == did);

  const newKey1 = client.crypto.newKey();
  const newKey2 = client.crypto.newKey();
  const newKey3 = client.crypto.newKey();

  var publicKey: any[] = [];
  publicKey = client.utils.setDocumentKey(publicKey, newKey1, 'did:san:test#key-0');
  publicKey = client.utils.setDocumentKey(publicKey, newKey2, 'did:san:test#key-1');
  publicKey = client.utils.setDocumentKey(publicKey, newKey3, 'did:san:test#key-0');
  console.log(publicKey);
  const foundKey = client.utils.getDocumentKey(publicKey, 'did:san:test#key-0');
  console.log(foundKey.publicKeyHex == newKey3.pubKey);

  const key = client.crypto.newKey();
  var proof = client.utils.proof('hello world!', 'test', key.priKey);
  console.log(proof);
});