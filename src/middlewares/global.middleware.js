import mongoose from 'mongoose';
import userService from '../services/user.service.js';

const validId = (req, res, next) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid ID" });
        };

        return next();
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const validUser = async (req, res, next) => {
    try {
        const id = req.params.id;

        const user = await userService.findByIdService(id);

        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }

        req.id = id; //Envio o id para a proxima função que no caso é a 'user.controller';
        req.user = user; //Envio o user para a proxima função que no caso é a 'user.controller';

        return next();
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export { validId, validUser };