import {UserResponseFromDBType, UserResponseType} from "../types/types";

export const userModels = (users: UserResponseFromDBType[]): UserResponseType | UserResponseType[] => {
    const postConverter = (user: UserResponseFromDBType) => {
        return {
            id: user.id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    }

    if (Array.isArray(users)) {
        return users.map((u: UserResponseFromDBType) => postConverter(u))
    }

    return postConverter(users)
}