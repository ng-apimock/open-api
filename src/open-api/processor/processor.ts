import {Mock} from '@ng-apimock/core/dist/mock/mock';
import * as chalk from 'chalk';
import * as debug from 'debug';
import * as fs from 'fs-extra';
import {inject, injectable} from 'inversify';
import {Validator} from 'jsonschema';
import * as path from 'path';

import {Mapper, Resolver} from '../resolvers/resolver';
import {ResolverService} from '../resolvers/resolver.service';
import {SchemaService} from '../schema/schema.service';

import {MockResponse} from './mock.response';

export const log = debug('ng-apimock:processor');

@injectable()
export class Processor {
    constructor(@inject('ResolverService') private resolverService: ResolverService,
                @inject('SchemaService') private schemaService: SchemaService,
                @inject('Validator') private validator: Validator) {
    }

    /**
     * Processes the open-api url and generates mocks of the specification.
     * @param url The url
     */
    async process(url: string): Promise<void> {
        log(`${chalk.cyan(`>> Processing open-api url: ${url}`)}`);
        const schema = await this.schemaService.getSchema(url);

        (await Promise.all(Object.keys(schema.paths)
            .map(async (key: string) => await this.getMocksForEndpoint(key, schema.paths[key]))))
            .reduce((mocks: Mock[], newMocks: Mock[]) => mocks.concat(newMocks), [])
            .forEach((mock: Mock) => {
                const identifier = mock.name.replace(/\s/g, '_');
                fs.outputJsonSync(path.join(process.cwd(), 'generated', `${identifier}.mock.json`), mock, {spaces: 4});
            });
    }

    /**
     * Gets the mocks for the given endpoint.
     * @param endpoint The endpoint.
     * @param methods The methods.
     * @return mocks The mocks.
     */
    private async getMocksForEndpoint(endpoint: string, methods: any): Promise<Mock[]> {
        return await Promise.all(Object.keys(methods)
            .map(async (method: string) => {
                const data = methods[method];
                const identifier = `${data.tags[0]}-${data.summary}`;
                const headers: { [key: string]: string } = {};
                if (data.consumes) {
                    headers['Content-Type'] = data.consumes[0];
                }

                log(`${chalk.green(`>> Generating mocks for endpoint ${identifier}`)}`);

                return {
                    name: identifier,
                    request: {
                        method: method.toUpperCase(),
                        url: this.getUrl(endpoint),
                        headers: headers
                    },
                    responses: await this.getResponses(data.responses)
                } as Mock;
            }));
    }

    /**
     * Gets the responses.
     * @param responses The responses.
     */
    private async getResponses(responses: any): Promise<any>{
        return responses
            ? (await Promise.all(Object.keys(responses)
                .map(async (key: string) => {
                    const schema = responses[key].schema;
                    const description = responses[key].description;

                    let data;
                    if (schema) {
                        const originalSchema = JSON.parse(JSON.stringify(schema));
                        if (schema.properties) {
                            const identifier = this.getSchemaIdentiier(schema);
                            log(`${chalk.yellow(`>> Overriding schema for Reference ${identifier}`)}`);
                            this.resolverService.getResolversForIdentifier(identifier)
                                .forEach((resolver: Resolver) => resolver.mappers
                                    .forEach((mapper: Mapper) => {
                                        log(`${chalk.yellow(`>> Property: ${mapper.property}`)}`);
                                        this.schemaService.updateSchema(schema.properties, mapper.property, mapper.value);
                                    }));
                        }
                        data = await this.schemaService.generateMockData(schema);

                        const validatorResult = this.validator.validate(data, originalSchema);
                        if(validatorResult.errors.length > 0) {
                            log(`${chalk.yellow('>> data does not match the schema')}`);
                            log(validatorResult.errors);
                        }

                    }

                    return {
                        data: data,
                        status: Number.parseInt(key),
                        description: description
                    } as MockResponse;
                })))
                .reduce((prev: any, cur: MockResponse) => {
                    prev[cur.description] = {
                        status: cur.status,
                        data: cur.data
                    } as any;
                    return prev;
                }, {})
            : {};
    }

    /**
     * Gets the schema identifier.
     * We can either use the schema title or the schema xml name.
     * @param schema The schema.
     * @return identifier The identifier.
     */
    private getSchemaIdentiier(schema: any): string {
        return schema.title
            ? schema.title
            : schema.xml && schema.xml.name
                ? schema.xml.name
                : null;
    }

    private getUrl(endpoint: string): string {
        return endpoint.split('/')
            .map((part) =>
                part.startsWith('{') && part.endsWith('}')
                    ? `(?<${part.substring(1, part.length - 1)}>.*)`
                    : part
            )
            .join('/');
    }
}


