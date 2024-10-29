const asyncErrorHandler = require('../utils/asyncErrorHandler')
const CustomError = require('../utils/CustomError')
const chatModel = require("../models/chatModel");
const Chat = require('../models/chatModel');

const accessChat = asyncErrorHandler(async (req, res, next) => {

    const {userId} = req.body;
    if(!userId){
        const errorMessage = `Missing userId field`;
        const err = new CustomError(400, errorMessage);
        return next(err);
    }

    let isChat = await chatModel.findOne({
        isGroupChat: false,
        users: {$all: [req.user._id, userId]},
    })
    .populate({
        path: "users",
        select: "name email profile",
    })
    .populate({
        path: "latestMessage",
        populate: {
            path: "sender",
            select: "name email profile"
        }
    })

    if(isChat){
        res.status(200).json(isChat);
    }
    else{
        
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        }

        const createChat = await chatModel.create(chatData);
        const fullChat = await Chat.findById(createChat._id).populate("users", "-password");
        
        res.status(201).json(fullChat)

    }
        
});

module.exports = {accessChat};

