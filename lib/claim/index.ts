/*
 * @Description: SAN DID 声明管理
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-04-22 10:33:51
 * @LastEditTime: 2020-05-28 14:50:20
 * @LastEditors: sandman
 */
import { error_code, build_error } from "../error";
import { JsonRpc, TJsonRpcResponse } from "../rpc/jsonrpc";
import { SANClient } from "../SANClient"
import { TProof } from "../utils";


/** Claim明文 */
export type TClaim = {
  /** w3c 声明标准 */
  '@context': string[];
  /** claim uuid */
  id: string;
  /** claim 类型 */
  type: string[];
  /** claim issuer did	*/
  issuer: string;
  /** claim 发行时间 */
  issuanceDate: string;
  /** claim 过期时间 */
  expirationDate: string;
  /** 凭据主题 */
  credentialSubject: {
    /** 凭据id(用户did) */
    id: string;
    /** 凭据简述 */
    shortDescription: string;
    /** 凭据详述 */
    longDescription: string;
    /** 凭据类型 */
    type: string;
  };
  /** claim 撤销对象 */
  revocation: {
    /** claim 撤销id */
    id: string;
    /**
     * claim 撤销类型
     *
     * SimpleRevocationListV1 表示可用来查询 撤销列表
     */
    type: string;
  };
  /**
   * claim proof 对象
   *
   * 同 `did.document.proof`
   */
  proof?: TProof
};


export class claim {
  private SANClient: SANClient;

  constructor(SANClient: SANClient) {
    this.SANClient = SANClient;
  };
  /**
   * 申请声明
   * @param uuid issuer uuid
   * @param endpoint issuer endpoint (实现 /v1/claim/apply 接口的 endpoint)
   * @param did 用户 did
   * @param requestData issuer 所需的 requestData
   * @param hexPriKey 用户 authentication 私钥
   *
   */
  apply = async (uuid: string, endpoint: string, did: string, requestData: any, hexPriKey: string): Promise<TJsonRpcResponse<{
    /** claim applyId	 */
    applyId: string
  }>> => {
    if (!uuid) {
      return build_error(error_code.PARAMS_INVALID, 'uuid invalid');
    }

    if (!endpoint) {
      return build_error(error_code.PARAMS_INVALID, 'endpoint invalid');
    }

    if (!did) {
      return build_error(error_code.PARAMS_INVALID, 'did invalid');
    }

    if (!hexPriKey) {
      return build_error(error_code.PARAMS_INVALID, 'hexPriKey invalid');
    }

    const path = '/v1/claim/apply'

    const msg = {
      uuid,
      did,
      requestData,
    }

    const msgStr = JSON.stringify(msg)
    const signature = this.SANClient.crypto.sign(msgStr, hexPriKey);
    const rpc = new JsonRpc(endpoint, { fetch: this.SANClient.fetch });
    return await rpc.fetch(path, { uuid, did, requestData, signature });
  };

  /**
   * 获取声明签发结果
   * @param uuid issuer uuid
   * @param endpoint issuer endpoint
   * @param did 用户 did
   * @param applyId claim applyId
   * @param hexPriKey 用户 authentication 私钥
   */

  result = async (uuid: string, endpoint: string, did: string, applyId: string, hexPriKey: string): Promise<TJsonRpcResponse<{
    /** claim 状态	*/
    status: string
    /** claim 对象 */
    claim: TClaim
  }>> => {
    if (!uuid) {
      return build_error(error_code.PARAMS_INVALID, 'uuid invalid');
    }

    if (!endpoint) {
      return build_error(error_code.PARAMS_INVALID, 'endpoint invalid');
    }

    if (!did) {
      return build_error(error_code.PARAMS_INVALID, 'did invalid');
    }

    if (!applyId) {
      return build_error(error_code.PARAMS_INVALID, 'applyId invalid');
    }

    if (!hexPriKey) {
      return build_error(error_code.PARAMS_INVALID, 'hexPriKey invalid');
    }

    const path = '/v1/claim/apply/result'

    const msg = {
      uuid,
      did,
      applyId,
    }

    const msgStr = JSON.stringify(msg)
    const signature = this.SANClient.crypto.sign(msgStr, hexPriKey);
    const rpc = new JsonRpc(endpoint, { fetch: this.SANClient.fetch });
    return await rpc.fetch(path, { uuid, did, applyId, signature });
  };
  /**
   * @param vcdid 待授权的 did
   * @param claim claim 明文
   */
  authorize = async (vcdid: string, claim: string): Promise<TJsonRpcResponse<{
    /**
     * claim 密文
     *
     * claim encrpto by vcdid authentication public key
     */
    claim: string
  }>> => {
    if (!vcdid) {
      return build_error(error_code.PARAMS_INVALID, 'vcdid invalid');
    }

    if (!claim) {
      return build_error(error_code.PARAMS_INVALID, 'claim invalid');
    }

    var response = await this.SANClient.did.resolve(vcdid);
    if (response.code != 0) {
      return Promise.reject(response);
    }

    const document = response.content.document;
    const pubKey = this.SANClient.utils.getDocumentKey(document.publicKey, document.authentication[0])
    if (!pubKey) {
      return build_error(error_code.PARAMS_INVALID, 'claim invalid');
    }

    claim = this.SANClient.crypto.encrypt(claim, pubKey.publicKeyHex);
    return { code: 0, message: 'ok', content: { claim } };
  };

  /**
   * 验证声明
   * sdk做了以下逻辑:
   *   1. 验证 issuer 是否存在
   *   2. 验证 claim proof
   *   3. 验证是否吊销
   *   4. 验证过期时间
   *
   * @param claimStr vc 收到的 claim 密文
   * @param hexPriKey vcdid authentication 私钥
   */
  verify = async (claimStr: string, hexPriKey: string): Promise<TJsonRpcResponse<{
    claim: TClaim
  }>> => {
    if (!claimStr) {
      return build_error(error_code.PARAMS_INVALID, 'claimStr invalid');
    }

    if (!hexPriKey) {
      return build_error(error_code.PARAMS_INVALID, 'hexPriKey invalid');
    }

    claimStr = this.SANClient.crypto.decrypt(claimStr, hexPriKey);
    var claim = JSON.parse(claimStr);

    // 验证 issuer 是否存在
    var response = await this.SANClient.did.resolve(claim.issuer);
    if (response.code != 0) {
      return Promise.reject(response);
    }

    // 验证 claim proof
    const document = response.content.document;
    const pubKey = this.SANClient.utils.getDocumentKey(document.publicKey, document.authentication[0])
    if (!pubKey) {
      return build_error(error_code.KEY_NOT_FOUND, 'authentication key not found');
    }

    const proof = claim.proof;
    delete claim.proof
    const msg = JSON.stringify(claim)
    const valid = this.SANClient.crypto.verify(msg, proof.signatureValue, pubKey.publicKeyHex);
    if (!valid) {
      return build_error(error_code.PROOF_INVALID, '');
    }

    // 验证是否吊销
    if (claim.revocation) {
      // 0: 等待审核, 1:审核通过 , -1:已被吊销
      var status = 0;

      // TODO: 需要支持更多类型
      // SimpleRevocationListV1: GET 方法带 query参数 id=$applyId 查询
      if (claim.revocation.type == 'SimpleRevocationListV1') {
        const path = claim.revocation.id + '/' + claim.id;
        const rpc = new JsonRpc('', { fetch: this.SANClient.fetch });
        var res = await rpc.fetch(path, null);
        if (res.code != 0) {
          return build_error(error_code.REVOCATION_REQUEST_ERROR, res.details ? res.details : '');
        }
        status = res.content.status;
      }

      if (status == -1) {
        return build_error(error_code.REVOKED, 'claim revoked');
      } else if (status != 1) {
        return build_error(error_code.REVOCATION_PENDING, 'claim revocation pending');
      }
    }

    // 验证过期时间
    var now = new Date();
    var expirationDate = new Date(claim.expirationDate);
    if (now >= expirationDate) {
      return build_error(error_code.EXPIRED, 'claim expiration');
    }

    return { code: 0, message: 'ok', content: { claim } };
  };
}