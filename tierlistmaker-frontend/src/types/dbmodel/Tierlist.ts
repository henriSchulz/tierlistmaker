import BaseModel from "./BaseModel";

export default interface Tierlist extends BaseModel {
    readonly createdAt: number
    lastModifiedAt: number
    readonly name: string
    readonly description: string
    readonly categoryId: string
    readonly public: boolean
    readonly votes: number
    showImageNames: boolean

}