import {Request, Response} from 'express'
import Offer from '../models/Offer'
import path from 'path';
import fs from 'fs-extra';
import User from '../models/User';
import cloudinary from '../libs/cloudinary';
import multer, { Multer } from 'multer';


export async function createOffer ( req: Request, res: Response): Promise<Response>{
//Recuperem la info de request body per poder-la treure i posar-la a la base de dades
    var pictureFiles = req.files;
    //Pujem les fotografies al cloudinary
    var vectorPictures = Array();
    let multiplePicturePromise = (pictureFiles as Array<unknown>).map( async (picture:any) => {
        
        vectorPictures.push((await cloudinary.uploader.upload(picture.path)).secure_url as String)
        fs.unlink(path.resolve(picture.path))

    }
      
    );

    // await all the cloudinary upload functions in promise.all, exactly where the magic happens
    let imageResponses = await Promise.all(multiplePicturePromise);

    console.log(vectorPictures);
  
    const {
        title,
        description,
        province,
        place,
        lat ,
        long , // [47.2555685 , 1.2568]
        owner,
        village,
        price,
        services
    } = req.body;

    //Posem tot en una nova variable de Offer
    const newOffer = {
        title: title,
        description: description,
        pictures: vectorPictures,
        place: place, //Carrer Maria del Carme del Mar, 23, 2n 1r
        province : province,
        point:{
          coordinates:[ Number(lat), Number(long)]
        },
        owner: owner,
        village: village,
        price: price,
        services: services
    };
    console.log(newOffer);
    try{
        var errorSave : Boolean = false;
        const offer = new Offer(newOffer);//creació del document de mongodb
        await offer.save(function(err: boolean){
          //console.log(err);
          if(err){
            errorSave = true;      
          }
          else{
            errorSave=false
          }
        } ); //guardem offer
        
        if (errorSave){
            return res.json({
                code: '403',
                message: "Error en dades de la oferta"
              });
        }

        else{
            //Guardem la oferta que ha creat dins del vector de ofertes creades del usuari

            const proper = await User.findById(owner);
            console.log(proper);

            var offersCreated = proper.createdOffers;
            offersCreated.push(offer.id);
            const userUpdated = await User.findByIdAndUpdate(
              owner,
              {
                "createdOffers": offersCreated,
              },
            );

            return res.json({
                code: '200',
                message: "Offer correctly uploaded",
                idOffer: offer.id
            });
        }
    }
    catch(e){
      console.log(e);
        return res.json({
            code: '505',
            message: "Server Down",
          });
   }
}

export async function deleteOffer (req: Request, res: Response): Promise<Response>{
    
    try{
        //Borramos la oferta
        //Recuperamos la id de la oferta para poder borrarla
        const {id} = req.params;
        const offer = await Offer.findByIdAndDelete(id);
        if(offer){
            //await fs.unlink(path.resolve("../frontend/Angular/RepoblemAPP/src/"+ offer.pictures))//eliminamos la fotografia del servidor
            
            return res.json({
              code: '200',
              message: "succesfully deleted offer:" + offer?.title,
              id: offer?.id});
            }
        
        else{
            return res.json({
                code: '404',
                message: "Offer not found",
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

export async function getOffers (req:Request, res: Response): Promise<Response>{
    //Funció que retorna tota la llista de ofertes sense cap filtre
    const offers= await Offer.find().populate('owner');
    try{
      //console.log(offers);
        return res.json({
            code: '200',
            message: 'List of Offers',
            numberOffers: offers.length,
            offersList: offers
            });
    }
    catch{
      return res.json({
        code: '500',
        message: 'Server Down or BBDD broken',
        numberOffers: 0,
        offersList: null
      }
        );
    }
}

export async function getSearchOffers (req:Request, res: Response): Promise<Response>{
  
  const village = req.params.village;
  const offers= await Offer.find().populate();
  const searchOffersVector = [];
  

  for( let i = 0; i< offers.length; i++){
    if (offers[i].village == village){
      searchOffersVector.push(offers[i]);
    }
  }


  try{
    //console.log(offers);
      return res.json({
          code: '200',
          message: 'List of searched Offers',
          numberOffers: offers.length,
          searchOffers: searchOffersVector
          });
  }
  catch{
    return res.json({
      code: '500',
      message: 'Server Down or BBDD broken',
      numberOffers: 0,
      offersList: null
    }
      );
  }
}

export async function getSearchOffersByProvince (req:Request, res: Response): Promise<Response>{
  
  const province = req.params.province;
  const offers= await Offer.find().populate();
  const searchOffersVector = [];
  

  for( let i = 0; i< offers.length; i++){
    if (offers[i].province == province){
      searchOffersVector.push(offers[i]);
    }
  }


  try{
    //console.log(offers);
      return res.json({
          code: '200',
          message: 'List of searched Offers',
          numberOffers: offers.length,
          searchOffers: searchOffersVector
          });
  }
  catch{
    return res.json({
      code: '500',
      message: 'Server Down or BBDD broken',
      numberOffers: 0,
      offersList: null
    }
      );
  }
}

export async function getOffer(req: Request, res: Response): Promise<Response> {
    try{
    const offer = await Offer.findById(req.params.id).populate('owner');
    
    
    return res.json({
      code: '200',
      message: 'Offer Found',
      offer: offer});
    }
    catch{
      return res.json({
        code: '500',
        message: 'Server Down or BBDD error',
        offer: null});
      }
  
  }
  

  export async function updatedOffer(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const {
        title,
        description,
        pictures,
        ubication,
        owner,
        village,
        price,
    } = req.body;
    try{
    //Posem tot en una nova variable de Offer
    const updatedOffer = await Offer.findByIdAndUpdate(
        id,
        {
            title,
            description,
            pictures,
            ubication,
            owner,
            village,
            price,
        },
        {new: true}
    );
    return res.json({
        code:"200",
        message: "successfully updated",
        updatedOffer,
      });
    }
    catch{
      return res.json({
        code:"500",
        message: "Offer not updated"
        
      });
  
    }
      
  }

