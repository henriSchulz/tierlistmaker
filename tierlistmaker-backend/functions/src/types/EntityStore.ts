import BaseModel from "./dbmodel/BaseModel";
import EntityStoreError from "../error/EntityStoreError";


export interface DefaultEntityStoreOptions {
    clientId?: string
}

export interface ClientRequiredEntityStoreOptions {
    clientId: string

}


export interface EntityStore<T extends BaseModel> {
    id: string

    getAll(options?: DefaultEntityStoreOptions): Promise<[T[], EntityStoreError | null]>

    getAllBy(where: keyof T, value: string | number | boolean, options?: DefaultEntityStoreOptions): Promise<[T[], EntityStoreError | null]>

    get(id: string, options?: DefaultEntityStoreOptions): Promise<[T | null, EntityStoreError | null]>

    add(entity: T, options?: DefaultEntityStoreOptions): Promise<EntityStoreError | null>

    addAll(entities: T[], options?: DefaultEntityStoreOptions): Promise<EntityStoreError | null>

    update(entity: T, options?: DefaultEntityStoreOptions): Promise<EntityStoreError | null>

    delete(id: string, options?: DefaultEntityStoreOptions): Promise<EntityStoreError | null>

    deleteBy(where: keyof T, value: string | number | boolean, options?: DefaultEntityStoreOptions): Promise<EntityStoreError | null>

    getBy(where: keyof T, value: string | number | boolean, options?: DefaultEntityStoreOptions): Promise<[T | null, EntityStoreError | null]>

    getSize(options: DefaultEntityStoreOptions): Promise<[number, EntityStoreError | null]>

    create(values: Omit<T, "clientId" | "id">, options: ClientRequiredEntityStoreOptions): Promise<[T | null, EntityStoreError | null]>

    has(id: string, options?: DefaultEntityStoreOptions): Promise<boolean>

    countBy(where: keyof T, value: string | number | boolean, options?: DefaultEntityStoreOptions): Promise<[number, EntityStoreError | null]>


}