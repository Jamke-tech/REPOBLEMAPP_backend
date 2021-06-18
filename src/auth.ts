import { Request, Response , NextFunction} from "express";
const jwt = require('jsonwebtoken');

module.exports = (req:Request, res:Response, next:NextFunction) => {
  try {
    const token = req.headers['authorization'];
    const decodedToken = jwt.verify(token, 'secret',async (err: any,decoded: any)=>{ 
        if(err){
            res.status(401).json({
                error: new Error('Invalid request!')
              });
        }
        else{
            next();
        }
    });
    
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};