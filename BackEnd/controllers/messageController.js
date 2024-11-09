const asyncErrorHandler = require('../utils/asyncErrorHandler')
const CustomError = require('../utils/CustomError')
const messageModel = require('../models/messageModel')
const chatModel = require('../models/chatModel')
const userModel = require('../models/userModel')

const sendMessage = asyncErrorHandler(async(req, res, next) =>{
    const {content, chatId} = req.body;

    console.log(req.user._id);

    if(!content || !chatId){
        errorMessage = `Missing one or more required fields`
        const err = new CustomError(400, errorMessage);
        return next(err);
    }

    const newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    const createMessage = await messageModel.create(newMessage);
    await chatModel.findByIdAndUpdate(req.body.chatId,
                        {
                            latestmessage: createMessage,
                        },);
    const message = await messageModel.findById(createMessage._id)
                        .populate("sender", "-password")
                        .populate({
                            path: "chat",
                            select: "",
                            populate: [
                                {
                                    path: "users",
                                    select: "name email profile",
                                },
                                {
                                    path: "latestMessage",
                                    select: "sender content chat createdAt",
                                    model: "Message",
                                },
                            ]
                        });

    // var message = await messageModel.create(newMessage);

    // message = await message.populate("sender", "name pic");
    // message = await message.populate("chat");
    // message = await userModel.populate(message, {
    //   path: "chat.users",
    //   select: "name pic email",
    // });

    // await chatModel.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    if(message){
        res.status(201).json(message);
    }
    else{
        errorMessage = `error:"Failed to create message"`;
        const err = new CustomError(400, errorMessage);
        return next(err);
    }

})


const allMessages = asyncErrorHandler(async(req,res,next) => {
    
    const chatId = req.params.chatId;
    if(!chatId){
        errorMessage = `Missing chatId field`
        const err = new CustomError(400, errorMessage);
        return next(err);
    }
    const fetchMessage = await messageModel.find({chat: chatId}).populate("sender","name email profile").populate("chat");

    if(fetchMessage){
        res.status(200).json(fetchMessage);
    }
    else{
        errorMessage = `error:"Failed to fetch messages"`;
        const err = new CustomError(400, errorMessage);
        return next(err);
    }
})

module.exports = {sendMessage, allMessages}