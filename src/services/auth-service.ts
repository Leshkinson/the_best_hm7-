import {UserFromDBType, UserRequestType, UserResponseFromDBType, UserResponseType} from "../types/types";
import {createId} from "../utils/createId";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {emailManager} from "../application/emailManager";
import {userRepository} from "../repositories/user-repositpry";


export const authService = {

    async registration(userData: UserRequestType) {
        const id = createId()
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(userData.password, salt)
        const generatedCode = uuidv4()
        const newUser: UserFromDBType = {
            id,
            accountData: {
                userName: userData.login,
                email: userData.email,
                hash,
                salt,
                createdAt: new Date().toISOString(),
            },
            emailConformation: {
                confirmationCode: generatedCode,
                expirationDate: add(new Date(), {
                    minutes: 3
                }),
                isConfirmed: false
            }
        }
        const href = `https://somesite.com/confirm-email?code=${generatedCode}`

        const text = "<h1>Thank for your registration</h1>\n" +
            `${generatedCode}`
            +
            "       <p>My code(generatedCode) To finish registration please follow the link below:\n" +
            "          <a href={href}>complete registration</a>\n" +
            "      </p>"

        await emailManager.sendEmailConfirmationMessage(userData.email, "DmitriCorpareted", text)
        await userRepository.createUser(newUser)
    },


    async registrationConfirmation(code: string) {
        const filter: any = {
            "emailConformation.confirmationCode": code
        }
        const user = await userRepository.getUserByConfirmationCode(filter)
        if (user) {
            const update = {
                $set: {"emailConformation.isConfirmed": true}
            }
            await userRepository.changeUser({id: user.id}, update)
            return user

        }
        return null
    },

    async regEmailResend(email: string) {
        const filter: any = {'accountData.email': email}
        const user = await userRepository.getUserByLoginOrEmail(filter)
        if (user) {
            const generatedCode = uuidv4()
            const text = "<h1>Thank for your registration</h1>\n" +
                `${generatedCode}`
                +
                "       <p>My code(generatedCode) To finish registration please follow the link below:\n" +
                "          <a href={href}>complete registration</a>\n" +
                "      </p>"
            const update = {
                $set: {'emailConformation.confirmationCode': generatedCode}
            }
            await userRepository.changeUser({id: user.id}, update)
            await emailManager.sendEmailConfirmationMessage(email, "DmitriCorpareted", text)
            return true
        }
        return false
    },
}