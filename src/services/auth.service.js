import User from "../models/User.js";
import jwt from "jsonwebtoken";

//Faz a busca por email no db. Quando se coloca entre 'chaves' fica como um filtro, que no caso está buscando pelo campo de email.
const loginService = (email) => User.findOne({ email: email }).select("+password");

const generateToken = (id) => jwt.sign({ id: id }, process.env.SECRET_JWT, {expiresIn: 86400});

export { loginService, generateToken }