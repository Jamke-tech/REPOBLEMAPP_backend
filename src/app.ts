import express from 'express';
import cors from 'cors'
import morgan from 'morgan';
import path from 'path'
import socketIO, {Socket} from "socket.io";

const app = express();

import indexRoutes from './routes/index'
import Chat from './models/Chat';

const cloudinary = require('cloudinary').v2
const bodyParser = require ('body-parser');


//settings
app.set('port', process.env.PORT || 25000); // definim el port del nostre servidor

// Middlewares que volem utilitzar pel nostre backend

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());


//Routes de la API
app.use('/api',indexRoutes); //Les rutes començaran per api i continuaran com posa en indexRoutes

// Preparació per poder pujar fotografies amb multer i a la carpeta que pot accedir
app.use('/uploads',express.static(path.resolve('uploads')));




//Socket logic
const http = require('http').createServer(app)
const io = require('socket.io')(http)


io.on('connection', (socket : Socket) => {

    const chatID = socket.handshake.query.chatID;
    socket.join(chatID as string)

    //Desconnexió del chat
    socket.on('disconnect', ()=>{
        socket.leave(chatID as string)
    })

    socket.on('send_message',async (message)=> {

        const sender = message.sender;//ID del emisor del missatge

        const content = message.content; //Contingut del missatge


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

export default app;

