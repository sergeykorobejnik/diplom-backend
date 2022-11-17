import {Request} from 'express';

export type SingUpPayload = {
    name: string;
    email: string;
    tag: string;
    password: string;
}
export type CreateChannelPayload = {
   userTag: string;
   recipientTag: string;
}

export type GetChannelByUser = {
   userId: string;
}

export type GetUsersByTagPayload = {
   userTag: string;
}


export type SingInPayload = Pick<SingUpPayload, 'email' | 'password'>

export type  RequestWithBody<T extends Record<string, unknown>> =  Request<any, any, T>