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

    const { myID, ownerID, offerID}=req.body;

    const newChat ={
        owner: ownerID,
        user: myID,
        offerRelated: offerID,
        messages: [{
            sender: "607fe4ac8e48baa90cd6ded2",
            content: "Xat iniciat",}
        ]
    }
    console.log(newChat);

    try{
        const chat = new Chat(newChat);
        const chatSaved = await chat.save();
        
        //Guardamos en el vector de chats del usuario el id del chat

        const user = await User.findById(myID);
        const owner = await User.findById(ownerID);
        var social = user.social;
        console.log(social)
        var ownersocial = owner.social;
        console.log(ownersocial)
        console.log(chatSaved._id)

        social.push(chatSaved._id)
        console.log(social)
        ownersocial.push(chatSaved._id)
        console.log(ownersocial)

        const userUpdated = await User.findByIdAndUpdate(
            myID,
            {
              "social": social,
      
            },
          );

        console.log(userUpdated)
        
        const ownerUpdated = await User.findByIdAndUpdate(
            ownerID,
            {
              "social": ownersocial,
            },
          );




        const infoChat = await Chat.findById(chatSaved._id).populate('owner offerRelated');

        return res.json({
            code: '200',
            message: "Chat Created",
            Chat: infoChat
          });
    }

    catch (e){
        console.log(e);
        return res.json({
            code: '400',
            message: "Chat NotCreated",
            Chat: null
        });
    }

}

export async function findChat( req:Request, res:Response):Promise<Response>{

    const {idOffer,idUser}=req.params;

    try{
        const Chats = await Chat.find({offerRelated:idOffer, user:idUser}).populate('owner offerRelated');

        //Si no es null podem dir que si que existeix

        if(Chats[0]!=null){

            return res.json({
                code: '200',
                message: "Chat Encontrado",
                Chat: Chats[0]
            });
        }
        else{
            return res.json({
                code: '404',
                message: "Chat  NO Encontrado",
                Chat: null
            });

        }
    }
    catch(e){
        console.log(e);

        return res.json({
            code: '500',
            message: "Error de Servidor",
            Chat: null
        });

    }

}

export async function deleteChat ( req: Request, res: Response): Promise<Response>{
    //Es el primer cop que iniciem un chat aixi que haurem de crear el objecte de BBDD i guardar-ho

    const {idChat, idUser}=req.params;

    try{
        //Borramos la oferta
        //Recuperamos la id de la oferta para poder borrarla
        const chatOwner = await Chat.findById(idChat)

        const idOwner = chatOwner.owner

        //borramos Chat
        const chat = await Chat.findByIdAndDelete(idChat);
        if(chat){
            
            //Borramos del vector de Social los chats que queremos eliminar

            const user = await User.findById(idUser);
            const owner = await User.findById(idOwner);
            var social = user.social;
            console.log(social)
            var ownersocial = owner.social;
            console.log(ownersocial)
            console.log(idChat)

            const userSocial = arrayRemove(social,idChat);
            console.log(userSocial);
            const ownerSocial = arrayRemove(ownersocial,idChat);
            
            const userUpdated = await User.findByIdAndUpdate(
                idUser,
                {
                "social": userSocial,
        
                },
            );
            
            const ownerUpdated = await User.findByIdAndUpdate(
                idOwner,
                {
                "social": ownerSocial,
        
                },
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
export async function getChats (req:Request, res:Response): Promise<Response>{


    const{idUser}=req.params;

    try{

        const user = await User.findById(idUser).populate({path:'social',populate:'owner offerRelated'});
        var social = user.social;

        return res.json({
            code: '200',
            message: "Chats Available ",
            activeChats: social
        });
    
    }
    catch(e){
        return res.json({
            code: '500',
            message: "UPS error de Servidor",
            activeChats: null
        });

    }



}





function arrayRemove(arr:String[],value:String){
    return arr.filter(function(ele:String){
        return ele!=value;
    });
}

