/*
 * @Description: 
 * @Author: sandman sandmanhome@hotmail.com
 * @Date: 2020-04-22 10:41:15
 * @LastEditTime: 2020-05-07 12:05:35
 * @LastEditors: sandman
 */

import { did } from "./did/index";
import { issuer } from "./issuer/index";
import { claim } from "./claim/index";
import { crypto } from "./crypto/index";
import { utils } from "./utils";

export class SANClient {
  public serviceEndpoint: string;
  public fetch: any;

  public did: did;
  public claim: claim;
  public issuer: issuer;
  public crypto: crypto;
  public utils: utils;

  // public issuer: issuer;
  constructor(option: {
    serviceEndpoint?: string,
    fetch?: any
  }) {
    if (option && option.serviceEndpoint) {
      this.serviceEndpoint = option.serviceEndpoint;
    } else {
      this.serviceEndpoint = (global as any).serviceEndpoint;
    }

    if (option && option.fetch) {
      this.fetch = option.fetch;
    } else {
      this.fetch = (global as any).fetch;
    }

    this.did = new did(this);
    this.claim = new claim(this);
    this.issuer = new issuer(this);
    this.crypto = new crypto();
    this.utils = new utils();
  }
}
