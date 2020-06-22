"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = (function () {
    return {
        verify: function (req, res, next) {
            //Get Auth Header Values
            var bearerHeader = req.headers['authorization'];
            if (typeof bearerHeader !== 'undefined') {
                //Split
                var bearer = bearerHeader.split(' ');
                //Get oken from array
                var bearerToken = bearer[1];
                //Verify token
                jsonwebtoken_1.default.verify(bearerToken, 'secretkeyword', function (err, tokenDecoded) {
                    if (err) {
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
            else {
                //UNauthorized
                return res.status(401).json({
                    ok: false,
                    msg: 'Lo sentimos el acceso es restringido, requiere iniciar sesion para acceder'
                });
            }
        }
    };
});
