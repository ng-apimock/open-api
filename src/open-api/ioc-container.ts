import 'reflect-metadata';

import * as fs from 'fs-extra';
import {Container} from 'inversify';
import {Validator} from 'jsonschema';
import * as path from 'path';

import {MixinService} from './mixins/mixin.service';
import {Processor} from './processor/processor';
import {ResolverService} from './resolvers/resolver.service';
import {SchemaService} from './schema/schema.service';

// IOC configuration
const container = new Container();

const validator = new Validator();
const jsonSchemaDraft04 = fs.readJsonSync(path.join(require.resolve('json-schema'), '..', '..', 'draft-04', 'schema'));
validator.addSchema(jsonSchemaDraft04);

container.bind<Validator>('Validator').toConstantValue(validator);
container.bind<SchemaService>('SchemaService').to(SchemaService).inSingletonScope();
container.bind<MixinService>('MixinService').to(MixinService).inSingletonScope();
container.bind<ResolverService>('ResolverService').to(ResolverService).inSingletonScope();
container.bind<Processor>('Processor').to(Processor);

const faker = require('json-schema-faker');
const Chance = require('chance');
const chance = new Chance();

faker.extend('chance', () => chance);

container.bind<any>('Chance').toConstantValue(chance);
container.bind<any>('Faker').toConstantValue(faker);

export default container;
