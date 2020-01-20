// import {Validator} from 'jsonschema';
// import fetch from 'node-fetch';
//
// const swaggerSchema = require('swagger-schema-official/schema');
// var deref = require('json-schema-deref-sync');
//
// // import {Info} from 'swagger-schema-official';
// // const swaggerSchema = require('swagger-schema-official/schema');
// const validator = new Validator();
// (async () => {
//     const jsonSchemaDraft04 = await fetch('http://json-schema.org/draft-04/schema#').then(res => res.json());
//     validator.addSchema(jsonSchemaDraft04);
//     const json = await fetch('http://petstore.swagger.io/v2/swagger.json').then(res => res.json());
//     // console.log(json);
//     // console.log(validator.validate(json, swaggerSchema));
//
//     const fullSchema = deref(json);
//     console.log(fullSchema.paths);
//
//
//
// })();
