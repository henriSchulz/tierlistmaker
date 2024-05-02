import BaseModel from "./BaseModel";


// the clientId is the client who voted for the tierlist
export default interface Vote extends BaseModel {
    tierlistId: string

}