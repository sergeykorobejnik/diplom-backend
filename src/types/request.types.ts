import {Request} from 'express';

export type SingUpPayload = {
    email: string;
    tag: string;
    password: string;
}

export type SingInPayload = Pick<SingUpPayload, 'email' | 'password'>

export type  RequestWithBody<T extends Record<string, unknown>> =  Request<any, any, T>