import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

export default () => {
    return {
        verify:  (req: Request, res: Response, next: NextFunction) => {
            //Get Auth Header Values
            const bearerHeader = req.headers['authorization'];
            if(typeof bearerHeader !== 'undefined'){
                //Split
                const bearer = bearerHeader.split(' ');
                //Get oken from array
                const bearerToken = bearer[1];
                //Verify token
                jwt.verify(bearerToken, 'secretkeyword', (err:any, tokenDecoded: any) =>{
                    if(err){
                        //Forbidden
                        return res.status(403).json({
                            ok: false,
                            msg: 'Lo sentimos usted no tiene acceso, favor de verificar'
                        });
                    }

                    req.body.authUser = tokenDecoded;
                    next();
                });
            }
            else{
                //UNauthorized
                return res.status(401).json({
                    ok: false,
                    msg: 'Lo sentimos el acceso es restringido, requiere iniciar sesion para acceder'
                });
            }
        }
    }
}