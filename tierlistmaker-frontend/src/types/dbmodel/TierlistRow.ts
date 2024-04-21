import BaseModel from "./BaseModel";

export default interface TierlistRow extends BaseModel {
    readonly name: string
    readonly tierlistId: string
    readonly rowNumber: number // 0 is the top row


}