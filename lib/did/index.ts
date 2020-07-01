/*
 * @Description: SAN DID 管理
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-04-22 10:33:16
 * @LastEditTime: 2020-05-22 11:34:18
 * @LastEditors: John Trump
 */
import { error_code, build_error } from "../error";
import { constant } from "../common/constant";
import { chain } from "../chain/index";
import { model, TDocument } from "./model";
import { JsonRpc, TJsonRpcResponse } from "../rpc/jsonrpc";
import { SANClient } from "../SANClient"

/** 密钥 */
type keyPair = {
  /** 密钥类型 */
  type: string
  /** 私钥 */
  priKey: string
  /** 公钥 */
  pubKey: string
}

export class did {
  private chain: chain;
  private SANClient: SANClient;

  constructor(SANClient: SANClient) {
    this.SANClient = SANClient;
    this.chain = new chain(SANClient);
  };
  /**
   * DID的创建
   */
  create = async ():Promise<TJsonRpcResponse<{
    /** did document对象 */
    document: TDocument,
    /** did 对应 `document.id` */
    did: string,
    /** did 认证密钥 */
    authenticationKey: keyPair
    /** did 恢复密钥 */
    recoveryKey: keyPair
  }>> => {
    const path = "/v1/did";
    const operation = "create";

    const activeKey = this.SANClient.crypto.newKey();
    const ownerKey = this.SANClient.crypto.newKey();
    const did = this.SANClient.utils.newDid();

    let now = new Date();
    const timestamp = now.getTime().toString().slice(0, -3)

    const document = model.didDodument(did, this.SANClient.serviceEndpoint, activeKey, ownerKey, now)
    const rpc = new JsonRpc(this.SANClient.serviceEndpoint, { fetch: this.SANClient.fetch });
    var resp = await rpc.fetch(path, { did: did, document, operation, timestamp });
    if (resp.code == 0) {
      resp.content.did = did;
      resp.content.authenticationKey = activeKey;
      resp.content.recoveryKey = ownerKey;
    }
    return resp;
  };

  /**
   * 解析DID
   * @param did 待解析的did id
   */
  resolve = async (did: string):Promise<TJsonRpcResponse<{
    document: TDocument
  }>> => {
    if (!did) {
      return build_error(error_code.PARAMS_INVALID, 'did invalid');
    }

    const path = '/v1/did/resolve/' + did;
    const rpc = new JsonRpc(this.SANClient.serviceEndpoint, { fetch: this.SANClient.fetch });
    return await rpc.fetch(path, null);
  };

  /**
   * DID信息更新
   * @param did 待解析的 did id
   * @param oldRecoveryPriKey 原recovery私钥
   * @param document 修改后的document
   * @param newRecoveryPriKey 新recovery私钥	可选,修改非密钥时不需要
   */
  update = async (did: string, oldRecoveryPriKey: string, document: any, newRecoveryPriKey?: string):Promise<TJsonRpcResponse<string>> => {
    if (!did) {
      return build_error(error_code.PARAMS_INVALID, 'did invalid');
    }

    if (!oldRecoveryPriKey) {
      return build_error(error_code.PARAMS_INVALID, 'oldRecoveryPriKey invalid');
    }

    if (!document.publicKey || document.publicKey.length <= 0) {
      return build_error(error_code.PARAMS_INVALID, 'document publicKey length <= 0');
    }

    var chainActiveKey = null;
    if (document.authentication && document.authentication.length == 1) {
      chainActiveKey = this.SANClient.utils.getDocumentKey(document.publicKey, document.authentication[0]);
      if (chainActiveKey) {
        chainActiveKey = this.SANClient.crypto.keyToChainKey(chainActiveKey.publicKeyHex, false);
      }
    }

    if (!chainActiveKey) {
      return build_error(error_code.KEY_NOT_FOUND, 'authentication key not found');
    }

    var chainOwnerKey = null;
    if (document.recovery && document.recovery.length == 1) {
      chainOwnerKey = this.SANClient.utils.getDocumentKey(document.publicKey, document.recovery[0]);
      if (chainOwnerKey) {
        chainOwnerKey = this.SANClient.crypto.keyToChainKey(chainOwnerKey.publicKeyHex, false);
      }
    }

    if (!chainActiveKey) {
      return build_error(error_code.KEY_NOT_FOUND, 'recovery key not found');
    }

    const path = '/v1/did/';
    const operation = "update";
    let now = new Date();
    const timestamp = now.getTime().toString().slice(0, -3);

    const actions = [];
    actions.push(
      {
        account: constant.chain.updateContract,
        name: 'updateauth',
        authorization: [{
          actor: this.SANClient.utils.getAccount(did),
          permission: 'owner',
        }],
        data: {
          account: this.SANClient.utils.getAccount(did),
          permission: 'active',
          parent: 'owner',
          auth: {
            threshold: 1,
            keys: [{
              key: chainActiveKey,
              weight: 1
            }],
            accounts: [],
            waits: []
          },
        }
      }
    );

    actions.push(
      {
        account: constant.chain.updateContract,
        name: 'updateauth',
        authorization: [{
          actor: this.SANClient.utils.getAccount(did),
          permission: 'owner',
        }],
        data: {
          account: this.SANClient.utils.getAccount(did),
          permission: 'owner',
          parent: '',
          auth: {
            threshold: 1,
            keys: [{
              key: chainOwnerKey,
              weight: 1
            }],
            accounts: [],
            waits: []
          },
        }
      }
    );

    delete document.proof;
    document.updated = now.toJSON();
    if (newRecoveryPriKey) {
      document["proof"] = this.SANClient.utils.proof(document, document.recovery[0], newRecoveryPriKey);
    } else {
      document["proof"] = this.SANClient.utils.proof(document, document.recovery[0], oldRecoveryPriKey);
    }

    actions.push(
      {
        account: constant.chain.contract,
        name: 'update',
        authorization: [{
          actor: this.SANClient.utils.getAccount(did),
          permission: 'owner',
        }],
        data: {
          did,
          document: document,
        }
      }
    );



    const resp = await this.chain.serialized_transaction(actions);
    if (resp.code != 0) {
      return resp;
    }

    var pushTransactionArgs = await this.chain.sign(resp.content.chainId, oldRecoveryPriKey, new Uint8Array(resp.content.serializedTransaction));
    (pushTransactionArgs as any).serializedTransaction = Array.from(pushTransactionArgs.serializedTransaction);
    const rpc = new JsonRpc(this.SANClient.serviceEndpoint, { fetch: this.SANClient.fetch });
    return await rpc.fetch(path, { did, document, operation, timestamp, pushTransactionArgs });
  };

  /**
   * DID的删除
   * @param did 待解析的did
   * @param hexPriKey recovery 私钥
   */
  revoke = async (did: string, hexPriKey: string):Promise<TJsonRpcResponse<string>> => {
    if (!did) {
      return build_error(error_code.PARAMS_INVALID, 'did invalid');
    }

    const path = '/v1/did/';
    const operation = "revoke";
    let now = new Date();
    const timestamp = now.getTime().toString().slice(0, -3);

    const actions = [];
    actions.push(
      {
        account: constant.chain.contract,
        name: 'revoke',
        authorization: [{
          actor: this.SANClient.utils.getAccount(did),
          permission: 'owner',
        }],
        data: {
          did,
        }
      }
    );

    const resp = await this.chain.serialized_transaction(actions);
    if (resp.code != 0) {
      return resp;
    }

    const pushTransactionArgs = await this.chain.sign(resp.content.chainId, hexPriKey, new Uint8Array(resp.content.serializedTransaction));
    (pushTransactionArgs as any).serializedTransaction = Array.from(pushTransactionArgs.serializedTransaction);
    const rpc = new JsonRpc(this.SANClient.serviceEndpoint, { fetch: this.SANClient.fetch });
    return await rpc.fetch(path, { did, operation, timestamp, pushTransactionArgs });
  };
}