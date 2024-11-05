export const getSender = (loggerUser, chatUsers) =>{
    return loggerUser._id === chatUsers[0]._id ? chatUsers[1].name : chatUsers[0].name;
}