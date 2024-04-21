import {EntityStore} from "./abstract/EntityStore";
import Tierlist from "../types/dbmodel/Tierlist";
import {OmittedStoreSchema} from "../types/StoreSchema";
import {firestore} from "firebase-admin";
import Firestore = firestore.Firestore;

export const MAX_TIER_LISTS = 50;

export class TierlistEntityStore extends EntityStore<Tierlist> {

    constructor(database: Firestore) {
        const storeSchema: OmittedStoreSchema<Tierlist> = {
            createdAt: {type: "number", limit: 10e20},
            name: {type: "string", limit: 200},
            description: {type: "string", limit: 500},
            categoryId: {type: "string", limit: 200},
            public: {type: "boolean", limit: 1},
            lastModifiedAt: {type: "number", limit: 10e20},
        }
        super("tierlists", storeSchema, database, MAX_TIER_LISTS);
    }

}