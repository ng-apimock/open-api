export interface Resolver {
    identifier: string;
    mappers: Mapper[];
}

export interface Mapper {
    property: string;
    value: any;
}
