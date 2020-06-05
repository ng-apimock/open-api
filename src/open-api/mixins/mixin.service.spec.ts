import 'reflect-metadata';

import * as glob from 'glob';
import {Container} from 'inversify';
import {assert, SinonStub, stub} from 'sinon';

import {MixinService} from './mixin.service';

describe('MixinService', () => {
    let chance: any;
    let mixinService: MixinService;

    beforeEach(() => {
        const container = new Container();

        chance = {
            mixin: jest.fn()
        };

        container.bind('Chance').toConstantValue(chance);
        container.bind('MixinService').to(MixinService);

        mixinService = container.get('MixinService');
    });

    describe('register', () => {
        let globSyncFn: SinonStub;

        beforeEach(() => {
            globSyncFn = stub(glob, 'sync');
        });

        afterEach(() => {
            globSyncFn.restore();
        });

        it('gets all the resolvers', async () => {
            globSyncFn.returns(['photo-url.mixin.js']);

            mixinService.register('test/mixins');

            assert.calledWith(globSyncFn,
                '**/*.mixin.js', {
                    cwd: 'test/mixins',
                    root: '/'
                }
            );
            expect(chance.mixin).toHaveBeenCalledWith({
                photoUrl: expect.any(Function)
            });
        });
    });
});
