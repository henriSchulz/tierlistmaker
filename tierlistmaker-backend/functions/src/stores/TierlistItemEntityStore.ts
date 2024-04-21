import {EntityStore} from "./abstract/EntityStore";
import TierlistItem from "../types/dbmodel/TierlistItem";
import {OmittedStoreSchema} from "../types/StoreSchema";
import {MAX_TIER_LISTS} from "./TierlistEntityStore";
import {firestore} from "firebase-admin";
import Firestore = firestore.Firestore;


const MAX_ITEMS_PER_TIERLIST = 50;

export default class TierlistItemEntityStore extends EntityStore<TierlistItem> {


    constructor(database: Firestore, callback?: () => void) {

        const storeSchema: OmittedStoreSchema<TierlistItem> = {
            tierlistId: {type: "string", limit: 200, reference: "tierlists"},
            name: {type: "string", limit: 30},
        }

        super("tierlistItems", storeSchema, database, MAX_ITEMS_PER_TIERLIST * MAX_TIER_LISTS);
    }

}