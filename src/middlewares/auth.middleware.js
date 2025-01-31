import jwt from 'jsonwebtoken';
import userService from '../services/user.service.js';

import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = (req, res, next) => {

    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.send(401);
        }

        const parts = authorization.split(" ");

        if (parts.length !== 2) {
            return res.send(401);
        }

        const [Bearer, token] = parts;

        if (Bearer !== "Bearer") {
            return res.send(401);
        }

        jwt.verify(token, process.env.SECRET_JWT, async (error, decoded) => {
            if (error) {
                return res.status(401).send({ message: "Ivalid token" });
            }

            const user = await userService.findByIdService(decoded.id);

            if (!user || !user.id) {
                return res.status(401).send({ message: "Ivalid token" });
            }

            req.userId = user.id;

            return next();
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


export { authMiddleware }