import { Request, Response } from "express";
import User from "../models/User";
import path from 'path';
import fs from 'fs-extra';

const jwt = require('jsonwebtoken');


import cloudinary from "../libs/cloudinary" ;


/* ---- EXEMPLE DE FUNCIÓ ---
export async function createUser (req: Request, res: Response): Promise<Response> {

    const{ username, password} = req.body;

    const newUser ={
        username: username,
        password: password
    };

    const user= new User (newUser);// creem l'objecte de MongoDB
    await user.save()//guardem la foto amb mongoose

    return res.json({
        message : 'User correctly uploaded'
    })
}*/

export async function loginADMIN (req:Request,res:Response):Promise<Response> {

  const{ userName, password} = req.body;
  
  const findUser = {
    userName: userName,
  };
  try{
  const user = await User.find(findUser);

  //Hem de comprovar que la contrasenya sigui la mateixa que ens entren 
  //ACHTUNG !! Quan tenim un fid ens retorna un vector
  
    
    if(user[0].password == password && user[0].role == "ADMIN")
    {
      //Contrasenya correcta 
      return res.json({
        code: '200',
        message: "User authorized",
        id: user[0].id,
        //token
        //rol
      });
    }
    else{
      return res.json({
        code:'401',
        message: " Acces Unahtorized",
        id: user[0].id,
        //token
        //rol
      });
    }
  } 
  catch{
    return res.json({
      code: '404',
      message: "User not found on BBDD",
    });
  }
   
}
export async function loginUsers (req:Request,res:Response):Promise<Response> {

  const{ userName, password} = req.body;
  
  const findUser = {
    userName: userName,
  };
  try{
  const user = await User.find(findUser);

  //Hem de comprovar que la contrasenya sigui la mateixa que ens entren 
  //ACHTUNG !! Quan tenim un fid ens retorna un vector
  //Hem de crear el token per retornar a l'usuari si el password esta correcte
    
    if(user[0].password == password )
    {
      //Creem token 
      const token = jwt.sign(
        {
        name: user[0].username,
        id: user[0]._id,
        role: user[0].role
        },
      'secret',
      {expiresIn: 60*60});
      
      
      //Contrasenya correcta 
      return res.json({
        code: '200',
        message: "User authorized",
        id: user[0].id,
        token: token,
        rol: user[0].role
      });
    }
    else{
      return res.json({
        code:'401',
        message: " Acces Unahtorized",
        id: user[0].id,
        token: null,
        rol:user[0].role
      });
    }
  } 
  catch{
    return res.json({
      code: '404',
      message: "User not found on BBDD",
    });
  }
   
}

export async function createADMIN(  req: Request,  res: Response): Promise<Response> {
  const { userName, password } = req.body;

  const newUser = {
    userName: userName,
    password: password,
    role: "ADMIN"
  };
  try{

  const user = new User(newUser); // creem l'objecte de MongoDB
  await user.save(); //guardem l'usuari a Mongo DB

  return res.json({
    code: '200',
    message: "User correctly uploaded",
    id: user.id
  });
}
catch{
  //agafem possibles errors de la bbdd
  return res.json({
    code: '505',
    message: "Server Down",
  });


}
}

export async function createCompleteUser( req: Request,  res: Response ): Promise<Response> {
  const { userName, name, surname, password, email, phone, birthDate, image } = req.body;
   
  //Subimos la fotografia a la nube
  //await cloudinary.uploader.upload(image);

  const newUser = {
    userName: userName,
    name: name,
    surname: surname,
    password: password,
    email: email,
    phone: phone,
    profilePhoto: "uploads/"+req.file.filename,
    birthDate: birthDate,
    role: "USER"
  };
  console.log(newUser);
  try{
    var errorSave : Boolean = false;
    const user = new User(newUser); // creem l'objecte de MongoDB
    await user.save(function(err: boolean){
      console.log(err);
      if(err){
        errorSave = true;      
      }
      else{
        errorSave=false
      }
    }
    ); //guardem la foto amb mongoose
    
    if(errorSave){
      return res.json({
        code: '403',
        message: "Error en dades d'usuari"
      });
    }
    else{
      //Eliminem la fotografia
      await fs.unlink(path.resolve(user.profilePhoto))
      return res.json({
        code: '200',
        message: "User correctly uploaded",
        id: user.id
      });
    }
  }

catch{
  return res.json({
    code: '505',
    message: "Server Down",
  });

}
}
export async function createUserNoPhoto( req: Request,  res: Response ): Promise<Response> {
  const { userName, name, surname, password, email, phone, birthDate } = req.body;
   console.log(req.body);
  //Subimos la fotografia a la nube
  //await cloudinary.uploader.upload(image);

  const newUser = {
    userName: userName,
    name: name,
    surname: surname,
    password: password,
    email: email,
    phone: phone,
    profilePhoto: "https://res.cloudinary.com/repoblemapp/image/upload/v1623175090/noprofile_shlgxn.png",
    birthDate: birthDate,
    role: "USER",
    savedOffers: [],
    social: [],
  };
  console.log(newUser);
  try{
    var errorSave : Boolean = false;
    const user = new User(newUser); // creem l'objecte de MongoDB
    await user.save(function(err: boolean){
      console.log(err);
      if(err){
        errorSave = true;      
      }
      else{
        errorSave=false
      }
    }
    ); //guardem la foto amb mongoose
    
    if(errorSave){
      return res.json({
        code: '403',
        message: "Error en dades d'usuari"
      });
    }
    else{
      //Eliminem la fotografia
      //await fs.unlink(path.resolve(user.profilePhoto))
      return res.json({
        code: '200',
        message: "User correctly uploaded",
        id: user.id
      });
    }
  }

catch{
  return res.json({
    code: '505',
    message: "Server Down",
  });

}
}
export async function uploadPhotouser(req:Request, res:Response):Promise<Response>{
  //Hem de pujar la foto al serviodr des de la localització que li hem posat al multe
  try{
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log(result);
    //Un cop pujada hem de posar la nova direccio de la fotografia
    const userUpdated = await User.findByIdAndUpdate(
      req.params.id,
      {
        "profilePhoto": result.secure_url,
      },
    );
    //Borrem la imatge que tenim al servidor local
    await fs.unlink(path.resolve(req.file.path))

    return res.json({
      code: '200',
      message: "Image Uploaded to Cloudinary",
    });

      
    }
    catch (e){
      console.log(e);
      return res.json({
        code: '400',
        message: "Error Cloudinary",
      });
    }

}

export async function getUsers(req: Request, res: Response): Promise<Response> {
  var Users;
    try{
      Users = await User.find().populate();
      return res.json({
        code: '200',
        message: 'List of Users',
        usersList: Users
      });
      }
      catch{
        return res.json({
          code: '500',
          message: 'Server Down or BBDD broken',
          usersList: null
        }
          );
          }


}


export async function getUser(req: Request, res: Response): Promise<Response> {
  var user;
        try{
        user = await User.findById(req.params.id).populate("savedOffers createdOffers");
        return res.json({
          code: '200',
          message: 'User Found',
          user: user});
        }
        catch{
          return res.json({
            code: '500',
            message: 'Server Down or BBDD error',
            user: null});
          }
}

export async function deleteUser(req: Request, res: Response): Promise<Response> {
  try{
  //Borramos el usuario 
    const user = await User.findByIdAndDelete(req.params.id);
  //Borramos la fotografia
  if(user){
    try{
      await fs.unlink(path.resolve(user.profilePhoto))//eliminamos la fotografia del servidor
    }
    catch (e) {
      console.log(e);
    }
    return res.json({
      code: '200',
      message: "succesfully deleted user:" + user?.userName,
      id: user?.id});
    }
  else{
    return res.json({
      code: '404',
      message: "User not found",
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

export async function updateUser( req: Request, res: Response): Promise<Response> {
  const { id } = req.params;
  const {
    userName,
    name,
    surname,
    password,
    email,
    phone,
    profilePhoto,
    birthDate,
  } = req.body;
  try{
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        userName,
        name,
        surname,
        password,
        email,
        phone,
        profilePhoto,
        birthDate,
      },
      { new: true }
    );
    return res.json({
      code:"200",
      message: "successfully updated",
      updatedUser,
    });
  }
  catch{
    return res.json({
      code:"500",
      message: "User not updated"
      
    });

  }
}

export async function addOfferToFavourites(req: Request,res:Response): Promise<Response>{
  //Aquesta funció afegeix la oferta que ens pasen per body ( id ), al usuari que ens passen ( també id)

  const{ idUser, idOffer}=req.body;
  try{
    //hem de buscar l'usuari i modificar-lo
    //recollim usuari i afegim al vector de ofertes la nostre despres el guardem amb un update

    console.log(idUser);
    const user = await User.findById(idUser,'savedOffers');
    var vectorOffers = user.savedOffers;
    vectorOffers.push(idOffer);
    //console.log(vectorOffers);

    const userUpdated = await User.findByIdAndUpdate(
      idUser,
      {
        "savedOffers": vectorOffers,
      },
    );

    return res.json({
      code:"200",
      message: "successfully updated",
      user: userUpdated,
    }); 

  }
  catch (e){
    console.log(e);
    return res.json({
      code:"500",
      message: "Error en el servidor",
      user: null,
    }); 
  }


}
export async function deleteOfferOfFavourites(req: Request,res:Response): Promise<Response>{
  //Aquesta funció afegeix la oferta que ens pasen per body ( id ), al usuari que ens passen ( també id)

  const{idUser, idOffer}=req.body;
  try{
    const user = await User.findById(idUser,'savedOffers');
    
    console.log(user);
    var vectorOffers = user.savedOffers;
    console.log(vectorOffers);
    var i = vectorOffers.indexOf(idOffer);
    vectorOffers.splice(i,1);
    console.log(vectorOffers);

    const userUpdated = await User.findByIdAndUpdate(
      idUser,
      {
        "savedOffers": vectorOffers,
      },
    );
    return res.json({
      code:"200",
      message: "successfully updated",
      user: userUpdated,
    }); 

  }
  catch (e){
    console.log(e);
    return res.json({
      code:"500",
      message: "Error en el servidor",
      user: null,
    }); 
  }

}
