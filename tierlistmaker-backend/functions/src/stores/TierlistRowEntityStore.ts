import TierlistRow from "../types/dbmodel/TierlistRow";
import {EntityStore} from "./abstract/EntityStore";
import {OmittedStoreSchema} from "../types/StoreSchema";
import {MAX_TIER_LISTS} from "./TierlistEntityStore";
import {firestore} from "firebase-admin";
import Firestore = firestore.Firestore;


const MAX_ROWS_PER_TIERLIST = 8;

export default class TierlistRowEntityStore extends EntityStore<TierlistRow> {

    constructor(database: Firestore) {
        const storeSchema: OmittedStoreSchema<TierlistRow> = {
            tierlistId: {type: "string", limit: 200, reference: "tierlists"},
            name: {type: "string", limit: 200},
            rowNumber: {type: "number", limit: MAX_ROWS_PER_TIERLIST},
        }
        super("tierlistRows", storeSchema, database, MAX_ROWS_PER_TIERLIST * MAX_TIER_LISTS);
    }

}