# ng-apimock/open-api [![CircleCI](https://circleci.com/gh/ng-apimock/open-api.svg?style=svg)](https://circleci.com/gh/ng-apimock/open-api)  [![dependency Status](https://img.shields.io/david/ng-apimock/open-api.svg)](https://david-dm.org/ng-apimock/open-api) [![devDependency Status](https://img.shields.io/david/dev/ng-apimock/open-api.svg)](https://david-dm.org/ng-apimock/open-api#info=devDependencies)
Mock file generator from open-api specifications. 
 
## Getting Started

```shell
npm install @ng-apimock/open-api --save-dev -g
```

Once the plugin has been installed globally, you can use it from the commandline like this:

```
ng-apimock-generate --url=https://petstore.swagger.io/v2/swagger.json --resolverDirectory=./test/resolvers --mixins=./test/mixins
```

This will output the mocks in the current working directory under `generated`.
