import {inject, injectable} from 'inversify';
import fetch, {Request} from 'node-fetch';

const schemaDeref = require('json-schema-deref-sync');

@injectable()
export class SchemaService {

    constructor(@inject('Faker') private faker: any) {
    }

    /**
     * Generates mock data for the provided schema.
     * @param schema The schema.
     * @return mockData the mock data.
     */
    async generateMockData(schema: any): Promise<any> {
        return await this.faker.resolve(schema);
    }

    /**
     * Gets the schema and returns it without references.
     * @param url The url.
     * @return schema The schema without references.
     */
    async getSchema(url: string): Promise<any> {
        const json = await this.fetchResponse(new Request(url, {method: 'GET'}))
            .then(res => res.json());
        // get the schema without references
        return schemaDeref(json);
    }

    /**
     * Updates the schema property with the given value.
     * @param schema The schema.
     * @param property The property.
     * @param value The value.
     */
    updateSchema(schema: any, property: string | string[], value: any): void {
        if (typeof property == 'string') {
            return this.updateSchema(schema, property.split('.'), value);
        } else if (property.length === 1 && value !== undefined) {
            return schema[property[0]] = value;
        } else if (property.length === 0) {
            return schema;
        } else {
            return this.updateSchema(schema[property[0]], property.slice(1), value);
        }
    }

    /**
     * Fetch the request.
     * @param {Request} request The request.
     * @return {Promise<any>} promise The promise.
     */
    fetchResponse(request: Request): Promise<any> {
        return fetch(request);
    }
}
