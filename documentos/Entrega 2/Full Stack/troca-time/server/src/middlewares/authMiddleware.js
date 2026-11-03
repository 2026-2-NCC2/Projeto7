import jwt from 'jsonwebtoken';
import { configs } from '../configs/configs.js';
import { AppException } from '../exceptions/appExceptions.js';

export function autenticar(req, res, next) {
    console.log(req.cookies);
    const token = req.cookies?.token;

    if (!token) {
        throw new AppException('Usuário não autenticado.', 401);
    }

    let payload;
    try {
        payload = jwt.verify(token, configs.jwt_secret);
    } catch (erro) {
        throw new AppException('Token inválido ou expirado.', 401);
    }

    req.usuario = {
        id: Number(payload.sub),
        tipo_usuario: payload.tipo_usuario
    };

    return next();
}

export function autorizar(...tiposPermitidos) {
    return (req, res, next) => {

        if (!tiposPermitidos.includes(req.usuario.tipo_usuario)) {
            throw new AppException('Você não tem permissão para acessar este recurso.', 403);
        }

        return next();
    };
}