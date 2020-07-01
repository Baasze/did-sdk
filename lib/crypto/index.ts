/*
 * @Description:
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-04-22 13:49:00
 * @LastEditTime: 2020-07-01 17:22:36
 * @LastEditors: kay
 */
import { constant } from "../common/constant";
import { Numeric, Crypto, Utils } from 'icbsc.js';

export class crypto {
  /**
   * 创建密钥对
   *
   * 生成 Sm2p256v1 密钥对
   */
  newKey = () => {
    var keyPair = Numeric.newHexKey();
    keyPair.type = constant.publicKey.type as any;
    return keyPair;
  };

  /**
   * 签名
   */
  sign = (msgStr: string, hexPriKey: string, type = Numeric.KeyType.sm2) => {
    const msgByte = Utils.parseUtf8StringToHex(msgStr);
    const privateKey = Numeric.HexToKey(type, hexPriKey, true);
    return Crypto.sm2.doSignature(msgByte, privateKey.getKey(), { hash: true });
  };

  /**
   * 验证
   */
  verify = (msgStr: string, signHex: string, hexPubKey: string, type = Numeric.KeyType.sm2) => {
    const msgByte = Utils.parseUtf8StringToHex(msgStr);
    const publicKey = Numeric.HexToKey(type, hexPubKey, false);
    return Crypto.sm2.doVerifySignature(msgByte, signHex, publicKey.getKey(), { hash: true });
  };

  keyToChainKey = (hexKey: string, isPrivate: boolean, type = Numeric.KeyType.sm2) => {
    return Numeric.HexToKey(type, hexKey, isPrivate).toString();
  };

  /**
   * 加密
   */
  encrypt = (msgStr: string, hexPubKey: string, type = Numeric.KeyType.sm2) => {
    const msgByte = Utils.parseUtf8StringToHex(msgStr);
    const publicKey = Numeric.HexToKey(type, hexPubKey, false);
    return Crypto.sm2.doEncrypt(msgByte, publicKey.toString());
  };

  /**
   * 解密
   */
  decrypt = (msg: string, hexPriKey: string, type = Numeric.KeyType.sm2) => {
    const privateKey = Numeric.HexToKey(type, hexPriKey, true);
    const msgByte = Crypto.sm2.doDecrypt(msg, privateKey.toString());
    return Utils.arrayToUtf8(msgByte)
  };
}