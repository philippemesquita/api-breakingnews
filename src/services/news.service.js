import News from '../models/News.js';

const createService = (body) => News.create(body);

//Busca as News do banco de dados passado query padrão, ajustado na controller. (Paginação)
/*
    .sort({ _id: -1 })          // Ordena os resultados em ordem decrescente por id
    .skip(offset)               // Pula um número de documentos especificado por offset
    .limit(limit)               // Limita o número de documentos retornados ao valor de limit
    .populate("userId");        // Popula o campo userId com dados relacionados
*/

const findAllService = (offset, limit) => News.find().sort({ _id: -1 }).skip(offset).limit(limit).populate("userId");

//Conta quantos documents tem especificamente dentro desta collection, que no caso é a News.
const countNews = () => News.countDocuments();

const topNewsService = () => News.findOne().sort({ _id: -1 }).populate("userId");

const findByIdService = (id) => News.findById(id).populate("userId");

//Busca um dado específico no mongodb sem utilizar case sensitive
const searchByTitleService = (title) => News.find({ title: { $regex: `${title || ""}`, $options: "i" }, }).sort({ _id: -1 }).populate("userId");

//Busca a notícia por usuario, no caso o que estiver logado. O Id está vindo do authmiddleware.
const byUserService = (id) => News.find({ userId: id }).sort({ _id: -1 }).populate("userId");

const updateService = (id, title, text, banner) => News.findOneAndUpdate({ _id: id }, { title, text, banner }, { rawResult: true, });

const eraseService = (id) => News.findOneAndDelete({ _id: id });

const linkeNewsService = (idNews, userId) => News.findOneAndUpdate({ _id: idNews, "likes.userId": { $nin: [userId] } }, { $push: { likes: { userId, created: new Date() } } });

const deleteLikeNewsService = (idNews, userId) => News.findOneAndUpdate({ _id: idNews }, { $pull: { likes: { userId } } });

const addCommentService = (idNews, comment, userId) => {

    const idComment = Math.floor(Date.now() * Math.random()).toString(36);

    return News.findByIdAndUpdate({ _id: idNews }, { $push: { comments: { idComment, userId, comment, createdAt: new Date() } } });
}

const deleteCommentService = (idNews, idComment, userId) => News.findOneAndUpdate({ _id: idNews }, { $pull: { comments: { idComment, userId } } });


export default {
    createService,
    findAllService,
    countNews,
    topNewsService,
    findByIdService,
    searchByTitleService,
    byUserService,
    updateService,
    eraseService,
    linkeNewsService,
    deleteLikeNewsService,
    addCommentService,
    deleteCommentService
}