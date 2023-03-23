import {UserResponseFromDBType, UserResponseType} from "../types/types";

export const userModels = (users: UserResponseFromDBType[] | UserResponseFromDBType): UserResponseType | UserResponseType[] => {
    const userConverter = (user: UserResponseFromDBType) => {
        return {
            id: user.id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    }

    if (Array.isArray(users)) {
        return users.map((u: UserResponseFromDBType) => userConverter(u))
    }

    return userConverter(users)
}