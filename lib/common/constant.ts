/*
 * @Description: 
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-05-06 16:26:37
 * @LastEditTime: 2020-05-06 17:40:08
 * @LastEditors: sandman
 */

export const constant = {
  document: {
    context: "https://w3id.org/did/v1",
    id: "did:san:",
    version: "1",
  },

  publicKey: {
    type: "EcdsaSm2p256v1Signature2019",
  },

  service: {
    type: "DIDResolve",
  },

  proof: {
    type: "EcdsaSm2p256v1Signature2019",
  },

  chain: {
    contract: "did",
    updateContract: "icbs"
  },
};