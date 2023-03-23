import {body} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {userService} from "../services/user-service";
import bcrypt from "bcrypt";
import {HTTP_STATUSES} from "../http_statuses";
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
const loginOrEmailValidation = body('loginOrEmail')
    .isString().withMessage('Invalid type')
    .trim()
    .isLength({min: 1, max: 25}).withMessage('Not correct length')
    .notEmpty().withMessage('Field must not be empty')

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

export const authValidation = [loginOrEmailValidation, passwordValidation]
export const checkCodeValidation = [codedValidation]
export const regEmailResendValidation = [emailValidation]