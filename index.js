// // const apiPath = 'http://petstore.swagger.io/v2/swagger.json';
// // let Assert = require('assert');
// // let Swagmock = require('swagmock');
// // let Mockgen = Swagmock(apiPath);
// //
// //
// // Mockgen.requests()
// // // Mockgen.parameters({
// // //     path: '/pet/{petId}',
// // //     operation: 'get'
// // // }).then(mock => {
// // //     const petId = mock.parameters.path[0].value;
// // //     Mockgen.responses({
// // //         path: `/pet/${petId}`,
// // //         operation: 'get',
// // //         response: 200
// // //     }).then(mock => {
// // //         console.log(mock.responses); // This would print:
// // //     //     // {
// // //     //     //     "responses": [{
// // //     //     //         "id": 2530624032210944,
// // //     //     //         "category": {
// // //     //     //             "id": 8200505595527168,
// // //     //     //             "name": "r($vA&"
// // //     //     //         },
// // //     //     //         "name": "doggie",
// // //     //     //         "photoUrls": ["p0x1", "6O)3*kO"],
// // //     //     //         "tags": [{
// // //     //     //             "id": 4590764340281344,
// // //     //     //             "name": "WCTA6f!"
// // //     //     //         }, {
// // //     //     //             "id": -4614156653166592,
// // //     //     //             "name": "e"
// // //     //     //         }],
// // //     //     //         "status": "pending"
// // //     //     //     }]
// // //     //     // }
// // //     }).catch(error => {
// // //         Assert.ifError(error);
// // //     });
// // // }).catch(error => {
// // //     Assert.ifError(error);
// // // })
// //
// // Mockgen.responses({
// //     path: '/pet/findByStatus',
// //     operation: 'get'
// // }).then(mock => {
// //     console.log(mock.responses['200']);//This would print:
// //     // {
// //     //     "parameters": {
// //     //         "query": [{
// //     //             "name": "status",
// //     //             "value": [ 'available', 'pending' ],
// //     //             "separator": "multi"
// //     //         }]
// //     //     }
// //     // }
// // }).catch(error => {
// //     Assert.ifError(error);
// // })
//
// // const path = require('path');
// // console.log(path.join(require.resolve('json-schema'), '..', '..', 'draft-04', 'schema'));
//
// //Simply import the module with
//
// const fs = require('fs-extra');
// const path = require('path');
//
// const fetch = require('node-fetch');
// const deref = require('json-schema-deref-sync');
// const swagMock = require('swagmock');
//
// (async () => {
//
//     var OpenApiGenerator = require('open-api-test-generator');
//
//     const json = await fetch('http://petstore.swagger.io/v2/swagger.json').then(res => res.json());
//     const fullSchema = deref(json);
//
//     Object.keys(fullSchema.paths).forEach((url) => {
//         const endpoint = fullSchema.paths[url];
//         Object.keys(endpoint).forEach(async (method) => {
//             const data = endpoint[method];
//             const mock = {
//                 name: data.operationId,
//                 request: {
//                     method: method,
//                     url: url
//                 },
//                 responses: {
//                     success: {
//                         status: 200
//                     }
//                 }
//             };
//             const result = await swagMock(json).responses({path: url, operation: method, useExamples: true});
//             Object.keys(result.responses).forEach((name) => {
//                 mock.responses[name] = {
//                     status: parseInt(name) || 200,
//                     data: result.responses[name]
//                 };
//             });
//
//             fs.outputJsonSync(path.join(process.cwd(), 'generated', `${data.operationId}.mock.json`), mock, {spaces: 4});
//
//         });
//
//     });
//
//
// //
// // //Construct the generator object:
//     var generator = OpenApiGenerator(json, 'generated-old');
// //
// // //Then use it:
//     generator.generateNgApiMockdata();
//
// })();

var generate = require('json-schema-test-data-generator');

var schema = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "minLength:": 5
        },
        "active": {
            "type": "boolean"
        },
        "email": {
            "type": "string",
            "format": "email"
        },
        "accountNumber": {
            "type": "number"
        }
    },
    "required": ["name", "email"]
}

console.dir(generate(schema));
