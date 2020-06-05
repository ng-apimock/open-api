import 'reflect-metadata';

import * as fs from 'fs-extra';
import * as glob from 'glob';
import {Container} from 'inversify';
import * as path from 'path';
import {assert, SinonStub, stub} from 'sinon';

import {ResolverService} from './resolver.service';

describe('SchemaService', () => {
    let resolverService: ResolverService;

    beforeEach(() => {
        const container = new Container();

        container.bind('ResolverService').to(ResolverService);

        resolverService = container.get('ResolverService');
    });

    describe('initialize', () => {
        let fsReadJsonSyncFn: SinonStub;
        let globSyncFn: SinonStub;

        beforeEach(() => {
            fsReadJsonSyncFn = stub(fs, 'readJsonSync');
            globSyncFn = stub(glob, 'sync');
        });

        afterEach(() => {
            fsReadJsonSyncFn.restore();
            globSyncFn.restore();
        });

        it('gets all the resolvers', async () => {
            fsReadJsonSyncFn.onCall(0).returns({
                identifier: 'some',
                mappers: []
            });
            fsReadJsonSyncFn.onCall(1).returns({
                identifier: 'another',
                mappers: []
            });

            globSyncFn.returns([
                'some-directory/some.resolver.json',
                'another-directory/another.resolver.json']);

            resolverService.initialize('my-reporting-directory');

            assert.calledWith(globSyncFn,
                '**/*.resolver.json', {
                    cwd: 'my-reporting-directory',
                    root: '/'
                }
            );
            assert.calledWith(fsReadJsonSyncFn, path.join('my-reporting-directory', 'some-directory/some.resolver.json'));
            assert.calledWith(fsReadJsonSyncFn, path.join('my-reporting-directory', 'another-directory/another.resolver.json'));

            expect(resolverService['resolvers']).toEqual([
                {identifier: 'some', mappers: []},
                {identifier: 'another', mappers: []}
            ]);
        });
    });

    describe('getResolversForIdentifier', () => {
        it('gets the resolver matching the identifier', async () => {
            resolverService['resolvers'] = [
                {identifier: 'some', mappers: []},
                {identifier: 'some', mappers: []},
                {identifier: 'another', mappers: []}
            ];
            const resolvers = resolverService.getResolversForIdentifier('some');
            expect(resolvers).toEqual([
                {identifier: 'some', mappers: []},
                {identifier: 'some', mappers: []}
            ]);
        });
    });
});
