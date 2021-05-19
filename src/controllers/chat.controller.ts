import {Request, Response} from 'express'
import path from 'path';
import fs from 'fs-extra';
import Chat from '../models/Chat';
import User from '../models/User';


const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http);




export async function createChat ( req: Request, res: Response): Promise<Response>{
    //Es el primer cop que iniciem un chat aixi que haurem de crear el objecte de BBDD i guardar-ho

    const { myID, ownerID, offerRelated}=req.body;

    const newChat ={
        with: [ownerID,myID],
        offerRelated: offerRelated,
        messages: []
    }
    console.log(newChat);

    try{
        const chat = new Chat(newChat);
        const chatSaved = await chat.save();
        
        //Guardamos en el vector de chats del usuario el id del chat

        const user = await User.findById(myID);
        const owner = await User.findById(ownerID);
        var social = user.social;
        var ownersocial = owner.social;

        social.push(chatSaved.id)
        ownersocial.push(chatSaved.id)
        
        const userUpdated = await Chat.findByIdAndUpdate(
            myID,
            {$set:{
              "social": social,
      
            },}
          );
        
        const ownerUpdated = await Chat.findByIdAndUpdate(
            ownerID,
            {$set:{
              "social": ownersocial,
      
            },}
          );

        return res.json({
            code: '200',
            message: "Chat Created",
            idChat: chatSaved.id
          });
    }

    catch (e){
        console.log(e);
        return res.json({
            code: '400',
            message: "Chat NotCreated",
            idChat: null
        });
    }

}
export async function deleteChat ( req: Request, res: Response): Promise<Response>{
    //Es el primer cop que iniciem un chat aixi que haurem de crear el objecte de BBDD i guardar-ho

    const {idChat, idUser}=req.params;

    try{
        //Borramos la oferta
        //Recuperamos la id de la oferta para poder borrarla
        const idOwner = await Chat.findByIdAndDelete(idChat).with[0];

        //borramos Chat
        const chat = await Chat.findByIdAndDelete(idChat);
        if(chat){
            
            //Borramos del vector de Social los chats que queremos eliminar

            const user = await User.findById(idUser);
            const owner = await User.findById(ownerID);
            var social = user.social;
            var ownersocial = owner.social;

            social.push(chatSaved.id)
            ownersocial.push(chatSaved.id)
            
            const userUpdated = await Chat.findByIdAndUpdate(
                myID,
                {$set:{
                "social": social,
        
                },}
            );
            
            const ownerUpdated = await Chat.findByIdAndUpdate(
                ownerID,
                {$set:{
                "social": ownersocial,
        
                },}
            );








            


            return res.json({
              code: '200',
              message: "succesfully deleted offer:" + chat?.id,
              id: chat?.id});
            }
        
        else{
            return res.json({
                code: '404',
                message: "Chat not found",
                });
        }
    }

    catch (e){
        console.log(e);
          return res.json({
            code: '500',
            message: "Server Down or errorn on BBDD",
            id: null});
    }

}
export async function getMessages (req:Request, res:Response): Promise<Response>{

    const{idChat}=req.params

    try{
        const chatInfo = await Chat.findById(idChat);
        var messages = chatInfo.messages;

        return res.json({
            code: '200',
            message: "Messages from de Chat "+idChat,
            messages: messages
        });

    }
    catch(e){
        console.log(e);

        return res.json({
            code: '500',
            message: "Server Unavailable",
        });


    }
}

export async function getChats(req:Request, res:Response): Promise<Response>{


    const{id}=req.params;

    try{

        const user = User.find({talkers:{}})






    }




}

