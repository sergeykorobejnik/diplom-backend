import {Request, Response, NextFunction} from "express";
import responseService from "./response.service";

export const handleBadJWT = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(req.headers)
    if (err.name === "UnauthorizedError") {
        responseService.sendApiError(res, 401, ["Unauthorized"])
    } else {
        next();
    }
}