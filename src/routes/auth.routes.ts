import {Router} from "express";
import {Request} from "express";
import {RequestWithBody, SingInPayload, SingUpPayload} from "../types";
import User from "../models/User.model";
import responseService from "../utils/response.service";
import {body, validationResult} from "express-validator";
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken';
import { StreamChat } from 'stream-chat';


const authRouter = Router()

authRouter.post(
    '/sign-up',
    body('email').isEmail(),
    body('password').isString().isLength({min: 5}),
    body('tag').isString().isLength({min: 3}),
    async (req: RequestWithBody<SingUpPayload>, res) => {
        const {email, password, tag} = req.body

        //validating fields
        const errors = validationResult(req)

        if (!errors.isEmpty()) return responseService.sendApiError(res, 400, [...errors.array().map(({msg}) => msg)])
        //looking for existing user in db
        if (await User.findOne({email})) return responseService.sendApiError(res, 400, [
            "This email already taken",
        ])
        //creating user in mongo
        const user = new User({
            email,
            password: await bcrypt.hash(password, 12),
            tag
        })
        //saving basic user data
        await user.save()

        const stream = StreamChat.getInstance(process.env["STREAM_API_KEY"] as string, process.env["STREAM_SECRET_KEY"]);

        await stream.upsertUser({
            id: user.tag,
        })

        return responseService.sendApiSuccess(res, 200, {
            id: user.id,
            tag: user.tag,
            email: user.email,
            streamToken: stream.createToken(user.tag),
            token: jwt.sign(user.id, process.env["JWT_SECRET"] as string, {algorithm: 'HS256'})
        })
    }
)

authRouter.post(
    '/sign-in',
    body('email').isEmail(),
    body('password').isString().isLength({min: 5}),
    async (req: RequestWithBody<SingInPayload>, res) => {
        const {email, password} = req.body

        const errors = validationResult(req)

        if (!errors.isEmpty()) return responseService.sendApiError(res, 400, [...errors.array().map(({msg}) => msg)])

        const user = await User.findOne({email})

        if (!user) return responseService.sendApiError(res, 400, [
            "This user does not exist",
        ])

        if (!await bcrypt.compare(password, user.password)) return responseService.sendApiError(res, 400, [
            "Wrong user password",
        ])

        const stream = StreamChat.getInstance(process.env["STREAM_API_KEY"] as string, process.env["STREAM_SECRET_KEY"])


        return responseService.sendApiSuccess(res, 200, {
            id: user.id,
            tag: user.tag,
            email: user.email,
            streamToken: stream.createToken(user.tag),
            token: jwt.sign(user.id, process.env["JWT_SECRET"] as string, {algorithm: 'HS256'})
        })
    }
)

export {authRouter}