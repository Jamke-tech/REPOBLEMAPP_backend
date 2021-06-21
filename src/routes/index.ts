
import { createOffer, deleteOffer, getOffer, getOffers, getSearchOffers,updatedOffer, getSearchOffersByProvince } from '../controllers/offer.controller';

import { Router } from "express";
import {
  createCompleteUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  loginUsers,
  createADMIN,
  loginADMIN,
  createUserNoPhoto,
  addOfferToFavourites,
  uploadPhotouser,
  deleteOfferOfFavourites
} from "../controllers/user.controller";
import multer from "../libs/multer";
import { createChat, deleteChat, findChat, getChats, getMessages } from '../controllers/chat.controller';
import { createSocket } from '../controllers/socket.controller';
const auth = require('../auth')


//Construim el router on posarem totes les entrades de la API
const router = Router();

//RECORDATORI LES RUTES DE LA API COMENÇEN PER /API

/* Exemple de entrada de api
router.route('/')
    .get ( Funció que ha de fer)*/

//IMPORTAR LES FUNCIONS DELS CONTROLLERS


//RUTES DELS USUARIS
router.route("/create/admin")
    .post(createADMIN) //Para crear un administrador

router.route("/user")
    .post(multer.single('image'),createCompleteUser)
    .put(createUserNoPhoto);

router.route("/user/newPhoto/:id")
    .post(auth, multer.single('image'),uploadPhotouser)

router.route('/users')
    .get(auth, getUsers);

router.route("/admin/login")
    .post(loginADMIN)

router.route("/users/login")
    .post(loginUsers)

router.route("/user/:id")
    .put(auth, updateUser)
    .get(auth, getUser)
    .delete(auth, deleteUser);
    
router.route("/user/addFavourite")
    .post(auth, addOfferToFavourites)

router.route("/user/deleteFavourite")
    .post(auth, deleteOfferOfFavourites)
//RUTES PER LES OFERTES
router.route('/offer')
    .post(auth,multer.array("pictures",6),createOffer)

router.route('/offers')
    .get(auth, getOffers)

router.route('/offers/filtervillage/:village')
    .get(auth,getSearchOffers)

router.route('/offers/filterprovince/:province')
    .get(auth,getSearchOffersByProvince)

router.route('/offer/:id')
    .get(auth,getOffer)
    .delete(auth,deleteOffer)
    .post(auth,updatedOffer)


//rutes relacionades amb el chat

router.route('/newChat')
    .post(auth,createChat)

router.route('/Messages/:idChat')
    .get(auth,getMessages)

router.route('/Chat/:idUser')
    .get(auth,getChats)

router.route('/Chat/:idChat/:idUser')
    .delete(auth,deleteChat)

router.route('/Chat/:idOffer/:idUser')
    .get(auth,findChat)

router.route('/Chat')
    .get(auth,createSocket)



//Per aconseguir les fotografies del backend

router.route('/photo/:id')


//Exportem totes les rutes per que les utilitzin

export default router;
