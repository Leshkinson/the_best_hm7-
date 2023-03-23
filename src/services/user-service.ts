import {
    QueryForUsersType,
    ResponseTypeWithPages,
    UserRequestType,
    UserResponseFromDBType,
    UserResponseType
} from "../types/types";
import {getSortSkipLimit} from "../utils/getSortSkipLimit";
import {userRepository} from "../repositories/user-repositpry";
import {createId} from "../utils/createId";
import bcrypt from "bcrypt";
import {userModels} from "../models/user-models";
import {Sort} from "mongodb";
import {getFilter} from "../utils/getFilter";


export const userService = {

    async getAllUsers(query: QueryForUsersType): Promise<ResponseTypeWithPages<UserResponseType>> {
        const {pageNumber, pageSize, login, email} = query
        const [sort, skip, limit] = await getSortSkipLimit(query)
        const filter: any = getFilter({email, login}, true)
        const totalCount = await userRepository.getTotalCount(filter)
        const users = await userRepository.getAllUsers(filter, sort as Sort, +skip, +limit)
        return {
            pagesCount: Math.ceil(totalCount / +pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: userModels(users) as UserResponseType[]
        }
    },

    async getUserById(id: string): Promise<UserResponseFromDBType | null> {
        const filter = {id}
        return await userRepository.getUserById(filter)
    },

    async getUserByLoginOrEmail(loginOrEmail: string): Promise<UserResponseFromDBType | null> {
        const filter: any = getFilter({login: loginOrEmail, email: loginOrEmail})
        return await userRepository.getUserByLoginOrEmail(filter)
    },

    async createUser(user: UserRequestType): Promise<UserResponseType> {
        const id = createId()
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(user.password, salt)
        const newUser: UserResponseType = {
            id,
            login: user.login,
            email: user.email,
            createdAt: new Date().toISOString(),
        }
        await userRepository.createUser({...newUser, hash, salt} as UserResponseFromDBType)
        return newUser
    },

    async deleteUser(id: string): Promise<boolean> {
        const filter = {id}
        return await userRepository.deleteUser(filter)
    }
}