import BaseModel from "./BaseModel";

export default interface Tierlist extends BaseModel {
     createdAt: number
     lastModifiedAt: number
     name: string
     description: string
     categoryId: string
     public: boolean


}