import container from './ioc-container';
import {OpenApiProcessor} from './processor/open-api.processor';

const processor = container.get<OpenApiProcessor>('OpenApiProcessor');

(async()=> {
    await processor.process('http://petstore.swagger.io/v2/swagger.json');
})();
