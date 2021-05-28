import morgan from 'morgan';
import { Socket } from 'socket.io';
import { skipPartiallyEmittedExpressions } from 'typescript';
import app from './app';
import chat, { startChat } from './chat';

import {startConnection} from './database'
import Chat from './models/Chat';

var serverchat;
//Funció principal que arrenca el servidor en el port desitjat i activa les possibles connexions
async function main(){
    startConnection();//Icnicia connexió amb BBDD
    await app.listen(app.get('port'));//eactivet servidor de API de RepoblemAPP
    //serverchat = await chat.listen(chat.get('port')); //Activem servidor de chat
    //startChat(serverchat);
    console.log('Server APIS on port',app.get('port'))
    console.log('Server CHAT on port',chat.get('port'))
    console.log('Cors-enabled for all origins')
}

main();
var express = require('express');
var appchat = express();
appchat.use(morgan('dev'));
var server = require('http').createServer(appchat);
const io = require('socket.io').listen(server);


io.of('/chat').on('connection', (socket : Socket) => {

    const chatID = socket.handshake.query.chatID;
    socket.join(chatID as string)

    console.log("User connected to chat: "+ chatID);

    //Desconnexió del chat
    socket.on('disconnect', ()=>{
        socket.leave(chatID as string)
        console.log("User disconnected from chat: "+ chatID);

    })

    socket.on('send_message',async (message)=> {

        const sender = message.sender;//ID del emisor del missatge

        const content = message.content; //Contingut del missatge

        console.log("MEssage send: from" +sender + " says "+content);

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
server.listen(30000);

