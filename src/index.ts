import express from 'express';
import {expressjwt} from "express-jwt";
import dotenv from 'dotenv';
import * as mongoose from "mongoose";
import cors from 'cors';
import {API_BASE_AUTH, API_CHANNELS, API_SIGN_IN_ROUTE, API_SIGN_UP_ROUTE} from "./constants";
import {handleBadJWT} from "./utils/handleBadJWT";
import {authRouter} from "./routes";
import bodyParser from "body-parser";
import {channelWebsocket} from "./webSockets";
import channelRouter from "./routes/channel.routes";


dotenv.config();


const app = express();





app.use(cors());
app.use(expressjwt({
    secret: process.env.JWT_SECRET as string,
    algorithms: ["HS256"]
}).unless({
    path: [API_SIGN_UP_ROUTE, API_SIGN_IN_ROUTE, '/channels']
}));

app.use(handleBadJWT);
app.use(bodyParser.json())


app.use(API_BASE_AUTH, authRouter);
app.use(API_CHANNELS, channelRouter);


(async () => {
    await mongoose.connect('mongodb+srv://tilker:tyodus5wi5jw4SFA@cluster0.2mskzud.mongodb.net/?retryWrites=true&w=majority')
    console.log('mongo connected')

    const server = await app.listen(process.env["SERVER_PORT"], () => {
        console.log(`Server listen: ${process.env["SERVER_PORT"]}`)
    })

    await channelWebsocket(server)

    console.log('websocket channels started')


})()


