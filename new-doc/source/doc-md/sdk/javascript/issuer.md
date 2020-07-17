<!--
 * @Description: 
 * @Author: sandman kay20475@hotmail.com
 * @Date: 2020-04-29 10:36:20
 * @LastEditTime: 2020-07-01 14:57:09
 * @LastEditors: sandman
 -->
# SAN DID 发证方管理

## 注册发证方

[DID 账户](./did.md)才可以创建 issuer。

request:

``` js
const SANClient = require("did-sdk");
(async() => {
  try {
    const client = new SANClient();
    // 创建 issuer did 账号
    var response = await client.did.create();
    console.log(response);

    var issuer = {
      "did": response.content.did,
      "website": "https://github.com/Baasze",
      "endpoint": "http://192.168.100.107:9200",
      "shortDescription": "白泽企业实名认证声明",
      "longDescription": "白泽企业实名认证声明",
      "serviceType": "EnterpriseAuthentication",
      "requestData": {
        "basicData": ["Name", "MobilePhone", "ClaimType"],
        "otherData": [],
      },
    };

    var issuerDidInfo =  {
      authenticationPrivKey: ...
    }
    response = await client.issuer.create(issuer, issuerDidInfo.authenticationPrivKey);
    console.log(response);
  } catch(e) {
    console.log(e)
  }
})()
```

respose: 

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
issuer | object | document 对象 |
issuer.id | number | issuer 的序号 |
issuer.uuid | string | issuer 的 uuid |
issuer.website | string | issuer 的网址 |
issuer.endpoint | string | issuer 的服务地址 |
issuer.shortDescription | string | issuer 的短描述 |
issuer.longDescription | string | issuer 的长描述 |
issuer.serviceType | string | issuer 提供的认证类型 |
issuer.requestData | object | 需要向 issuer 提供的信息 |
issuer.requestData.basicData | array | 需要向 issuer 提供的基本信息 |
issuer.requestData.otherData | array | 需要向 issuer 提供的其它信息 |
issuer.did | string | issuer 的 did |
issuer.createTime | string | issuer 的创建时间 |
issuer.updateTime | string | issuer 的更新时间 |

``` json
{ "code": 0,
  "message": "ok",
  "content":
   { "issuer":
      {
        "website": "https://github.com/Baasze",
        "endpoint": "http://127.0.0.1:9100",
        "shortDescription": "白泽企业实名认证声明",
        "longDescription": "白泽企业实名认证声明",
        "serviceType": "EnterpriseAuthentication",
        "requestData": {
          "basicData": ["Name", "MobilePhone", "ClaimType"],
          "otherData": []
        },
        "did": "did:san:n5ouq51z5byf",
        "id": "",
        "uuid": "bdc45f4c-4869-30b9-adb0-9ff7845222c5",
        "createTime": "2020-04-27T14:08:37.520Z",
        "updateTime": "2020-04-27T14:08:37.520Z"
      }
   },
  "details": "" }
```

## 获取发证方列表

request:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
uuid | string | 待解析的 issuer uuid |

``` js
const SANClient = require("did-sdk");
(async() => {
  try {
    const client = new SANClient();
    // resolve 所有的 issuer
    var resp1 = await client.issuer.resolve();
    console.log(resp1);

    // resolve 指定 uuid 的 issuer
    var resp2 = await client.issuer.resolve('bdc45f4c-4869-30b9-adb0-9ff7845222c5');
    console.log(resp2)
  } catch(e) {
    console.log(e)
  }
})()

```

response: 

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
issuer | array | issuer 列表|
issuer.id | number | issuer 的序号 |
issuer.uuid | string | issuer 的 uuid |
issuer.did | string | issuer 的 did |
issuer.website | string | issuer 的网址 |
issuer.endpoint | string | issuer 的服务地址 |
issuer.shortDescription | string | issuer 的短描述 |
issuer.longDescription | string | issuer 的长描述 |
issuer.serviceType | string | issuer 提供的认证类型 |
issuer.requestData | object | 需要向 issuer 提供的信息 |
issuer.requestData.basicData | array | 需要向 issuer 提供的基本信息 |
issuer.requestData.otherData | array | 需要向 issuer 提供的其它信息 |
issuer.createTime | string | issuer 的创建时间 |
issuer.updateTime | string | issuer 的更新时间 |

``` json
{ "code": 0,
  "message": "ok",
  "content": { 
    "issuers": [{
      "id": 0,
      "uuid": "5f72d137-4670-f36a-ae7d-ca2a636c2a65",
      "did": "did:san:n5ouq51z5byf",
      "website": "https://github.com/Baasze",
      "endpoint": "http://127.0.0.1:9100",
      "shortDescription": "白泽企业实名认证声明",
      "longDescription": "白泽企业实名认证声明",
      "serviceType": "EnterpriseAuthentication",
      "requestData": {
        "basicData": [],
        "otherData": []
      },
      "createTime": "2020-04-27T14:08:37.520Z",
      "updateTime": "2020-04-27T14:08:37.520Z"
    }]
  },
  "details":  "" }
```

## 更新发证方信息

request: 

``` js
const SANClient = require("did-sdk");
(async() => {
  try {
    const client = new SANClient();
    var issuer = {
      "website": "https://github.com/Baasze",
      "endpoint": "http://192.168.100.107:9200",
      "shortDescription": "白泽企业实名认证声明",
      "longDescription": "白泽企业实名认证声明",
      "serviceType": "EnterpriseAuthentication",
      "requestData": {
        "basicData": ["Name", "MobilePhone", "ClaimType"],
        "otherData": [],
      },
    };
    var issuerDidInfo =  {
      authenticationPrivKey: ...
    }
    var response = await client.issuer.update(issuer, issuerDidInfo.authenticationPrivKey);
    console.log(response);
  } catch(e) {
    console.log(e)
  }
})()
```

respose: 

返回结果类型和 create 的 respose 一致

## 发证方签发声明

request: 

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
rawClaim | object | 待 issuer 签名的 claim|
did | string | issuer 的 did |
priKey | string | issuer 的 私钥 |

```js
const SANClient = require("did-sdk");
(async() => {
  try {
    let didInfo ={
      did: 'did:san:4yfxvinpobl3',
      priKey: 'did:san:4yfxvinpobl3 authentication private key'
    }  
    let rawClaim =  {
      "@context": [
        "https://www.w3.org/2018/credentials/v1"
      ],
      "id": "b8eb5e38-5334-2785-9943-9c8962c4b590",
      "type": [
        "ProofClaim"
      ],
      "issuer" : "did:san:4yfxvinpobl3",
      "issuanceDate": "",
      "expirationDate": "2020-05-24T12:01:20Z",
      "credentialSubject": {
        "id": "did:san:jnb2fwn2dnrd",
        "shortDescription": "实名认证声明",
        "longDescription": "该用户经过了我司的实名认证",
        "type": "RealNameAuthentication"
      },
      "revocation": {
        "id": "https://127.0.0:9200/v1/claim/revocations",
        "type": "SimpleRevocationListV1"
      }
    }
    let now = new Date()
    rawClaim.issuanceDate = now.toJSON()
    let resp = await client.issuer.claim(rawClaim, didInfo.did, didInfo.priKey)
  } catch(e) {
    console.log(e)
  }
})()
```

response:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
claim| object | 签发的声明 |
claim.@context | string | w3c 声明标准 |
claim.id | string | applyId |
claim.type | array | 类型 |
claim.issuer | string | 声明的发证方 |
claim.issuanceDate | string | 声明的签发时间 |
claim.expirationDate | string | 声明的过期时间 |
claim.credentialSubject | object | 声明的内容 |
claim.credentialSubject.id | string | 声明的目标 did |
claim.credentialSubject.shortDescription | string | 声明的短描述 |
claim.credentialSubject.longDescription | string | 声明的长描述 |
claim.credentialSubject.type | string | 声明的类型 |
claim.revocation| object | 声明的吊销相关信息 |
claim.revocation.id | string | 声明的吊销的 id |
claim.revocation.type | string | 声明的吊销的类型 |
claim.proof| object | 发证方提供的签名认证 |
claim.proof.type | string | 签名方式 |
claim.proof.creator | string | 签名账户 |
claim.proof.signatureValue | string | 签名结果 |

```json
{
    "code":0,
    "message":"ok",
    "content":{
        "claim":{
            "@context":[
                "https://www.w3.org/2018/credentials/v1"
            ],
            "id":"b8eb5e38-5334-2785-9943-9c8962c4b590",
            "type":[
                "ProofClaim"
            ],
            "issuer":"did:san:4yfxvinpobl3",
            "issuanceDate":"2020-05-15T09:31:32.954Z",
            "expirationDate":"2020-05-24T12:01:20Z",
            "credentialSubject":{
                "id":"did:san:jnb2fwn2dnrd",
                "shortDescription":"实名认证声明",
                "longDescription":"该用户经过了我司的实名认证",
                "type":"RealNameAuthentication"
            },
            "revocation":{
                "id":"https://127.0.0:9200/v1/claim/revocations",
                "type":"SimpleRevocationListV1"
            },
            "proof":{
                "type":"EcdsaSm2p256v1Signature2019",
                "creator":"did:san:4yfxvinpobl3#key-1",
                "signatureValue":"4972eee4cc34dbf21eba5fd584c0d813283b43421660d28e8d6b0e3d6cf7afbdf44ffed6e7422897f9bbe28fa5ff033fc6589ff74f74a012b581bafcc4e841b6"
            }
        }
    },
    "details": ""
}
```

## 注销发证方

request:

名称 | 类型 | 说明 | 备注
:-: | :-: | :-: | :-:
uuid | string | 待解析的 issuer uuid |
recoveryPrivKey | string | recovery 私钥 |

``` js
const SANClient = require("did-sdk");
(async() => {
  try {
    const client = new SANClient();
    var issuerDidInfo =  {
      did: did,
      uuid: uuid,
      recoveryPrivKey: ...
    }
    var response = await client.issuer.revoke(issuerDidInfo.did , issuerDidInfo.uuid, issuerDidInfo.recoveryPrivKey);
    console.log(response);
  } catch(e) {
    console.log(e)
  }
})()
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