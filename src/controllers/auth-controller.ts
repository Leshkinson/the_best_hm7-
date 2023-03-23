import {Request, Response} from "express";
import {HTTP_STATUSES} from "../http_statuses";
import {jwtService} from "../application/jwt-service";


export const authController = {
   async authorization(req: Request, res: Response){
       const token = await jwtService.createJWT(req.content.user)
       res.status(HTTP_STATUSES.OK200).send(token)
    }
}