import mongoose from "mongoose";
import {ModelsConstants} from "../constants";

const {Schema, Types, model} = mongoose

const User = new Schema({
    avatar: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    channels: [
        {
            type: Types?.ObjectId,
        }
    ]
})

export default model(ModelsConstants.User, User);