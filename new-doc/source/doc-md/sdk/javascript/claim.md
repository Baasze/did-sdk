<!--
 * @Description: 
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-04-27 13:57:30
 * @LastEditTime: 2020-05-28 15:33:20
 * @LastEditors: sandman
 -->
# SAN DID 声明管理

以已注册的 `uuid: 61557ba3-19e4-0d8a-7e5b-5175ed410bcd` 的 issuer 为例

## 申请声明

request:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
uuid | string | issuer uuid | 
endpoint | string | issuer endpoint | 实现 /v1/claim/apply 接口的 endpoint
did | string | 用户 did | 
requestData | object | issuer 所需的 requestData |
hexPriKey | string | 用户 authentication 私钥 | 

``` js
const SANClient = require("did-sdk");

try {
  const client = new SANClient();
  requestData = {
    basicData: {
      Name: "san",
      MobilePhone: "183xxx",
      ClaimType: "RealNameAuthentication",
    },
    otherData: [],
  };
  let didInfo = {
    did: "did:san:xxx",
    priKey: "your authentication private key"
  }
  response = await client.claim.apply(issuerUuid, issuerEndpoint, didInfo.did, requestData, didInfo.priKey)
  console.log(response);
  assert(response.code == 0);
} catch(e) {
  console.log(e)
}
```

reponse:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
applyId | string | claim applyId | 


``` json
{
  "code": "0",
  "message": "ok",
  "content": { 
    "applyId": "b8eb5e38-5334-2785-9943-9c8962c4b590"
  },
  "details": ""
}
```

## 获取声明签发结果

request:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
uuid | string | issuer uuid | 
endpoint | string | issuer endpoint | 实现 /v1/claim/apply 接口的 endpoint
did | string | 用户 did | 
applyId | string | claim applyId |
hexPriKey | string | 用户 authentication 私钥 | 

``` js
try {
  const client = new SANClient();
  let didInfo = {
    did: "did:san:xxx",
    priKey: "your authentication private key"
  }
  response = await client.claim.result(issuerUuid, issuerEndpoint, didInfo.did, applyId, didInfo.priKey);
  console.log(response);
  assert(response.code == 0);
} catch(e) {
  console.log(e)
}
```

response:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
claim | object | claim 对象 | 
claim.id | string | claim uuid | 
claim.type | string | claim 类型 | 目前支持 ProofClaim
claim.issuer | string | claim issuer did | 
claim.issuanceDate | string | claim 发行时间 | 
claim.expirationDate | string | claim 过期时间 | 
claim.credentialSubject | object | 凭据主题 | 
claim.credentialSubject.id | string | 凭据id | 用户 did
claim.credentialSubject.shortDescription | string | 凭据简述 | 
claim.credentialSubject.longDescription | string | 凭据详述 | 
claim.credentialSubject.type | string | 凭据类型 | 
claim.revocation | object | claim 撤销对象 | 
claim.revocation.id | string | claim 撤销id |
claim.revocation.type | string | claim 撤销类型 | SimpleRevocationListV1 表示可用来查询 撤销列表
claim.proof | object | claim proof 对象 | 同 [did.document.proof](did.md)
status | string | claim 状态 | Done 表示已完成 

``` json
{
  "code": 0,
  "message": "ok",
  "content": {
    "status": "Done",
    "claim": { 
      "@context": [ "https://www.w3.org/2018/credentials/v1" ],
      "id": "b8eb5e38-5334-2785-9943-9c8962c4b590",
      "type": [ "ProofClaim" ],
      "issuer": "did:san:4yfxvinpobl3",
      "issuanceDate": "2020-05-15T06:13:24.576Z",
      "expirationDate": "2020-05-24T12:01:20Z",
      "credentialSubject":{ 
        "id": "did:san:tl5wn11lduob",
        "shortDescription": "实名认证声明",
        "longDescription": "该用户经过了我司的实名认证",
        "type": "RealNameAuthentication"
      },
      "revocation":{
        "id": "https://127.0.0:9200/v1/claim/revocations",
        "type": "SimpleRevocationListV1" 
      },
      "proof":{ 
        "type": "EcdsaSm2p256v1Signature2019",
        "creator": "did:san:4yfxvinpobl3#key-1",
        "signatureValue":"5de5196c2901973c8893e9b9084d4b42d73c7f8d9154da9240f9ae1be2ef0fc06c91136012a780c2464ec7141fadb11dd7cf5df7e550bdeda1f5c02665f803fc" } 
    }
  },
  "details": ""
}
```

## 授权已有声明

将 claim 授权给 vc (did用户),使用 vc did的私钥可解密

request:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
vcdid | string | 待授权的 did | vc用户
claim | string | claim 原文 | claim 原文只有用户调用 claim.result 可以得到,继续调用 claim.authorize 授权给 vc

``` js
try {
  response = await client.claim.authorize(vcdid, claim);
  console.log(response);
} catch(e) {
  console.log(e);
}
```

response:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
claim | string | claim 密文 |

``` json
{
  "code":"0",
  "message":"ok",
  "content":{
    "claim":"claim encrpto by vcdid authentication public key"
  },
  "details":""
}
```

## 验证声明

1. 验证 issuer 是否存在
2. 验证 claim proof
3. 验证是否吊销
4. 验证过期时间

request:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
claim | string | vc 收到的 claim 密文 |
hexPriKey | string | vcdid authentication 私钥 |

``` js
try{
  didInfo = {
    priKey: 'your authentication private key'
  }
  response = await client.claim.verify(claim, didInfo.priKey);
  console.log(response);
  assert(response.code == 0);
  } catch(e) {
  console.log(e);
}
```

response:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
claim | string | vc 通过的 claim 原文 |

``` json
{
  "code": 0,
  "message": "ok",
  "content": {
    "claim": {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        "id": "b8eb5e38-5334-2785-9943-9c8962c4b590",
        "type": ["ProofClaim"],
        "issuer": "did:san:4yfxvinpobl3",
        "issuanceDate": "2020-05-15T06:13:24.576Z",
        "expirationDate": "2020-05-24T12:01:20Z",
        "credentialSubject": {
          "id": "did:san:tl5wn11lduob",
          "shortDescription": "实名认证声明",
          "longDescription": "该用户经过了我司的实名认证",
          "type": "RealNameAuthentication"
        },
        "revocation": {
          "id": "https://127.0.0:9200/v1/claim/revocations",
          "type": "SimpleRevocationListV1"
        }
      }
  },
  "details": "", 
}
```
