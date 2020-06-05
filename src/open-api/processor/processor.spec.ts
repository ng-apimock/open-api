import 'reflect-metadata';

import * as fs from 'fs-extra';
import * as path from 'path';
import {assert, match, SinonStub, stub} from 'sinon';

import container from '../ioc-container';
import {MixinService} from '../mixins/mixin.service';
import {ResolverService} from '../resolvers/resolver.service';
import {SchemaService} from '../schema/schema.service';

import {Processor} from './processor';

describe('Processor', () => {
    let fsOutputJsonSyncFn: SinonStub;
    let mixinService: MixinService;
    let processor: Processor;
    let resolverService: ResolverService;
    let schemaService: SchemaService;

    beforeEach(() => {
        mixinService = container.get('MixinService');
        mixinService.register(path.join('test', 'mixins'));

        resolverService = container.get('ResolverService');
        resolverService.initialize(path.join('test', 'resolvers'));

        schemaService = container.get('SchemaService');

        processor = container.get('Processor');
    });

    describe('process', () => {
        beforeEach(() => {
            fsOutputJsonSyncFn = stub(fs, 'outputJsonSync');
        });

        afterEach(() => {
            fsOutputJsonSyncFn.restore();
        });

        it('generate mocks for each endpoint', async () => {
            stub(schemaService, 'getSchema').resolves(fs.readJSONSync(path.join(process.cwd(), 'test', 'schema', 'pet-store.swagger.json')));

            await processor.process('http://some.url');

            assert.calledWith(fsOutputJsonSyncFn.firstCall,
                match((outputFile: string) => outputFile.endsWith('generated/pet-Find_pet_by_ID.mock.json')),
                match((mock: any) => {
                    expect(mock.name).toEqual('pet-Find pet by ID');
                    expect(mock.request).toEqual({
                        headers: {},
                        method: 'GET',
                        url: '/pet/(?<petId>.*)'
                    });
                    expect(mock.responses).toEqual({
                        'Invalid ID supplied': {data: undefined, status: 400},
                        'Pet not found': {data: undefined, status: 404},
                        'successful operation': {
                            data: {
                                name: 'my-name',
                                photoUrls: ['awesome.png', 'awesome.jpg'],
                                status: 'available'
                            }, status: 200
                        }
                    });

                    return true;
                }),
                {spaces: 4});
            assert.calledWith(fsOutputJsonSyncFn.secondCall,
                match((outputFile: string) => outputFile.endsWith('generated/pet-Updates_a_pet_in_the_store_with_form_data.mock.json')),
                match((mock: any) => {
                    expect(mock.name).toEqual('pet-Updates a pet in the store with form data');
                    expect(mock.request).toEqual({
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        method: 'POST', url: '/pet/(?<petId>.*)'
                    });
                    expect(mock.responses).toEqual({
                        'Invalid input': {
                            status: 405
                        }
                    });

                    return true;
                }),
                {spaces: 4});
        });
    });
});
