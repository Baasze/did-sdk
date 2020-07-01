/*
 * @Description:
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-04-26 10:46:00
 * @LastEditTime: 2020-05-22 16:49:40
 * @LastEditors: John Trump
 */

import { constant } from "../common/constant";
import { utils, TProof } from "../utils";

export type TDocument = {
  /** w3c版本 */
  '@context': string;
  /** did id */
  id: string;
  /** 版本 */
  version: string;
  /** 创建时间 */
  created: string;
  /** 更新时间 */
  updated: string;
  /** 公钥数组 */
  publicKey: {
    /** 公钥id */
    id: string;
    /** 公钥类型 */
    type: string;
    /** hex公钥 */
    publicKeyHex: string;
  }[];
  /**
   * 认证密钥 公钥
   *
   * 对应 `document.publicKey.id`
   */
  authentication: string[];
  /**
   * 恢复密钥 公钥
   *
   * 对应 `document.publicKey.id`
   */
  recovery: string[];
  /** 服务 */
  service: {
    id: string;
    /** 服务类型	 */
    type: string;
    /** 服务端点 */
    serviceEndpoint: string;
  }[];
  /** 发证方提供的签名认证签名 */
  proof?: TProof;
}

export const model = {
  didDodument: (did: string, serviceEndpoint: string, activeKey: any, ownerKey: any, time: Date) => {
    var publicKey = [];
    var authentication = [];
    var recovery = [];
    publicKey.push(
      {
        "id": did + "#key-1",
        "type": constant.publicKey.type,
        "publicKeyHex": activeKey.pubKey,
      }
    );

    authentication.push(
      publicKey[0].id,
    );

    publicKey.push(
      {
        "id": did + "#key-2",
        "type": constant.publicKey.type,
        "publicKeyHex": ownerKey.pubKey,
      }
    );

    recovery.push(
      publicKey[1].id,
    );

    var service = []
    service.push(
      {
        "id": did + "#resolver",
        "type": constant.service.type,
        "serviceEndpoint": serviceEndpoint,
      }
    )

    var document:TDocument = {
      "@context": constant.document.context,
      id: did,
      "version": constant.document.version,
      "created": time.toJSON(),
      "updated": time.toJSON(),
      publicKey,
      authentication,
      recovery,
      service
    }


    document.proof = new utils().proof(document, authentication[0], activeKey.priKey);
    return document;
  },
}