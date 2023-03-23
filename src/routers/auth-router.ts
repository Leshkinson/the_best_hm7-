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
authRouter.get('/me', authMiddleware, authController.authorization)
//-------------------POST---------------//
authRouter.post('/login', authValidation, checkIsValidUser, inputValidationMiddleware, authController.authorization) //delete
authRouter.post('/registration', authController.authorization)
authRouter.post('/registration-confirmation', checkCodeValidation, authController.authorization)
authRouter.post('/registration-email-resending', regEmailResendValidation, authController.authorization)