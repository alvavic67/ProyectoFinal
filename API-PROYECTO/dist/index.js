"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Express Import
var express_1 = __importDefault(require("express"));
//JSON Web Token Import
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//CORS Import
var cors_1 = __importDefault(require("cors"));
//Token Middleware IMport
var token_middleware_1 = __importDefault(require("./middlewares/token.middleware"));
//Enviroments Import
var env_production_1 = __importDefault(require("./environments/env.production"));
//COnstant Declaration
var app = express_1.default();
var token = token_middleware_1.default();
//Middlewares for API
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
//Middleware for CORS
app.use(cors_1.default({ origin: true, credentials: true }));
app.get('/api/auth/testing', function (req, res) {
    res.status(200).json({
        ok: true,
        msg: 'Metodo de testing funcionando correctamente'
    });
});
app.post('/api/auth/login', function (req, res) {
    var _a = req.body, userName = _a.userName, password = _a.password;
    //Mock user
    var mockUser = {
        id: 1,
        userName: 'ematag@gmail.com',
        roles: ['admin', 'supervisor']
    };
    if (userName == 'ematag@gmail.com' && password == '123456') {
        jsonwebtoken_1.default.sign(mockUser, 'secretkeyword', { expiresIn: '120s' }, function (err, token) {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    msg: 'Ocurrio un error no contemplado',
                    err: err
                });
            }
            res.status(200).json({
                ok: true,
                msg: 'El ususario se autentico con exito',
                token: token
            });
        });
    }
    else {
        res.status(403).json({
            ok: false,
            msg: 'Lo sentimos, el susuario y/o contraseña proporcionados no son validos. Favor de verificar !!!'
        });
    }
});
app.get('/api/auth/getCustomers', token.verify, function (req, res) {
    var authUser = req.body.authUser;
    var mockCustomer = [
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
app.listen(env_production_1.default.API.PORT, function () {
    console.log("Servidor de APIs funcionando correctamente en el puerto " + env_production_1.default.API.PORT);
});
