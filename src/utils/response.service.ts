import {Response} from 'express';
import {WebSocket} from "ws";

class ResponseService {
    sendApiError (res: Response, code = 500, errors: Array<string>): void {
        res.status(code).json({
            success: false,
            errors,
        })
    }
    sendApiSuccess (res: Response, code = 200, value: any): void {
        res.status(code).json({
            success: true,
            value
        })
    }

    sendWsSuccess(socket: WebSocket, type: string, value: Record<string, any>) {
        socket.send(JSON.stringify({type, value}))
    }

    sendWsError(socket: WebSocket, errors: Array<string>) {
        socket.send(JSON.stringify({type: "WS_ERROR", errors}))
    }
}

export default new ResponseService()