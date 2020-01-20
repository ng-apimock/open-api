import 'reflect-metadata';
import {Container} from 'inversify';
import {Schema, Validator} from 'jsonschema';
import * as fs from 'fs-extra';
import * as path from 'path';
import {OpenApiProcessor} from './processor/open-api.processor';

const swaggerSchema = require('swagger-schema-official/schema');
require.resolve('json-schema');

// IOC configuration
const container = new Container();

const validator = new Validator();
const jsonSchemaDraft04 = fs.readJsonSync(path.join(require.resolve('json-schema'), '..', '..', 'draft-04', 'schema'));
validator.addSchema(jsonSchemaDraft04);

container.bind<Validator>('Validator').toConstantValue(validator);
container.bind<Schema>('SwaggerSchema').toConstantValue(swaggerSchema);

container.bind<OpenApiProcessor>('OpenApiProcessor').to(OpenApiProcessor);

export default container;
