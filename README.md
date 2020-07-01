# DID-SDK

### install

```sh
yarn add did-sdk
```

### SANClient error

- ok

``` json
{
  code: 0,
  message: 'ok',
  content: { issuers: [ [Object] ] },
  details: ''
}
```

code is 0, message is 'ok', content is the result.

- error

``` json
{
  "code": -10001,
  "message": '请求参数无效',
  "content": '',
  "details": 'did invalid'
}
```

code not 0, message is a brief description of error, details is the detailed description of error.

### SANClient op
example
```js
const SANClient = require("./did-sdk/index");

const client = new SANClient();
var response = await client.did.create();
console.log(response);
```

- did op
[did](doc/source/doc-md/sdk/javascript/did.md)

- issuer op
[issuer](doc/source/doc-md/sdk/javascript/issuer.md)

- claim op
[claim](doc/source/doc-md/sdk/javascript/claim.md)

- crypto op
[crypto](doc/source/doc-md/sdk/javascript/crypto.md)

- utils op
[utils](doc/source/doc-md/sdk/javascript/utils.md)

