import BaseModel from "./BaseModel";

export default interface TierlistRow extends BaseModel {
     name: string
     tierlistId: string
     rowNumber: number // 0 is the top row


}