import express from "express";
import {ChannelsMessageTypes} from "../constants";
import responseService from "../utils/response.service";
import {StreamChat} from "stream-chat";
import {CreateChannelPayload, GetChannelByUser, RequestWithBody, SingUpPayload} from "../types";

const channelRouter = express.Router()

console.log(typeof channelRouter.ws)

channelRouter.post('/create', async (req: RequestWithBody<CreateChannelPayload>, res) => {
    try {
        const {userTag, recipientTag, channelName} = req.body

        console.log(userTag, recipientTag, channelName)
        const stream = StreamChat.getInstance(process.env["STREAM_API_KEY"] as string, process.env["STREAM_SECRET_KEY"])

        const channel = stream.channel('messaging', channelName, {
            created_by_id: userTag,
            members: [userTag, recipientTag]
        })


        await channel.create()

        return res.sendStatus(200)

    } catch (e) {
        console.log(e)
        return responseService.sendApiError(res, 501,['Internal server error'])
    }

})

channelRouter.get('/users-by-tag', async (req: RequestWithBody<GetChannelByUser>, res) => {
    try {
        const {userTag, recipientTag} = req.query
        console.log()
        const stream = StreamChat.getInstance(process.env["STREAM_API_KEY"] as string, process.env["STREAM_SECRET_KEY"])

        const {users} = await stream.queryUsers({id: {'$autocomplete': recipientTag as string}})
        console.log(users[0])

        return responseService.sendApiSuccess(res, 200, {
            users: users.map(user => user.id).filter(userId => userId !== userTag)
        })

        return res.sendStatus(200)

    } catch (e) {
        return responseService.sendApiError(res, 501,['Internal server error'])
    }
})


export default channelRouter