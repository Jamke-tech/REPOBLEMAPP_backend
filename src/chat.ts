
import {Socket} from "socket.io";
import {Request, Response} from 'express'
var express = require('express')
var chat =  express();
var socket = require('socket.io')

import Chat from './models/Chat';
import morgan from "morgan";
import cors from "cors";
import { HttpBase } from "http";


//settings
chat.set('port', process.env.PORT || 30000); // definim el port del nostre servidor

//Middelwares 
chat.use(morgan('dev'));
chat.use(cors());

chat.get('/', (req:Request,res:Response)=>{
    res.send("RepoblemAPP Chat server working")
})

//Socket logic
const options= {
    transports: ["websocket"],
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    }
  };

/*const http = require('http').createServer(chat)
const io = require('socket.io')(http,options)*/

export function startChat(server:any){

const io = require('socket.io').listen(server);

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

            const userUpdated = await Chat.findByIdAndUpdate(
            chatID,
            {
                "messages": newMessages,
            },
            );

        })

    })

}
export default chat;