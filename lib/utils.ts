/*
 * @Description:
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-04-22 13:51:07
 * @LastEditTime: 2020-05-22 18:29:45
 * @LastEditors: John Trump
 */
import { constant } from "./common/constant";
import { crypto } from './crypto/index';

export class utils {
  newDid = () => {
    return constant.document.id + this.newAccount();
  };

  newAccount = () => {
    let newAccountName = '';

    // 生成一个12位的随机账户名
    var characters = 'abcdefghijklmnopqrstuvwxyz12345';
    var charactersLength = characters.length;
    for (var i = 0; i < 12; i++) {
      newAccountName += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return newAccountName;
  };

  getAccount = (did: string) => {
    return did.split(":").pop();
  };

  getDocumentKey = (publicKey: any[], id: string) => {
    for (var i = 0; i < publicKey.length; i++) {
      if (publicKey[i].id == id) {
        return publicKey[i];
      }
    }

    return null;
  };

  getDidByKeyId = (keyId: string) => {
    var keyid = keyId.split("#")
    if (keyid.length > 0) {
      return keyid[0];
    } else {
      return null;
    }
  };

  setDocumentKey = (publicKey: any[], key: any, keyId: string) => {
    var i = 0;
    for (; i < publicKey.length; i++) {
      if (publicKey[i].id == keyId) {
        publicKey[i].publicKeyHex = key.pubKey;
        return publicKey;
      }
    }

    // auto add
    const did = this.getDidByKeyId(keyId);
    if (!did) {
      return null;
    }

    publicKey.push(
      {
        id: did + '#key-' + i,
        type: key.type,
        publicKeyHex: key.pubKey,
      }
    )

    return publicKey;
  };

  proof = (msg: any, creator: string, hexPriKey: string):TProof => {
    const msgStr = JSON.stringify(msg)
    const signatureValue = new crypto().sign(msgStr, hexPriKey);
    return {
      "type": constant.proof.type,
      "creator": creator,
      signatureValue,
    };
  };
};

/**
 * 发证方提供的签名认证签名
 */
export type TProof = {
  /** 签名方式 */
  type: string;
  /** 签名账户 */
  creator: string;
  /** 签名 */
  signatureValue: string;
}