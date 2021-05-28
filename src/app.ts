import express from 'express';
import cors from 'cors'
import morgan from 'morgan';
import path from 'path'
import socketIO, {Socket} from "socket.io";
import {Request, Response} from 'express'
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

app.get('/', (req:Request,res:Response)=>{
    res.send("RepoblemAPP server working")
})




export default app;

