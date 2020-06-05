import * as glob from 'glob';
import {inject, injectable} from 'inversify';
import * as path from 'path';

import {Mixin} from './mixin';

@injectable()
export class MixinService {
    constructor(@inject('Chance') private chance: any) {
    }

    /**
     * Register the mixins that are available in the given mixin directory.
     * @param mixinDirectory The directory to contain mixins.
     */
    public register(mixinDirectory: string): void {
        glob.sync('**/*.mixin.js', {cwd: mixinDirectory, root: '/'})
            .forEach((fileName: string) => {
                const mixinFile = path.join(process.cwd(),mixinDirectory, fileName);
                const mixinObj: Mixin = require(mixinFile);
                const result: any = {};
                result[mixinObj.name]=mixinObj.fn;
                this.chance.mixin(result);
            });
    }

}
