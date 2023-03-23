import {Router} from "express";
import {authController} from "../controllers/auth-controller";
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";
import {
    authValidation,
    checkCodeValidation,
    checkIsValidUser,
    regEmailResendValidation
} from "../validators/auth-validation";
import {authMiddleware} from "../middleware/authMiddleware";

export const authRouter = Router({})

//-------------------GET---------------//
authRouter.get('/me', authMiddleware, authController.getMe)
//-------------------POST---------------//
authRouter.post('/login', authValidation, checkIsValidUser, inputValidationMiddleware, authController.authorization)
authRouter.post('/registration', authController.registration)
authRouter.post('/registration-confirmation', checkCodeValidation, authController.registrationConfirmation)
authRouter.post('/registration-email-resending', regEmailResendValidation, authController.regEmailResend)