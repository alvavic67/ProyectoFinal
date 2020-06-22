//Express Import
import express from 'express';
import {Request, Response} from 'express';
//JSON Web Token Import
import jwt from 'jsonwebtoken';
//BcryptJS Import
import bcrypt from "bcryptjs";
//CORS Import
import cors from 'cors';
//Token Middleware IMport
import AuthToken from './middlewares/token.middleware';
//NomgoDBHelper Import
import MongoDbHelper from './helpers/mongodb.helper';
//Enviroments Import
import ENV from './environments/env.production';



//COnstant Declaration
const app = express();
const token = AuthToken();
const mongoDB = MongoDbHelper.getInstance(ENV.MONGODB);


//Middlewares for API
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//Middleware for CORS
app.use(cors({origin: true, credentials: true}));
app.get('/api/auth/testing',(req:Request, res:Response) => {
    res.status(200).json({
        ok: true,
        msg: 'Metodo de testing funcionando correctamente'
    });
});
app.post('/api/auth/login', async (req:Request, res:Response) => {
    const {userName, password} = req.body;
    //Mock user
    //const mockUser = {
    //    id: 1,
    //    userName: 'ematag@gmail.com',
    //    password: '12345',
    //    name: 'Esteban Mata',
    //    photo: 'url',
    //    rol: 'ROL_PIE'
    //};

    const user = await mongoDB.db.collection('users').findOne({email: userName});
    
    if(user){
        if(!bcrypt.compareSync(password, user.password)){
            return res.status(403).json({
                ok:false,
                msg:'Lo sentimos el usuario y/o conrtaseña no son validos !!!'
            });
        }
    
        //const userValid = {
        //    uid: mockUser.id,
        //    email: mockUser.userName,
        //    fullName: mockUser.name,
        //    urlPhoto: mockUser.photo,
        //    rol: mockUser.rol
        //}
        const userValid = {
            uid: user._id,
            email: user.email,
            fullName: user.fullName,
            urlPhoto: user.urlPhoto,
            rol: user.rol
        }
    
            jwt.sign(userValid, 'secretkeyword', {expiresIn: '120s'}, (err:any, token)=>{
                if(err){
                    return res.status(500).json({
                        ok: false,
                        msg: 'Ocurrio un error no contemplado',
                        err
                    })
                }
                res.status(200).json({
                    ok: true,
                    msg: 'El ususario se autentico con exito',
                    token,
                    rol: userValid.rol
                }); 
            });
    }
    else{
        return res.status(404).json({
            ok: false,
            msg: 'Lo sentimos el usuario y/o conrtaseña no son validos !!!',   
        })
    }


    
});
app.post('api/auth/createUser', async(req: Request, res: Response) => {
    const {email, password, fullName, urlPhoto, rol} = req.body;

    const newUser = {
        email, password:bcrypt.hashSync(password, 10), fullName, urlPhoto, rol
    }
    const insert = await mongoDB.db.collection('users').insertOne(newUser);

    res.status(200).json({
        ok: true,
        msg: 'Usuario creado de forma correcta!!!',
        uid: insert.insertedId
    })
});


app.get('/api/auth/getCustomers', token.verify, (req:Request, res:Response) =>{
    const { authUser } = req.body;

    const mockCustomer = [
        {
            clave: 'ALFKI',
            nombre: 'American Axel'
        },
        {
            clave: 'GKN',
            nombre: 'Grupo Pirelli'
        },
        {
            clave: 'GM',
            nombre: 'General Motors'
        }
    ];

    res.status(200).json({
        ok: true,
        msg: 'Permiso de acceso concedido',
        data: mockCustomer,
        user: authUser
    });
});

app.listen(ENV.API.PORT, async()=> {
    console.log(`Servidor de APIs funcionando correctamente en el puerto ${ENV.API.PORT}`);
    //Connect to mongoDB
    await mongoDB.connect();
});

//Handle errors
process.on('unhandledRejection', async(err:any) => {
    mongoDB.close();
    process.exit();
});


