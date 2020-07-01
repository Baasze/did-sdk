/*
 * @Description: 
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-04-23 17:48:53
 * @LastEditTime: 2020-05-07 11:19:55
 * @LastEditors: sandman
 */
import { Numeric, JsSignatureProvider } from 'icbsc.js';
import { JsonRpc } from "../rpc/jsonrpc";
import { SANClient } from '../SANClient';

export class chain {
  private SANClient: SANClient;

  constructor(SANClient: SANClient) {
    this.SANClient = SANClient;
  };

  serialized_transaction = async (actions: Array<any>) => {
    const path = '/v1/did/chain/serialized_transaction';
    const rpc = new JsonRpc(this.SANClient.serviceEndpoint, { fetch: this.SANClient.fetch });
    return rpc.fetch(path, { actions });
  };

  sign = async (chainId: string, hexPriKey: string, serializedTransaction: Uint8Array) => {
    const privateKey = Numeric.HexToKey(Numeric.KeyType.sm2, hexPriKey, true)
    const privateKeys = []
    const requiredKeys = []
    privateKeys.push(privateKey.toString())
    requiredKeys.push(Numeric.privateKeyToPublicKey(privateKey).toString())
    const provider = new JsSignatureProvider(privateKeys)
    return provider.sign({ chainId, requiredKeys, serializedTransaction } as any)
  };
}