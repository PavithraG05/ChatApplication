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

const fetchAllChats = asyncErrorHandler(async (req, res, next) => {

    const fetchChats = await chatModel.find({
        users: {$elemMatch :{$eq: req.user._id } }
    })
    .populate({
        path: "users",
        select: "name email profile",
    })
    .populate({
        path: "groupAdmin",
        select: "name email profile",
    })
    .populate({
        path: "latestMessage",
        select: "sender content chat createdAt",
        populate: {
            path: "sender",
            select: "name email profile",
        },
    })
    .sort({"latestMessage.createdAt":-1})

    res.status(200).json(fetchChats);
})

const createGroup = asyncErrorHandler( async (req, res, next) => {
    
    const {users, name} = req.body;
    
    if(!users || !name){
        let errorMessage = "Missing one or more fields";
        const err = new CustomError(400, errorMessage);
        return next(err);
    }

    let usersObj = JSON.parse(users);
    if(usersObj.length < 2){
        let errorMessage = "Group should have more than a user";
        const err = new CustomError(400, errorMessage);
        return next(err);
    }

    usersObj.push(req.user);

    const groupChat = await chatModel.create({
        chatName: name,
        users: usersObj,
        isGroupChat: true,
        groupAdmin: req.user,
    });

    const createdGroup = await chatModel.findById({_id:groupChat._id})
                        .populate("users","-password")
                        .populate("groupAdmin","-password");

    res.status(201).json(createdGroup);  
})

const updateGroupName = asyncErrorHandler( async (req, res, next) => {

    const {chatId, chatName} = req.body;

    if(!chatId || !chatName){
        let errorMessage = "Missing one or more fields";
        const err = new CustomError(400, errorMessage);
        return next(err);
    }

    const updateGroup = await chatModel.findByIdAndUpdate(
                        chatId,
                        {
                            chatName: chatName,
                        },
                        {
                            new: true,
                        }
                    )
                    .populate("users","-password")
                    .populate("groupAdmin","-password");
    
    if(!updateGroup){
        let errorMessage = "Group not found";
        const err = new CustomError(404, errorMessage);
        return next(err);
    }

    res.status(200).json(updateGroup);

})

const addMembers = asyncErrorHandler( async (req, res, next) => {

    const {chatId, userId} = req.body;

    if(!chatId || !userId){
        let errorMessage = "Missing one or more fields";
        const err = new CustomError(404, errorMessage);
        return next(err);
    }

    const checkMemExists = await chatModel.findOne({
        _id: chatId,
        users: {$elemMatch :{$eq: userId } }
    })

    if(checkMemExists){
        let errorMessage = "User already part of group";
        const err = new CustomError(400, errorMessage);
        return next(err)
    }

    const addMem = await chatModel.findByIdAndUpdate(chatId,{
        $push: {users: userId},
    },
    {
        new: true,
    }).populate("users","-password")
    .populate("groupAdmin","-password");

    if(!addMem){
        let errorMessage = "Group not found";
        const err = new CustomError(404, errorMessage);
        return next(err)
    }

    res.status(200).json(addMem);
})

const removeMembers = asyncErrorHandler( async (req, res, next) => {

    const {chatId, userId} = req.body;

    if(!chatId || !userId){
        let errorMessage = "Missing one or more fields";
        const err = new CustomError(404, errorMessage);
        return next(err);
    }

     const checkMemExists = await chatModel.findOne({
        _id: chatId,
        users: {$elemMatch :{$eq: userId } }
    })

    if(!checkMemExists){
        let errorMessage = "User not part of group";
        const err = new CustomError(400, errorMessage);
        return next(err)
    }

    const remMem = await chatModel.findByIdAndUpdate(chatId,{
        $pull: {users: userId},
    },
    {
        new: true,
    }).populate("users","-password")
    .populate("groupAdmin","-password");

    if(!remMem){
        let errorMessage = "Group not found";
        const err = new CustomError(404, errorMessage);
        return next(err)
    }

    res.status(200).json(remMem);

})

module.exports = {accessChat, fetchAllChats, createGroup, updateGroupName, addMembers, removeMembers};

