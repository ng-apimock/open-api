import {Validator} from 'jsonschema';
import fetch from 'node-fetch';
import {inject, injectable} from 'inversify';
import Mock from '@ng-apimock/core/dist/mock/mock';
import * as fs from 'fs-extra';
import * as path from 'path';

const deref = require('json-schema-deref-sync');
const generator = require('json-schema-test-data-generator');

@injectable()
export class OpenApiProcessor {

    constructor(@inject('Validator') private validator: Validator) {
    }

    async process(url: string): Promise<void> {
        const json = await fetch(url).then(res => res.json());
        const fullSchema = deref(json);
        Object.keys(fullSchema.paths).forEach((url: string) => {
            const endpoint = fullSchema.paths[url];
            Object.keys(endpoint).forEach((method: string) => {
                const data = endpoint[method];
                const mock = {
                    name: data.operationId,
                    request: {
                        method: method,
                        url: url
                    },
                    responses: {
                        success: {
                            status: 200
                        }
                    }
                } as Mock;

                // data.parameters.forEach((param: any) => {
                //     const x = (param.schema) ? generator(param.schema) : generator(param);
                //     x
                //         .filter((y: any) => y.valid)
                //         .forEach((y:any)  => {
                //             var validMocks:any = {};
                //             validMocks[param] = y.data;
                //             validMocks.description = y.message;
                //             mock.responses['success'].data = [];
                //             (mock.responses['success'].data as any).push(validMocks);
                //             // console.log(validMocks);
                //         });
                //     console.log(x);
                // });
                // Object.keys(data.responses).forEach((response: string) => {
                //     // const responseData = data.responses[response];
                //     mock.responses[response] = {
                //
                //     }
                // });

                fs.outputJsonSync(path.join(process.cwd(), 'generated', `${data.operationId}.mock.json`), mock);
                // console.log(mock);
            });

            // console.log(fullSchema.paths[path]);
        });

    }
}