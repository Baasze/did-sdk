# Changelog

All notable changes to this project will be documented in this file.

## [0.1.11] - 2020-12-09

### Changed

- update icbsc.js to 1.1.1

## [0.1.10] - 2020-07-01

### Changed

- fix issuer.requestData.otherData string[] | object []

## [0.1.9] - 2020-05-28

### Changed

- claim.verify check revocation

## [0.1.8] - 2020-05-26

### Changed

- issuer.requestData.basicData support string[] | object[], convert to object[] (if item can deserialize by JSON) for user

## [0.1.7] - 2020-05-25

### Changed

- optimization Typescript generic support

## [0.1.6] - 2020-05-18

### Changed

- return all issuers if uuid is empty

## [0.1.3] - 2020-05-12

### Added

- add error.ts

### Changed

- limit npm publish files
- fix README

## [0.1.2] - 2020-05-07

### Changed

- fix SANClient required option = {serviceEndpoint, fetch }
- js to ts

## [0.1.1] - 2020-05-06

### Changed

- fixed SANClient option

### Added

- icbcs.js

## [0.1.0] - 2020-05-06

### Added

- module claim
- module crypto
- module did
- module issuer
- module utils