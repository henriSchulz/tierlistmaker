import BaseModel from "./BaseModel";

export default interface TierlistItem extends BaseModel {
    tierlistId: string
    name: string
}