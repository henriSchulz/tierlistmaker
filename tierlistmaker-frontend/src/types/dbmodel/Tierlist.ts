import BaseModel from "./BaseModel";

export default interface Tierlist extends BaseModel {
    readonly createdAt: number
    lastModifiedAt: number
    readonly name: string
    readonly description: string
    readonly categoryId: string
    readonly public: number //Boolean 0 or 1
    readonly votes: number

}