import BaseModel from "../../types/dbmodel/BaseModel";
import {StoreSchemaObject} from "../../types/StoreSchemaObject";
import EntityStoreError from "../../error/EntityStoreError";
import {OmittedStoreSchema, StoreSchema} from "../../types/StoreSchema";
import {generateModelId, ID_PROPERTIES} from "../../utils";
import {
    ClientRequiredEntityStoreOptions,
    DefaultEntityStoreOptions,
    EntityStore as TEntityStore
} from "../../types/EntityStore";
import {firestore} from "firebase-admin";
import Firestore = firestore.Firestore;


export abstract class EntityStore<T extends BaseModel> implements TEntityStore<T> {

    public readonly id: string

    protected readonly storeSchema: StoreSchema<T>

    protected readonly maxClientSize: number

    protected db: Firestore

    protected constructor(id: string, storeSchema: OmittedStoreSchema<T>, db: Firestore, maxClientSize: number) {
        this.id = id
        this.storeSchema = {
            id: {type: "string", limit: ID_PROPERTIES.length},
            clientId: {type: "string", limit: ID_PROPERTIES.length},
            ...storeSchema
        } as Record<keyof T, StoreSchemaObject>

        this.maxClientSize = maxClientSize
        this.db = db
    }


    private isValidEntity(entity: T): { valid: boolean, reason: string | null } {
        for (const [key, value] of Object.entries(this.storeSchema)) {
            const entityValue = entity[key as keyof T]

            if (key === "clientId") continue

            if (entityValue === undefined || entityValue === null) {
                if (value.nullable) continue
                return {valid: false, reason: `Value for ${key} is undefined`}
            }

            if (typeof entityValue !== value.type) {
                return {
                    valid: false,
                    reason: `Value for ${key} is type of ${typeof entityValue} but should be type of ${value.type}`
                }
            }

            if (typeof entityValue === "string") {
                if (entityValue.length > value.limit) {
                    return {valid: false, reason: `Value for ${key} is too long. Max length is ${value.limit}`}
                }
            }

            if (typeof entityValue === "number") {
                if (entityValue < 0) {
                    return {valid: false, reason: `Value for ${key} is negative`}
                }

                if (entityValue > value.limit) {
                    return {valid: false, reason: `Value for ${key} is too large. Max value is ${value.limit}`}
                }
            }

        }


        return {valid: true, reason: null}
    }


    async addAll(entities: T[], options?: DefaultEntityStoreOptions): Promise<EntityStoreError | null> {
        for (const entity of entities) {
            const error = await this.add(entity, options)
            if (error) return error
        }

        return null
    }

    async add(entity: T, options?: DefaultEntityStoreOptions): Promise<EntityStoreError | null> {
        let modifiedEntity: T;
        if (options?.clientId) {
            modifiedEntity = {
                ...entity,
                clientId: options.clientId,
            }
        } else {
            modifiedEntity = {
                ...entity,
            }
        }


        const validEntity = this.isValidEntity(entity)
        if (!validEntity.valid) {
            return Promise.resolve(new EntityStoreError(`Invalid entity in ${this.id}.add(). Reason: ${validEntity.reason}`, false))
        }

        if (options?.clientId) {
            const [currentStoreClientSize, error] = await this.getSize(options)

            if (error) {
                return error
            }

            if (currentStoreClientSize >= this.maxClientSize) {
                return new EntityStoreError(`The maximum number of entities (${this.maxClientSize}) in ${this.id} has been reached (Client: ${options.clientId})`, false)
            }
        }

        try {
            await this.db.collection(this.id).doc(entity.id).set(modifiedEntity)
            return null;
        } catch (e: any) {
            return new EntityStoreError(String(e.message ?? e), true)
        }


    }

    async getAll(options?: DefaultEntityStoreOptions): Promise<[T[], EntityStoreError | null]> {


        if (options?.clientId) {
            try {
                const res = await this.db.collection(this.id).where("clientId", "==", options.clientId).get()
                const entities: T[] = res.docs.map(doc => doc.data() as T)

                return [entities, null]

            } catch (e: any) {
                return [[], new EntityStoreError(String(e.message ?? e), true)]
            }


        } else {
            try {
                const res = await this.db.collection(this.id).get()

                const entities: T[] = res.docs.map(doc => doc.data() as T)

                return [entities, null]
            } catch (e: any) {
                return [[], new EntityStoreError(String(e.message ?? e), true)]
            }
        }

    }

    async getAllBy(where: keyof T, value: number | boolean | string, options?: DefaultEntityStoreOptions): Promise<[T[], EntityStoreError | null]> {


        if (options?.clientId) {
            try {
                const res = await this.db.collection(this.id).where("clientId", "==", options.clientId).where(String(where), "==", value).get()
                const entities: T[] = res.docs.map(doc => doc.data() as T)
                return [entities, null]
            } catch (e: any) {
                return [[], new EntityStoreError(String(e.message ?? e), true)]
            }


        } else {
            try {
                const res = await this.db.collection(this.id).where(String(where), "==", value).get()
                const entities: T[] = res.docs.map(doc => doc.data() as T)
                return [entities, null]
            } catch (e: any) {
                return [[], new EntityStoreError(String(e.message ?? e), true)]
            }
        }

    }

    get(id: string, options?: DefaultEntityStoreOptions): Promise<[T | null, EntityStoreError | null]> {
        return this.getBy("id", id, options)
    }

    async countBy(where: keyof T, value: string | number | boolean, options?: DefaultEntityStoreOptions): Promise<[number, EntityStoreError | null]> {


        if (options?.clientId) {
            try {
                const res = await this.db.collection(this.id).where("clientId", "==", options.clientId).where(String(where), "==", value).get()
                return [res.docs.length, null]
            } catch (e: any) {
                return [0, new EntityStoreError(String(e.message ?? e), true)]
            }
        } else {
            try {
                const res = await this.db.collection(this.id).where(String(where), "==", value).get()
                return [res.docs.length, null]
            } catch (e: any) {
                return [0, new EntityStoreError(String(e.message ?? e), true)]
            }
        }


    }

    async getBy(where: keyof T, id: string | number | boolean, options?: DefaultEntityStoreOptions): Promise<[T | null, EntityStoreError | null]> {

        if (options?.clientId) {

            try {
                const res = await this.db.collection(this.id).where("clientId", "==", options.clientId).where(String(where), "==", id).get()
                const entity = res.docs[0]?.data() as T
                return [entity, null]
            } catch (e: any) {
                return [null, new EntityStoreError(String(e.message ?? e), true)]
            }


        } else {
            try {
                const res = await this.db.collection(this.id).where(String(where), "==", id).get()
                const entity = res.docs[0]?.data() as T
                return [entity, null]
            } catch (e: any) {
                return [null, new EntityStoreError(String(e.message ?? e), true)]
            }
        }

    }


    async getSize(options?: DefaultEntityStoreOptions): Promise<[number, EntityStoreError | null]> {
        const [count, error] = await this.countBy("clientId", options?.clientId as string, options)
        if (error) {
            return [0, error]
        }
        return [count, null]
    }

    async update(entity: T, options?: DefaultEntityStoreOptions): Promise<EntityStoreError | null> {

        let modifiedEntity: T;

        if (options?.clientId) {
            modifiedEntity = {
                ...entity,
                clientId: options.clientId,
            }
        } else {
            modifiedEntity = {
                ...entity,
            }
        }

        const validEntity = this.isValidEntity(entity)
        if (!validEntity.valid) {
            return new EntityStoreError(`Invalid entity in ${this.id}.update(). Reason: ${validEntity.reason}`, false)
        }


        try {
            await this.db.collection(this.id).doc(entity.id).update(modifiedEntity)
            return null
        } catch (e: any) {
            return new EntityStoreError(String(e.message ?? e), true)
        }

    }

    async delete(id: string, options?: DefaultEntityStoreOptions): Promise<EntityStoreError | null> {

        if (options?.clientId) {

            try {
                const res = await this.db.collection(this.id).where("clientId", "==", options.clientId).where("id", "==", id).get()
                const doc = res.docs[0]
                if (!doc) {
                    return new EntityStoreError(`Entity with id ${id} not found in ${this.id}`, false)
                }
                await doc.ref.delete()
                return null
            } catch (e: any) {
                return new EntityStoreError(String(e.message ?? e), true)
            }

        } else {
            try {
                const res = await this.db.collection(this.id).where("id", "==", id).get()
                const doc = res.docs[0]
                if (!doc) {
                    return new EntityStoreError(`Entity with id ${id} not found in ${this.id}`, false)
                }
                await doc.ref.delete()
                return null
            } catch (e: any) {
                return new EntityStoreError(String(e.message ?? e), true)
            }
        }

    }

    async create(values: Omit<T, "clientId" | "id">, options: ClientRequiredEntityStoreOptions): Promise<[T | null, EntityStoreError | null]> {
        const entity = {
            ...values,
            id: generateModelId(),
            clientId: options.clientId
        } as T

        const error = await this.add(entity)

        if (error) {
            return [null, error]
        }

        return [entity, null]
    }

    async deleteBy(where: keyof T, value: string | number | boolean, options?: DefaultEntityStoreOptions): Promise<EntityStoreError | null> {


        if (options?.clientId) {

            try {
                const res = await this.db.collection(this.id).where("clientId", "==", options.clientId).where(String(where), "==", value).get()
                const docs = res.docs
                if (docs.length === 0) {
                    return new EntityStoreError(`Entity with ${String(where)} ${value} not found in ${this.id}`, false)
                }

                for (const doc of docs) {
                    await doc.ref.delete()
                }
                return null
            } catch (e: any) {
                return new EntityStoreError(String(e.message ?? e), true)
            }
        } else {
            try {
                const res = await this.db.collection(this.id).where(String(where), "==", value).get()
                const docs = res.docs
                if (docs.length === 0) {
                    return new EntityStoreError(`Entity with ${String(where)} ${value} not found in ${this.id}`, false)
                }
                for (const doc of docs) {
                    await doc.ref.delete()
                }
                return null
            } catch (e: any) {
                return new EntityStoreError(String(e.message ?? e), true)
            }
        }

    }


    async has(id: string, options?: DefaultEntityStoreOptions): Promise<boolean> {
        const [entity] = await this.get(id, options)
        return !!entity
    }
}