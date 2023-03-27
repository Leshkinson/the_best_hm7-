import {body} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {userService} from "../services/user-service";
import bcrypt from "bcrypt";
import {HTTP_STATUSES} from "../http_statuses";
import {blogService} from "../services/blog-service";
import {userRepository} from "../repositories/user-repositpry";

const emailPattern = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$');
export const checkIsValidUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.getUserByLoginOrEmail(req.body.loginOrEmail)
    if (!user) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }
    const hash = await bcrypt.hash(req.body.password, user.salt)
    if (hash !== user.hash) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401)
        return
    }
    req.content = {
        ...req.content,
        user
    }
    next()
}

export const checkIsRegistrationUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.getUserByLoginOrEmail(req.body.login, req.body.email)
    if(user){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }
    next()
}

const loginOrEmailValidation = body('loginOrEmail')
    .isString().withMessage('Invalid type')
    .trim()
    .isLength({min: 1, max: 25}).withMessage('Not correct length')
    .notEmpty().withMessage('Field must not be empty')

const loginValidation = body('login')
    .isString().withMessage('Invalid type')
    .trim()
    .isLength({min: 1, max: 25}).withMessage('Not correct length')
    .notEmpty().withMessage('Field must not be empty')
    .custom(async value => {
        const isUserExists = await userRepository.getUserByLoginOrEmail({ "accountData.userName": value})
        if(!isUserExists) {
            throw new Error();
        }
        return false
    }).withMessage('Login exists!')

const passwordValidation = body('password')
    .isString().withMessage('Invalid type')
    .trim()
    .isLength({min: 1, max: 25}).withMessage('Not correct length')
    .notEmpty().withMessage('Field must not be empty')

const codedValidation = body('code')
    .isString().withMessage('Invalid type')
    .trim()
    .notEmpty().withMessage('Field must not be empty')

const emailValidation = body('email')
    .isString().withMessage('Invalid type')
    .trim()
    .custom(value => emailPattern.test(value)).withMessage('Is not email!')
    .notEmpty().withMessage('Field must not be empty')
    .custom(async value => {
        const isUserExists = await userRepository.getUserByLoginOrEmail({ "accountData.email": value})
        if(!isUserExists) {
            throw new Error();
        }
        return false
    }).withMessage('Email exists!')

export const authValidation = [loginOrEmailValidation, passwordValidation]
export const checkCodeValidation = [codedValidation]
export const regEmailResendValidation = [emailValidation]

export const registrationValidate = [loginValidation, passwordValidation, emailValidation]