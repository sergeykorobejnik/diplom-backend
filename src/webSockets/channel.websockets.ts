import {Express, request, Request, response, Response} from "express";
import WebSocket from "ws";
import * as http from "http";
import {GetChatListPayload, GetMessagesPayload, WebsocketMessageTypes, WebsocketPayload} from "../types";
import responseService from "../utils/response.service";
import User from "../models/User.model";
import Channel from "../models/Channel.model";

const channelWebsocket = async (server: http.Server) => {
    const ws = new WebSocket.Server({ server: server})

    ws.on(
        'connection',
        (socket, request) => {

            socket.on('message',  async (message: string ) => {
                 const action: WebsocketPayload<any> = JSON.parse(message)

                switch (action.type) {
                    case "CHAT_LIST": {
                        const {userId}:GetChatListPayload = action.payload
                        const user = await User.findOne({id: userId})
                        if(user) {
                            return  responseService.sendWsSuccess(socket, WebsocketMessageTypes.CHAT_LIST, {
                                channels: user.channels
                            })
                        } else {
                            return  responseService.sendWsError(socket, ['Channels not found'])
                        }

                    }

                    case "CHAT_MESSAGES": {
                        const {channelId}:GetMessagesPayload = action.payload
                        const channelMessages = await Channel.findOne({id: channelId})
                        if (channelMessages) {
                            return responseService.sendWsSuccess(socket, WebsocketMessageTypes.CHAT_MESSAGES, {
                                channelMessages
                            })
                        } else {
                            return  responseService.sendWsError(socket, ['Messages not found'])
                        }
                    }

                    default: return  responseService.sendWsError(socket, ['Something goes wrong'])
                }

            })
        }
    )

}

export {channelWebsocket}