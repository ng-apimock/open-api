import 'reflect-metadata';

import {Container} from 'inversify';

import {SchemaService} from './schema.service';

describe('SchemaService', () => {
    let schemaService: SchemaService;

    beforeEach(() => {
        const container = new Container();

        const faker = require('json-schema-faker');
        const Change = require('chance');
        faker.extend('chance', () => new Change());

        container.bind('Faker').toConstantValue(faker);
        container.bind('SchemaService').to(SchemaService);

        schemaService = container.get('SchemaService');
    });

    describe('generateMockData', () => {
        it('generates mock data using chance', async () => {
            const schema = {
                some: {
                    deep: {
                        nested: {
                            description: 'some deep nested description',
                            property: {
                                chance: {
                                    url: {
                                        protocol: 'https',
                                        domain: 'some.tld',
                                        extensions: ['png']
                                    }
                                }
                            }
                        }
                    }
                }
            };

            const result = await schemaService.generateMockData(schema);

            expect(result.some.deep.nested.property).toMatch(new RegExp('https://some.tld/.*\.png'));
        });
    });

    describe('getSchema', () => {
        it('gets the schema without references', async () => {
            const schema = await schemaService.getSchema('https://petstore.swagger.io/v2/swagger.json');
            // should not have references
            expect(JSON.stringify(schema).indexOf('$ref')).toEqual(-1);
        });
    });

    describe('updateSchema', () => {
        let schema: any;

        beforeEach(() => {
            schema = {
                some: {
                    deep: {
                        nested: {
                            description: 'some deep nested description',
                            property: {
                                description: 'some deep nested property description'
                            }
                        }
                    }
                }
            };
        });

        it('updates the schema by updating the property value', () => {
            schemaService.updateSchema(schema, 'some.deep.nested.property', {description: 'updated'});

            expect(schema).toEqual({
                some: {
                    deep: {
                        nested: {
                            description: 'some deep nested description',
                            property: {
                                description: 'updated'
                            }
                        }
                    }
                }
            });
        });

        it('updates the schema by adding the not yet existing property', () => {
            schemaService.updateSchema(schema, 'some.deep.nested.new-property', {description: 'added'});

            expect(schema).toEqual({
                some: {
                    deep: {
                        nested: {
                            description: 'some deep nested description',
                            'new-property': {
                                description: 'added',
                            },
                            property: {
                                description: 'some deep nested property description'
                            }
                        }
                    }
                }
            });
        });

        it('does not update the schema when there is no property provided', () => {
            schemaService.updateSchema(schema, [], {description: 'added'});

            expect(schema).toEqual({
                some: {
                    deep: {
                        nested: {
                            description: 'some deep nested description',
                            property: {
                                description: 'some deep nested property description'
                            }
                        }
                    }
                }
            });
        });
    });
});
