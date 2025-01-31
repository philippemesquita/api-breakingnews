import userService from '../services/user.service.js';

const create = async (req, res) => {
    try {
        const { name, username, email, password, avatar, background } = req.body;

        if (!name || !username || !email || !password || !avatar || !background) {
            res.status(400).send({ message: "Submit all fields for registration" });
        }

        const user = await userService.createService(req.body);

        if (!user) {
            return res.status(400).send({ message: "Error creating User" })
        }

        res.status(201).send({
            message: "User created successfully",
            user: {
                id: user._id,
                name,
                username,
                email,
                avatar,
                background
            },
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const findAll = async (req, res) => {
    try {
        const users = await userService.findAllService();

        if (users.length === 0) {
            return res.status(400).send({ message: "There are no registered users" });
        }

        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const findById = async (req, res) => {
    try {
        const user = req.user; //Recebendo o user do middleware, já que que está sendo adquirido e enviado por ele.
        res.send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { name, username, email, password, avatar, background } = req.body;

        if (!name && !username && !email && !password && !avatar && !background) {
            res.status(400).send({ message: "Submit at least one field for update" });
        };

        const id = req.id; //Recebendo o id do middleware, já que que está sendo adquirido e enviado por ele.

        await userService.updateService(
            id,
            name,
            username,
            email,
            password,
            avatar,
            background
        );

        res.send({ message: "User successfully updated!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

};

const deleteUser = async (req, res) => {
    try {
        const id = req.id; //Recebo o id do middleware, já que está sendo adiquirido e enviado por ele.
        await userService.deleteService(id);
        res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export default { create, findAll, findById, update, deleteUser };