import { createOffer, deleteOffer, getOffer, getOffers } from '../controllers/offer.controller';
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
  addOfferToFavourites
} from "../controllers/user.controller";
import multer from "../libs/multer";
import { createChat, deleteChat, findChat, getChats, getMessages } from '../controllers/chat.controller';
import { createSocket } from '../controllers/socket.controller';


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

router.route('/users')
    .get(getUsers);

router.route("/admin/login")
    .post(loginADMIN)

router.route("/users/login")
    .post(loginUsers)

router.route("/user/:id")
    .put(updateUser)
    .get(getUser)
    .delete(deleteUser);
    
router.route("/user/addFavourite")
    .post(addOfferToFavourites)
//RUTES PER LES OFERTES
router.route('/offer')
    .post(createOffer)

router.route('/offers')
    .get(getOffers)


router.route('/offer/:id')
    .get(getOffer)
    .delete(deleteOffer)


//rutes relacionades amb el chat

router.route('/newChat')
    .post(createChat)

router.route('/Messages/:idChat')
    .get(getMessages)

router.route('/Chat/:idUser')
    .get(getChats)

router.route('/Chat/:idChat/:idUser')
    .delete(deleteChat)

router.route('/Chat/:idOffer/:idUser')
    .get(findChat)

router.route('/Chat')
    .get(createSocket)



//Per aconseguir les fotografies del backend

router.route('/photo/:id')


//Exportem totes les rutes per que les utilitzin

export default router;
