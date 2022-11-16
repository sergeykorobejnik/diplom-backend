import mongoose from "mongoose";
import {ModelsConstants} from "../constants";

const {Schema, Types, model} = mongoose


const Channel = new Schema({
    associatedUser: [
        {
            type: Types?.ObjectId,
            required: true
        }
    ],
    messages: [
        {
            messageType: {
                type: String,
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            isRead: {
                type: Boolean,
                required: true,
                default: false,
            }
        }
    ]
})


export default model(ModelsConstants.Channel, Channel)