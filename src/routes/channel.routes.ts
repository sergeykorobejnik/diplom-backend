import express from "express";
import {ChannelsMessageTypes} from "../constants";
import responseService from "../utils/response.service";
import {StreamChat} from "stream-chat";
import {CreateChannelPayload, GetChannelByUser, RequestWithBody, SingUpPayload} from "../types";

const channelRouter = express.Router()


channelRouter.post('/create', async (req: RequestWithBody<CreateChannelPayload>, res) => {
    try {
        const {userTag, recipientTag} = req.body

        console.log(userTag, recipientTag)
        const stream = StreamChat.getInstance(process.env["STREAM_API_KEY"] as string, process.env["STREAM_SECRET_KEY"])

        // console.log((await stream.queryChannels({type: 'messaging', members: [userTag, recipientTag]})).length)

        //checking for channels with this users
        if ((await stream.queryChannels({type: 'messaging', members: [userTag, recipientTag]})).length) {
            return responseService.sendApiError(res, 500, ['You already have conversation with this user'])
        }

        const channel = stream.channel('messaging', {
            created_by_id: userTag,
            members: [userTag, recipientTag],
        })


        await channel.create()

        return responseService.sendApiSuccess(res,200, "User was created")

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
        return responseService.sendApiSuccess(res, 200, {
            users: users.map(user => user.id).filter(userId => userId !== userTag)
        })

        return res.sendStatus(200)

    } catch (e) {
        return responseService.sendApiError(res, 501,['Internal server error'])
    }
})


export default channelRouter