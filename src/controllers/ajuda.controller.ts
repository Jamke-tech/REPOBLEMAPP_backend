import {Request, Response} from 'express'
import Ajuda from '../models/Ajuda'
import User from '../models/User';



export async function createAjuda( req: Request, res: Response): Promise<Response>{
    //Recuperem la info de request body per poder-la treure i posar-la a la base de dades
        const {id}=req.params;
    
        const {
            owner,
            admin,
            message,
        } = req.body;
    
        //Posem tot en una nova variable de Offer
        const newAjuda = {
            owner: owner,
            admin: admin,
            message: message,
            
        };
        console.log(newAjuda);
        try{
            var errorSave : Boolean = false;
            const ajuda = new Ajuda(newAjuda);//creació del document de mongodb
            const ajudaSaved = await ajuda.save(function(err: boolean){
              console.log(err);
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
    
                const admin = User.findById(id);
    
                var ajudesCreated = admin.createdAjudes;
                ajudesCreated.push(ajudaSaved._id);
                const userUpdated = await User.findByIdAndUpdate(
                  id,
                  {
                    "createdAjudes": ajudesCreated,
                  },
                );
    
                
    
                
                return res.json({
                    code: '200',
                    message: "Ajuda correctly uploaded",
                    idAjuda: ajuda.id
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

    export async function getAjudes (req:Request, res: Response): Promise<Response>{
        //Funció que retorna tota la llista de ofertes sense cap filtre
        const ajudes= await Ajuda.find().populate();
        try{
            return res.json({
                code: '200',
                message: 'List of Ajudes',
                numberOffers: ajudes.length,
                offersList: ajudes
                });
        }
        catch{
          return res.json({
            code: '500',
            message: 'Server Down or BBDD broken',
            numberAjudes: 0,
            usersList: null
          }
            );
        }
    }

    export async function getAjuda(req: Request, res: Response): Promise<Response> {
        try{
        const ajuda = await Ajuda.findById(req.params.id).populate();
        
        
        return res.json({
          code: '200',
          message: 'Ajuda Found',
          ajuda: ajuda});
        }
        catch{
          return res.json({
            code: '500',
            message: 'Server Down or BBDD error',
            ajuda: null});
          }
      
      }