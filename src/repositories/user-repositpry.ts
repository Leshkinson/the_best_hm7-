import {userCollections} from "../../mongoDB";
import {UserResponseFromDBType} from "../types/types";


export const userRepository = {

    async getAllUsers(filter: any, sort: any, skip: any, limit: any): Promise<UserResponseFromDBType[]> {
        return await userCollections.find(filter).sort(sort).skip(skip).limit(limit).toArray()
    },

    async getUserById(filter: { id: string }): Promise<UserResponseFromDBType | null> {
        return await userCollections.findOne(filter)
    },

    async getUserByLoginOrEmail(filter: any): Promise<UserResponseFromDBType | null> {
        return await userCollections.findOne(filter)
    },

    async getTotalCount(filter: any): Promise<number> {
        return await userCollections.countDocuments(filter)
    },

    async createUser(newUser: any): Promise<void> {
        await userCollections.insertOne(newUser)
    },

    async deleteUser(filter: any): Promise<boolean> {
        const result = await userCollections.deleteOne(filter)
        return result.deletedCount === 1
    },

    async deleteAllUser(): Promise<void> {
        await userCollections.deleteMany({})
    }
}