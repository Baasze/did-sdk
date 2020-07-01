/*
 * @Description: 发证方管理
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-04-22 10:33:51
 * @LastEditTime: 2020-07-01 15:25:27
 * @LastEditors: sandman
 */
import { error_code, build_error } from "../error";
import { constant } from "../common/constant";
import { chain } from "../chain/index";
import { JsonRpc, TJsonRpcResponse } from "../rpc/jsonrpc";
import { SANClient } from "../SANClient"
import { TClaim } from "../claim";

/**
 * issuer 结构
 */
type TIssuer = {
  /** 序号	*/
  id: string
  /** did */
  did: string
  /** uuid */
  uuid: string
  /** 网址 */
  website: string
  /** 服务地址 */
  endpoint: string
  /** 短描述 */
  shortDescription: string
  /** 长描述 */
  longDescription: string
  /** 提供的认证类型 */
  serviceType: string // TODO: 确定serviceType类型, 使用枚举来表示
  /** 需要向issuer提供的信息 */
  requestData: {
    /** 基本信息 - 必填 */
    basicData: string[] | object[]
    /** 额外信息 - 选填 */
    otherData: string[] | object[]
  }
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

export class issuer {
  private chain: chain;
  private SANClient: SANClient;

  constructor(SANClient: SANClient) {
    this.SANClient = SANClient;
    this.chain = new chain(SANClient);
  };

  private defaultIssuer = (issuer: Partial<TIssuer>): TIssuer => {
    issuer.id = issuer.id ? issuer.id : '';
    issuer.uuid = issuer.uuid ? issuer.uuid : '';
    issuer.website = issuer.website ? issuer.website : '';
    issuer.endpoint = issuer.endpoint ? issuer.endpoint : '';
    issuer.shortDescription = issuer.shortDescription ? issuer.shortDescription : '';
    issuer.longDescription = issuer.longDescription ? issuer.longDescription : '';
    issuer.serviceType = issuer.serviceType ? issuer.serviceType : '';
    issuer.requestData = issuer.requestData ? issuer.requestData : {
      basicData: [],
      otherData: []
    };
    issuer.requestData.basicData = issuer.requestData.basicData ? issuer.requestData.basicData : [];
    issuer.requestData.otherData = issuer.requestData.otherData ? issuer.requestData.otherData : [];
    issuer.createTime = issuer.createTime ? issuer.createTime : '';
    issuer.updateTime = issuer.updateTime ? issuer.updateTime : '';
    return (issuer as TIssuer);
  };

  private dataToStringArray = (data: string[] | object[]) => {
    let res = [];
    let item: string;
    for (let i = 0; i < data.length; i++) {
      if (typeof data[i] != 'string') {
        item = JSON.stringify(data[i]);
      } else {
        item = data[i].toString();
      }
      res.push(item);
    }

    return res;
  }

  private dataToObjectArray = (data: string[] | object[]) => {
    let res = [];
    let item;
    for (let i = 0; i < data.length; i++) {
      if (typeof data[i] == 'string') {
        try {
          item = JSON.parse(data[i].toString());
        } catch(e) {
          item = data[i];
        }
      } else {
        item = data[i];
      }
      res.push(item);
    }

    return res;
  }

  /**
   * 注册发证方
   * @param issuer
   * @param hexPriKey issuers' private key
   */
  create = async (issuer: Partial<TIssuer>, hexPriKey: string): Promise<TJsonRpcResponse<{
    issuer: TIssuer
  }>> => {
    if (!hexPriKey) {
      return build_error(error_code.PARAMS_INVALID, 'hexPriKey invalid');
    }

    const path = "/v1/issuers";
    const operation = "create";

    issuer = this.defaultIssuer(issuer);

    let now = new Date();
    const timestamp = now.getTime().toString().slice(0, -3);
    issuer.createTime = now.toJSON();
    issuer.updateTime = now.toJSON();

    // 合约需要 string[]
    if (issuer.requestData && issuer.requestData.basicData) {
      issuer.requestData.basicData = this.dataToStringArray(issuer.requestData.basicData);
    }
    if (issuer.requestData && issuer.requestData.otherData) {
      issuer.requestData.otherData = this.dataToStringArray(issuer.requestData.otherData);
    }

    const actions = []
    actions.push(
      {
        account: constant.chain.contract,
        name: 'addissuer',
        authorization: [{
          actor: this.SANClient.utils.getAccount(issuer.did),
          permission: 'active',
        }],
        data: {
          issuer,
        },
      }
    );

    // 如果 actions 是 issuer 会自动加 uuid
    const resp = await this.chain.serialized_transaction(actions);
    if (resp.code != 0) {
      return resp;
    }

    const pushTransactionArgs = await this.chain.sign(resp.content.chainId, hexPriKey, new Uint8Array(resp.content.serializedTransaction));
    (pushTransactionArgs as any).serializedTransaction = Array.from(pushTransactionArgs.serializedTransaction);
    const rpc = new JsonRpc(this.SANClient.serviceEndpoint, { fetch: this.SANClient.fetch });
    var resp2 = await rpc.fetch(path, { operation, timestamp, pushTransactionArgs });
    if (resp2.code != 0) {
      return resp2;
    }

    delete resp.content.chainId
    delete resp.content.serializedTransaction
    return resp;
  };

  /**
   * 获取发证方信息
   * @param uuid 待解析的 issuer uuid
   *
   * uuid为空时, 返回发证方列表
   */
  resolve = async (uuid = ""): Promise<TJsonRpcResponse<{
    issuers: TIssuer[]
  }>> => {
    const path = '/v1/issuers/resolve/' + uuid
    const rpc = new JsonRpc(this.SANClient.serviceEndpoint, { fetch: this.SANClient.fetch });
    var res = await rpc.fetch(path, null);
    // issuer.requestData.basicData 反解为 object[]
    if (!res.code && res.content && res.content.issuers) {
      let issuers = []
      let issuer;
      for (let i = 0; i < res.content.issuers.length; i++) {
        issuer = res.content.issuers[i]
        if (issuer.requestData && issuer.requestData.basicData) {
          issuer.requestData.basicData = this.dataToObjectArray(issuer.requestData.basicData);
        }
        if (issuer.requestData && issuer.requestData.otherData) {
          issuer.requestData.otherData = this.dataToObjectArray(issuer.requestData.otherData);
        }
        issuers.push(issuer);
      }
      res.content.issuers = issuers;
    }
    return res;
  };

  /**
   * 更新发证方信息
   * @param issuer
   * @param hexPriKey issuers' private key
   */
  update = async (issuer: Partial<TIssuer>, hexPriKey: string): Promise<TJsonRpcResponse<{
    issuer: TIssuer
  }>> => {
    if (!hexPriKey) {
      return build_error(error_code.PARAMS_INVALID, 'hexPriKey invalid');
    }

    const path = "/v1/issuers";
    const operation = "update";
    issuer = this.defaultIssuer(issuer);

    let now = new Date();
    const timestamp = now.getTime().toString().slice(0, -3);
    issuer.updateTime = now.toJSON();

    // 合约需要 string[]
    if (issuer.requestData && issuer.requestData.basicData) {
      issuer.requestData.basicData = this.dataToStringArray(issuer.requestData.basicData);
    }
    if (issuer.requestData && issuer.requestData.otherData) {
      issuer.requestData.otherData = this.dataToStringArray(issuer.requestData.otherData);
    }

    const actions = []
    actions.push(
      {
        account: constant.chain.contract,
        name: 'updateissuer',
        authorization: [{
          actor: this.SANClient.utils.getAccount(issuer.did),
          permission: 'active',
        }],
        data: {
          issuer,
        }
      }
    );

    // 如果 actions 是 issuer 会自动加 uuid
    const resp = await this.chain.serialized_transaction(actions);
    if (resp.code != 0) {
      return resp;
    }

    const pushTransactionArgs = await this.chain.sign(resp.content.chainId, hexPriKey, new Uint8Array(resp.content.serializedTransaction));
    (pushTransactionArgs as any).serializedTransaction = Array.from(pushTransactionArgs.serializedTransaction);
    const rpc = new JsonRpc(this.SANClient.serviceEndpoint, { fetch: this.SANClient.fetch });
    var resp2 = await rpc.fetch(path, { operation, timestamp, pushTransactionArgs });
    if (resp2.code == 0) {
      resp2.content = {
        issuer,
      };
    }

    return resp2;
  };

  /**
   * 注销发证方
   * @param did 待解析的 issuer did
   * @param uuid 待解析的 issuer uuid
   * @param hexPriKey issuer's recovery 私钥
   */
  revoke = async (did: string, uuid: string, hexPriKey: string): Promise<TJsonRpcResponse<string>> => {
    if (!did) {
      return build_error(error_code.PARAMS_INVALID, 'did invalid');
    }

    if (!uuid) {
      return build_error(error_code.PARAMS_INVALID, 'uuid invalid');
    }

    if (!hexPriKey) {
      return build_error(error_code.PARAMS_INVALID, 'hexPriKey invalid');
    }

    const path = '/v1/issuers'
    const operation = "revoke"
    let now = new Date();
    const timestamp = now.getTime().toString().slice(0, -3)

    const actions = []
    actions.push(
      {
        account: constant.chain.contract,
        name: 'deleteissuer',
        authorization: [{
          actor: this.SANClient.utils.getAccount(did),
          permission: 'owner',
        }],
        data: {
          uuid,
        }
      }
    )

    const resp = await this.chain.serialized_transaction(actions)
    if (resp.code != 0) {
      return resp;
    }

    const pushTransactionArgs = await this.chain.sign(resp.content.chainId, hexPriKey, new Uint8Array(resp.content.serializedTransaction));
    (pushTransactionArgs as any).serializedTransaction = Array.from(pushTransactionArgs.serializedTransaction)
    const rpc = new JsonRpc(this.SANClient.serviceEndpoint, { fetch: this.SANClient.fetch });
    return await rpc.fetch(path, { operation, timestamp, pushTransactionArgs });
  };

  /**
   * 发证方签发声明
   * @param rawClaim 待 issuer 签名的 claim
   * @param creator
   * @param hexPriKey issuer 的 私钥
   */
  claim = async (rawClaim: TClaim, creator = '', hexPriKey = ''): Promise<TJsonRpcResponse<{
    claim: TClaim
  }>> => {
    rawClaim.proof = this.SANClient.utils.proof(rawClaim, creator, hexPriKey);
    return { code: 0, message: 'ok', content: { claim: rawClaim } };
  };
}