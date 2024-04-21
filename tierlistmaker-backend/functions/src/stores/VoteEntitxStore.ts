import {OmittedStoreSchema} from "../types/StoreSchema";
import Vote from "../types/dbmodel/Vote";
import {EntityStore} from "./abstract/EntityStore";
import EntityStoreError from "../error/EntityStoreError";
import {firestore} from "firebase-admin";
import Firestore = firestore.Firestore;


export default class VoteEntityStore extends EntityStore<Vote> {
    constructor(database: Firestore) {
        const storeSchema: OmittedStoreSchema<Vote> = {
            tierlistId: {type: "string", limit: 200, reference: "tierlists"},

        }

        super("votes", storeSchema, database, 1000);
    }




    public async isTierlistVoted(clientId: string, tierlistId: string): Promise<[voted: boolean, error: EntityStoreError | null]> {

        const [vote, error] = await this.getBy("tierlistId", tierlistId, {clientId})

        if (error) {
            return [false, new EntityStoreError(error.message, true)]
        }

        return [!!vote, null]
    }

}