import { Socket } from "socket.io";
import app from "../app";
import Chat from "../models/Chat";




export  function createSocket(){


    const http = require('http').createServer(app)
    const io = require('socket.io')(http)


    io.on('connection', (socket : Socket) => {

        const chatID = socket.handshake.query.chatID;
        socket.join(chatID as string)

        console.log("User connected to chat: "+ chatID);

        //Desconnexió del chat
        socket.on('disconnect', ()=>{
            socket.leave(chatID as string)
        })

        socket.on('send_message',async (message)=> {

            const sender = message.sender;//ID del emisor del missatge

            const content = message.content; //Contingut del missatge

            console.log("The sender "+ sender +" says: "+content);

            socket.in(chatID as string).emit('receive_message',{
                'sender':sender,
                'content':content,
            })
            //He de guardar els missatges que s'han enviat dins del vector de missatges

            //El chat id sera el mateix id que el de la bbdd aixi que podem buscar i afegir els missatge
            const chatInfo = await Chat.findById(chatID);
            var newMessages = chatInfo.messages;
            newMessages.push({sender:sender,content:content});
            //console.log(vectorOffers);

            const chatUpdated = await Chat.findByIdAndUpdate(
            chatID,
            {
                "messages": newMessages,
            },
            );

        })

    })


}