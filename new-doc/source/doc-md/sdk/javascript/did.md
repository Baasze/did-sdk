<!--
 * @Description: 
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-04-27 13:57:30
 * @LastEditTime: 2020-04-29 14:07:05
 * @LastEditors: sandman
 -->
# SAN DID 管理

## DID 的创建

request:

``` js
const SANClient = require("did-sdk");

try {
  const client = new SANClient();
  var response = client.did.create();
  console.log(response);
} catch(e) {
  console.log(e)
}
```

reponse:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
document | object | did document 对象 | 
document.id | string| did id | 
document.created | string | 创建时间 |
document.updated | string | 更新时间 |
document.publicKey | array | 公钥数组 |
document.publicKey.id | string| 公钥id |
document.publicKey.type | string| 公钥类型 |
document.publicKey.publicKeyHex | string| hex公钥 |
document.authentication | array| 认证密钥 公钥 | 对应 document.publicKey.id
document.recovery | array | 恢复密钥 公钥 | 对应 document.publicKey.id
document.service | object | 服务 |
document.service.type | string | 服务类型 |
document.service.serviceEndpoint | string | 服务端点 |
document.proof | object | document 签名 |
document.proof.type | string | 签名类型 |
document.proof.creator | string | 签名公钥id | 对应 document.publicKey.id
document.proof.signatureValue | string | 签名 | did document 签名
did | string | did | 对应 document.id
authenticationKey | object | did 认证密钥 | 
authenticationKey.type | string | 认证密钥 类型 | 
authenticationKey.priKey | string | 认证密钥 私钥 | 
authenticationKey.pubKey | string | 认证密钥 公钥 | 
recoveryKey | object | did recoveryKey | did 恢复密钥,其他字段同 authenticationKey

``` json
{
  "code": 0,
  "message": "ok",
  "content": {
    "document": {
      "@context": "https://w3id.org/did/v1",
      "id": "did:san:4yfxvinpobl3",
      "version": 1,
      "created": "2020-05-14T13:53:53.088Z",
      "updated": "2020-05-14T13:53:53.088Z",
      "publicKey": [{
          "id": "did:san:4yfxvinpobl3#key-1",
          "type": "EcdsaSm2p256v1Signature2019",
          "publicKeyHex": "032DA4035E89D19DB5CE8735A63A716E2AC6FA8EFF2CCF4DB16873835DF02EA381"
        },{
          "id": "did:san:4yfxvinpobl3#key-2",
          "type": "EcdsaSm2p256v1Signature2019",
          "publicKeyHex": "037EAD1A05B705C59BD4611218813C5570472F9E9BDE69802A2BAC7C8EE90D2567"
        }
      ],
      "authentication": [
        "did:san:4yfxvinpobl3#key-1"
      ],
      "recovery": [
        "did:san:4yfxvinpobl3#key-2"
      ],
      "service": [{
          "id": "did:san:4yfxvinpobl3#resolver",
          "type": "DIDResolve",
          "serviceEndpoint": "http://127.0.0.1:9100"
        }
      ],
      "proof": {
          "type": "EcdsaSm2p256v1Signature2019",
          "creator": "did:san:4yfxvinpobl3#key-1",
          "signatureValue": "ceb5eea3e6c57ce74e2ccd85deebab7e1068c9b654958caf1c27ae2310408b3bcac3f4908f9df6448c249da57f7cd81c0da0d81f6bbd2233a984c52ba1383cb9"
        }
    },
    "did": "did:san:4yfxvinpobl3",
    "authenticationKey": {
      "type": "EcdsaSm2p256v1Signature2019",
      "priKey": "905E5CFCB07BF66D4B475E86523E59A4932B7FE6B01EA62F985CC4B09E013BD5",
      "pubKey": "032DA4035E89D19DB5CE8735A63A716E2AC6FA8EFF2CCF4DB16873835DF02EA381"
    },
    "recoveryKey": {
      "type": "EcdsaSm2p256v1Signature2019",
      "priKey": "E71A77AF3E00201AC363994934A25972F6EE845737E6CBA9BDC2488E7AEE123D",
      "pubKey": "037EAD1A05B705C59BD4611218813C5570472F9E9BDE69802A2BAC7C8EE90D2567"
    }
  },
  "details": ""
}
```

## DID 的解析

request:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
did | string | 待解析的 did id |

``` js
const SANClient = require("did-sdk");

try {
  const client = new SANClient();
  let did = 'did:san:xxx';
  response = await client.did.resolve(did);
  console.log(response);
  assert(response.code == 0);
} catch(e) {
  console.log(e)
}
```

response:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
document | object | did document 对象 | 同 create 方法 response.content.document

``` json
{
  "code": 0,
  "message": "ok",
  "content": {
    "document": {
      "@context": "https://w3id.org/did/v1",
      "id": "did:san:4yfxvinpobl3",
      "version": 1,
      "created": "2020-05-14T13:53:53.088Z",
      "updated": "2020-05-14T13:53:53.088Z",
      "publicKey": [{
          "id": "did:san:4yfxvinpobl3#key-1",
          "type": "EcdsaSm2p256v1Signature2019",
          "publicKeyHex": "032DA4035E89D19DB5CE8735A63A716E2AC6FA8EFF2CCF4DB16873835DF02EA381"
        },{
          "id": "did:san:4yfxvinpobl3#key-2",
          "type": "EcdsaSm2p256v1Signature2019",
          "publicKeyHex": "037EAD1A05B705C59BD4611218813C5570472F9E9BDE69802A2BAC7C8EE90D2567"
      }],
      "authentication": [
        "did:san:4yfxvinpobl3#key-1"
      ],
      "recovery": [
        "did:san:4yfxvinpobl3#key-2"
      ],
      "service": [{
        "id": "did:san:4yfxvinpobl3#resolver",
        "type": "DIDResolve",
        "serviceEndpoint": "http://127.0.0.1:9100"
      }],
      "proof": {
        "type": "EcdsaSm2p256v1Signature2019",
        "creator": "did:san:4yfxvinpobl3#key-1",
        "signatureValue": "ceb5eea3e6c57ce74e2ccd85deebab7e1068c9b654958caf1c27ae2310408b3bcac3f4908f9df6448c249da57f7cd81c0da0d81f6bbd2233a984c52ba1383cb9"
      }
    }
  },
  "details": ""
}
```

## DID 信息更新

request:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
did | string | 待解析的 did id |
oldOwnerPriKey | string | 原recovery私钥 |
document | object | 修改后的document |
newOwnerPriKey | string | 新recovery私钥 | 可选,修改非密钥时不需要

``` js
const SANClient = require("did-sdk");

try {
  const client = new SANClient();
  // 修改密钥对
  let didInfo = {
    did: "did:san:xxx",
    recKey: 'your recovery private key',
  }
  let response = await client.did.resolve(did);
  let document = response.content.document
  let newAuthenticationKey = client.crypto.newKey();
  let newRecoveryKey = client.crypto.newKey();
  document.publicKey = client.utils.setDocumentKey(document.publicKey, newAuthenticationKey, document.authentication[0])
  document.publicKey = client.utils.setDocumentKey(document.publicKey, newRecoveryKey, document.recovery[0])
  response = await client.did.update(didInfo.did, didInfo.recKey, document, newRecoveryKey.priKey);
  console.log(response);
  assert(response.code == 0);

  // 修改其他参数不需要新的 recoveryKey 密钥
  console.log("did update others(no neeed recoveryKey)");
  document.version = 2;
  response = await client.did.update(didInfo.did, newRecoveryKey.priKey, document);
  console.log(response);
  assert(response.code == 0);
} catch(e) {
  console.log(e)
}
```

response:

``` json
{
  "code": 0,
  "message": "ok",
  "content": "",
  "details": ""
}
```

## DID 的删除

request:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
did | string | 待解析的 did id |
hexPriKey | string | recovery 私钥 |

``` js
const SANClient = require("did-sdk");

try {
  let didInfo = {
    did: "did:san:xxxx",
    priKey: 'your recovery private key'
  }
  response = await client.did.revoke(didInfo.did, didInfo.priKey);
  console.log(response);
  assert(response.code == 0);
} catch(e) {
  console.log(e)
}
```

response:

``` json
{
  "code": 0,
  "message": "ok",
  "content": "",
  "details": ""
}
```
