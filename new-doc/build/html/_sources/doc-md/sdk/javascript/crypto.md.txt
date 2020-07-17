<!--
 * @Description: 
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-04-29 15:59:42
 * @LastEditTime: 2020-04-29 17:00:51
 * @LastEditors: sandman
 -->
# SAN DID 密钥工具

## 创建密钥对

生成 Sm2p256v1 密钥对

request:

``` js
const SANClient = require("did-sdk");

try {
  const client = new SANClient();
  var response = client.crypto.newKey();
  console.log(response);
} catch(e) {
  console.log(e)
}
```

response:

``` json
{
  "type": "EcdsaSm2p256v1Signature2019",
  "priKey": "4BFDE3EB8E8922FCA0171ED84A82068635C2A19B2D9AC4801D78C20E6A82FC95",
  "pubKey": "03C9F24775610904E8E2A908DF8BA566F9187644F6E92E151D94E6A1E52206473E"
}
```

## 签名和验签

request:

``` js
const SANClient = require("did-sdk");

try {
  const client = new SANClient();
  var response = client.crypto.newKey();
  console.log(response);

  const msg = "hello world!"
  const msgStr = JSON.stringify(msg)
  const signature  = client.crypto.sign(msgStr, response.priKey);
  console.log(signature);

  const valid  = client.crypto.verify(msgStr, signature, response.pubKey);
  console.log(valid)
  assert(valid == true);
} catch(e) {
  console.log(e)
}
```

response:

``` json
{
  "type": "EcdsaSm2p256v1Signature2019",
  "priKey": "7A56D9CDB75B842D5F579FAC4CD64FAFD604942745832B07F779596EB67BD777",
  "pubKey": "02A0C6F75BAEBB84BDA8B2F5293DBA23E1D8AEC6055B5A72A76DA59845D2C6287A"
}
```

```
25a5e2e3719ac1d47349c7e77622db7e2c21d7f2b2715dc2535a232c49450e1f4e5bedd434fe210e5f49f4c85e4c2e50955b70b99fa2144673be34f9abf42e28
true
```

## 加密和解密

request:

``` js
const SANClient = require("did-sdk");

try {
  const client = new SANClient();
  var response = client.crypto.newKey();
  console.log(response);

  const encryptData  = client.crypto.encrypt(msgStr, response.pubKey);
  console.log(encryptData)
  const data  = client.crypto.decrypt(encryptData, response.priKey);
  console.log(data)
  assert(data == msgStr)
  } catch(e) {
  console.log(e)
}
```

response:

``` json
{
  "type": "EcdsaSm2p256v1Signature2019",
  "priKey": "4005B3926DEA3D5540D426B47ADAC168C7B859EF152A688343B723C63F3035C3",
  "pubKey": "022D51DE36064373D5DD3A5528D1B7ECD970B2EEBC29101A28594C355D6371B0A2"
}
```

```
815c6f7e4f2cf904717a36ae1d05a6dcce74445c2e0e37fcc67005128ae66fdd124ce021a25cce5e0c33b324d69b33ce3e90bb8e581e192062e3b10edb8715b2000000e00000002b000000d7000000000000007d000000790000004d0000004e68656c436f207724726c64f6
hello world!
```