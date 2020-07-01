<!--
 * @Description: 
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-04-29 15:59:42
 * @LastEditTime: 2020-04-29 17:06:15
 * @LastEditors: sandman
 -->
## SAN Javascript SDK crypto op 文档

### op

- newDid

生成 did

request:

``` js
  const client = new SANClient();
  var did = client.utils.newDid();
  console.log(did)
```

response:

```
did:san:xh3aqxhjfutg
```

- setDocumentKey and getDocumentKey

设置或获取公钥

request:

``` js
  const newKey1 = client.crypto.newKey();
  const newKey2 = client.crypto.newKey();
  const newKey3 = client.crypto.newKey();
  
  var publicKey = [];
  publicKey = client.utils.setDocumentKey(publicKey, newKey1, "did:san:test#key-0");
  publicKey = client.utils.setDocumentKey(publicKey, newKey2, "did:san:test#key-1");
  publicKey = client.utils.setDocumentKey(publicKey, newKey3, "did:san:test#key-0");
  console.log(publicKey);
  const foundKey = client.utils.getDocumentKey(publicKey, "did:san:test#key-0");
  console.log(foundKey.publicKeyHex == newKey3.pubKey);
```

response:

``` json
[
  {
    "id": "did:san:test#key-0",
    "type": "EcdsaSm2p256v1Signature2019",
    "publicKeyHex": "03AEDCA98F9809CF89E5B5018F345407BD0EB997EA4AFFDEE297C771B3BF16008F"
  },
  {
    "id": "did:san:test#key-1",
    "type": "EcdsaSm2p256v1Signature2019",
    "publicKeyHex": "0283B8FE573343320F94F2D03B5FF8F7CEEBE40389C58BA9AB21CC91745EA06AFF"
  }
]
true
```

- proof

构建 proof

request:

``` js
  const key = client.crypto.newKey();
  var proof = client.utils.proof("hello world!", "test", key.priKey);
  console.log(proof);
```

response:

``` json
{
  "type": "EcdsaSm2p256v1Signature2019",
  "creator": "test",
  "signatureValue": "9e8c2603d153bdb3a900c014d8ca4254de0353c614badccb910c679c2e18f84fc39cbc780109c38a825d881b4d3465f9572754e67702e17ccb41ec2ddda804af"
}
```