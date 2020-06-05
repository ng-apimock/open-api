import * as fs from 'fs-extra';
import * as glob from 'glob';
import {injectable} from 'inversify';
import * as path from 'path';

import {Resolver} from './resolver';

@injectable()
export class ResolverService {
    private resolvers: Resolver[];

    /**
     * Initializes the resolver service by fetching all the resolvers.
     * @param resolverDirectory The directory to contain resolvers.
     */
    public initialize(resolverDirectory: string): void {
        this.resolvers = glob.sync('**/*.resolver.json', {cwd: resolverDirectory, root: '/'})
            .map((resolver: string) => fs.readJsonSync(path.join(resolverDirectory, resolver)));
    }

    /**
     * Gets the resolvers matching the identifier.
     * @param identifier The identifier.
     * @return resolvers The matching resolvers.
     */
    public getResolversForIdentifier(identifier: string): Resolver[] {
        return this.resolvers.filter((resolver: Resolver) => resolver.identifier === identifier);
    }
}
