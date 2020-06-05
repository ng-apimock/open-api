import container from './ioc-container';
import {MixinService} from './mixins/mixin.service';
import {Processor} from './processor/processor';
import {ResolverService} from './resolvers/resolver.service';

(async () => {
    const minimist = require('minimist');
    const args: { [key: string]: any } = minimist(process.argv.slice(2), {boolean: true});

    const resolverDirectory = args.resolverDirectory ? args.resolverDirectory : '.';
    const mixinDirectory = args.mixinDirectory ? args.mixinDirectory : '.';

    if (args.url === undefined) {
        console.error('Please specify a open-api url');
        process.exit(1);
    }
    const processor = container.get<Processor>('Processor');
    const resolverService = container.get<ResolverService>('ResolverService');
    const mixinService = container.get<MixinService>('MixinService');

    resolverService.initialize(resolverDirectory);
    mixinService.register(mixinDirectory);

    await processor.process(args.url);
})();
