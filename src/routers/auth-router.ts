import {Router} from "express";
import {authController} from "../controllers/auth-controller";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";
import {
    authValidation,
    checkCodeValidation, checkIsRegistrationUser,
    checkIsValidUser,
    regEmailResendValidation, registrationValidate
} from "../validators/auth-validation";
import {authMiddleware} from "../middleware/authMiddleware";

export const authRouter = Router({})

//-------------------GET---------------//
authRouter.get('/me', authMiddleware, authController.getMe)
//-------------------POST---------------//
authRouter.post('/login', authValidation, checkIsValidUser, inputValidationMiddleware, authController.authorization)
authRouter.post('/registration', registrationValidate, checkIsRegistrationUser, inputValidationMiddleware, authController.registration)
authRouter.post('/registration-confirmation', checkCodeValidation, inputValidationMiddleware, authController.registrationConfirmation)
authRouter.post('/registration-email-resending', regEmailResendValidation, inputValidationMiddleware, authController.regEmailResend)

// для registration-email-resending, дописать провекру, что если у пользователя подтвержденый статус не отправлять письмо повторно
// registration-confirmation - тоже проверять статус
// login проверять при авторизации статус, если не авторизован, отправлять писбмо

