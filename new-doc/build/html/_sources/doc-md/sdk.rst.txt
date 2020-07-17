
Javascript
==========

DID Javascript SDK 简介
-------------------------

DID Javascript SDK 提供了一整套对 SAN DID 进行管理操作的 Javascript 库。 目前，SDK 支持密钥管理、数字身份标识（SAN DID）管理、 声明（Claim）管理、 发证方（Issuer）管理。 未来还将支持更丰富的功能和应用。

接口能力
---------

================== ===================== ==============================================
 接口类型              接口名称                接口能力概述
================== ===================== ==============================================
SAN DID 的管理      DID 的创建             为用户创建区块链账户以及对应的 DID document 并上链

                    DID 的解析             通过 Resolver 解析器获取 DID Document

                    DID 信息更新           更新 DID Document 中的一些信息并上链 

                    DID 的删除             删除自己创建的 DID 账户

SAN DID 发证方管理  注册发证方           向发证中心注册发证方

                    更新发证方信息       发证方更新信息

                    获取发证方列表       向注册中心查询发证方列表

                    发证方签发声明       发证方向申请者签发声明 

                    注销发证方           发证方从注册中心将自己删除

SAN DID 声明管理    申请声明              用户向发证方申请声明
                    
                    获取声明签发结果      用户查询声明申请结果

                    授权已有声明          将已有的声明授权的 vc

                    验证声明              vc 验证声明的有效性

SAN DID 密钥工具    创建密钥对            生成 Sm2p256v1 密钥对

                    签名和验签            对数据进行国密签名以及验证签名的正确性
                  
                    加密和解密            对数据进行国密加密以及对解密结果的解密

================== ===================== ==============================================
                    
快速入门
---------

安装
^^^^^^^

.. code:: bash

   yarn add did-sdk

创建 SANClient
-----------------

.. code:: javascript

   const { SANClient } = require('did-sdk');
   let client = new SANClient({ serviceEndpoint: "did-service url", fetch: "your fetch implementation" });


**DID-SDK 目录结构**
::

   ├── CHANGELOG.md
   ├── README.md 
   ├── index.d.ts
   ├── index.js
   ├── index.js.map
   ├── lib
   │   ├── SANClient.d.ts
   │   ├── SANClient.js
   │   ├── SANClient.js.map
   │   ├── chain
   │   │   ├── index.d.ts
   │   │   ├── index.js
   │   │   └── index.js.map
   │   ├── claim
   │   │   ├── index.d.ts
   │   │   ├── index.js
   │   │   └── index.js.map
   │   ├── common
   │   │   ├── constant.d.ts
   │   │   ├── constant.js
   │   │   └── constant.js.map
   │   ├── crypto
   │   │   ├── index.d.ts
   │   │   ├── index.js
   │   │   └── index.js.map
   │   ├── did
   │   │   ├── index.d.ts
   │   │   ├── index.js
   │   │   ├── index.js.map
   │   │   ├── model.d.ts
   │   │   ├── model.js
   │   │   └── model.js.map
   │   ├── error.d.ts
   │   ├── error.js
   │   ├── error.js.map
   │   ├── issuer
   │   │   ├── index.d.ts
   │   │   ├── index.js
   │   │   └── index.js.map
   │   ├── rpc
   │   │   ├── jsonrpc.d.ts
   │   │   ├── jsonrpc.js
   │   │   ├── jsonrpc.js.map
   │   │   ├── rpcerror.d.ts
   │   │   ├── rpcerror.js
   │   │   └── rpcerror.js.map
   │   ├── utils.d.ts
   │   ├── utils.js
   │   └── utils.js.map
   ├── node_modules
   ├── package.json

接口说明
----------

.. toctree::
   :maxdepth: 3

   sdk/javascript/did.md
   sdk/javascript/issuer.md
   sdk/javascript/claim.md
   sdk/javascript/crypto.md
   sdk/javascript/utils.md
