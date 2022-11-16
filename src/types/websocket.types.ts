export enum WebsocketMessageTypes {
    CHAT_MESSAGES = 'CHAT_MESSAGES',
    CHAT_LIST = 'CHAT_LIST'
}

export type WebsocketPayload<T extends  Record<string, any>> = {
    type: keyof typeof WebsocketMessageTypes,
    payload: T
}