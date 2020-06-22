"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Express Import
var express_1 = __importDefault(require("express"));
//JSON Web Token Import
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//BcryptJS Import
var bcryptjs_1 = __importDefault(require("bcryptjs"));
//CORS Import
var cors_1 = __importDefault(require("cors"));
//Token Middleware IMport
var token_middleware_1 = __importDefault(require("./middlewares/token.middleware"));
//NomgoDBHelper Import
var mongodb_helper_1 = __importDefault(require("./helpers/mongodb.helper"));
//Enviroments Import
var env_production_1 = __importDefault(require("./environments/env.production"));
//COnstant Declaration
var app = express_1.default();
var token = token_middleware_1.default();
var mongoDB = mongodb_helper_1.default.getInstance(env_production_1.default.MONGODB);
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
app.post('/api/auth/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userName, password, user, userValid_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, userName = _a.userName, password = _a.password;
                return [4 /*yield*/, mongoDB.db.collection('users').findOne({ email: userName })];
            case 1:
                user = _b.sent();
                if (user) {
                    if (!bcryptjs_1.default.compareSync(password, user.password)) {
                        return [2 /*return*/, res.status(403).json({
                                ok: false,
                                msg: 'Lo sentimos el usuario y/o conrtaseña no son validos !!!'
                            })];
                    }
                    userValid_1 = {
                        uid: user._id,
                        email: user.email,
                        fullName: user.fullName,
                        urlPhoto: user.urlPhoto,
                        rol: user.rol
                    };
                    jsonwebtoken_1.default.sign(userValid_1, 'secretkeyword', { expiresIn: '120s' }, function (err, token) {
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
                            token: token,
                            rol: userValid_1.rol
                        });
                    });
                }
                else {
                    return [2 /*return*/, res.status(404).json({
                            ok: false,
                            msg: 'Lo sentimos el usuario y/o conrtaseña no son validos !!!',
                        })];
                }
                return [2 /*return*/];
        }
    });
}); });
app.post('api/auth/createUser', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, fullName, urlPhoto, rol, newUser, insert;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password, fullName = _a.fullName, urlPhoto = _a.urlPhoto, rol = _a.rol;
                newUser = {
                    email: email, password: bcryptjs_1.default.hashSync(password, 10), fullName: fullName, urlPhoto: urlPhoto, rol: rol
                };
                return [4 /*yield*/, mongoDB.db.collection('users').insertOne(newUser)];
            case 1:
                insert = _b.sent();
                res.status(200).json({
                    ok: true,
                    msg: 'Usuario creado de forma correcta!!!',
                    uid: insert.insertedId
                });
                return [2 /*return*/];
        }
    });
}); });
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
app.listen(env_production_1.default.API.PORT, function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Servidor de APIs funcionando correctamente en el puerto " + env_production_1.default.API.PORT);
                //Connect to mongoDB
                return [4 /*yield*/, mongoDB.connect()];
            case 1:
                //Connect to mongoDB
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//Handle errors
process.on('unhandledRejection', function (err) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        mongoDB.close();
        process.exit();
        return [2 /*return*/];
    });
}); });
